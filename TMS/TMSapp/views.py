from django.shortcuts import get_object_or_404
from django.db.models import Sum, Q
from django.contrib.auth import authenticate, login

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions,decorators,response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied

from .models import Package, Offer, Chat_Message, Invoice, Tracking, Vehicle, Staff,ChatRoom
from .serializers import (
    RegisterSerializer, LoginSerializer, PackageSerializer,
    ChatMessageSerializer, InvoiceSerializer, TrackingSerializer,
    UserSerializer, OfferSerializer, MyTokenObtainPairSerializer,
    VehicleSerializer, StaffSerializer,PublicPackageSerializer,SafeUserSerializer
)
from django.http import FileResponse
from django.core.mail import EmailMessage
from .utils import generate_invoice_pdf, send_invoice_email
from .permissions import isOwnerOrReadonly



class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
        


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer



class Registerview(APIView):
    permission_classes = [permissions.AllowAny]  

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration completed'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login View (if not using JWT)
class Loginview(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Package CRUD

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

class Packageviewset(viewsets.ModelViewSet):
    queryset = Package.objects.all().order_by('-create_at')
    serializer_class = PackageSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        action = getattr(self, "action", None)

        # Admins see all
        if getattr(user, "is_staff", False) or getattr(user, "is_superuser", False):
            return qs

        # For object-level actions
        if action in {"retrieve", "update", "partial_update", "destroy"}:
            return qs.filter(Q(user=user) | Q(booked_by=user))

        # List behavior
        if getattr(user, "is_owner", False):
            return qs.filter(user=user)
        if getattr(user, "is_transporter", False):
            return qs.filter(Q(status="Available") | Q(booked_by=user))

        return qs.none()

    def perform_destroy(self, instance):
        user = self.request.user
        is_admin = getattr(user, "is_staff", False) or getattr(user, "is_superuser", False)
        if not (is_admin or instance.user_id == user.id or instance.booked_by_id == user.id):
            raise PermissionDenied("You don't have permission to delete this package.")
        instance.delete()

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def book(self, request, pk=None):
        package = self.get_object()
        package.booked_by = request.user
        package.status = "Booked"
        package.save()
        return Response({"message": "Package booked successfully"})

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def current_deliveries(self, request):
        user = request.user
        qs = Package.objects.filter(
            booked_by=user,
            status="Booked"
        ).order_by('-create_at')
        return Response(PackageSerializer(qs, many=True, context={"request": request}).data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def mark_loaded(self, request, pk=None):
        package = self.get_object()

        if package.booked_by != request.user:
            return Response(
                {"error": "You are not allowed to mark this package as loaded."},
                status=status.HTTP_403_FORBIDDEN
            )

        package.status = "Loaded"
        package.save()
        return Response({"message": "Package marked as loaded."}, status=status.HTTP_200_OK)

    # ✅ NEW endpoint for Loaded Packages
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def loaded(self, request):
        user = request.user
        qs = Package.objects.filter(
            Q(user=user) | Q(booked_by=user),
            status="Loaded"
        ).order_by('-create_at')
        return Response(PackageSerializer(qs, many=True, context={"request": request}).data)



class OfferViewSet(viewsets.ModelViewSet):
    queryset = Offer.objects.all().order_by("-created_at")
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Only show offers where user is sender or receiver"""
        user = self.request.user
        return self.queryset.filter(Q(sender=user) | Q(receiver=user))

    def perform_create(self, serializer):
        """When creating an offer, set sender and receiver"""
        package = serializer.validated_data["package"]
        serializer.save(
            sender=self.request.user,
            receiver=package.user
        )

    # ----------------- Actions ----------------- #

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        """Owner accepts an offer → package booked"""
        offer = self.get_object()
        offer.status = "accepted"
        offer.changed_by_owner = False
        offer.save()

        package = offer.package
        package.status = "Booked"
        package.booked_by = offer.sender
        package.price_expectation = offer.offer_price  # ✅ final agreed price
        package.save()

        return Response({"message": "Offer accepted and package booked."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        """Owner rejects an offer"""
        offer = self.get_object()
        offer.status = "rejected"
        offer.changed_by_owner = False
        offer.save()
        return Response({"message": "Offer rejected."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def counter(self, request, pk=None):
        """Owner OR Transporter sends counter-offer"""
        offer = self.get_object()

        # Only sender or receiver can counter
        if request.user not in [offer.sender, offer.receiver]:
            return Response({"error": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

        new_price = request.data.get("offer_price")
        if not new_price:
            return Response({"error": "New offer price required."}, status=status.HTTP_400_BAD_REQUEST)

        offer.offer_price = new_price
        offer.status = "pending"
        offer.changed_by_owner = (request.user == offer.receiver)  # ✅ True if owner countered
        offer.save()

        return Response(
            {"message": "Counter offer sent.", "offer_price": new_price},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["get"])
    def my_offers(self, request):
        """Return offers created by the logged-in user"""
        offers = self.queryset.filter(sender=request.user)
        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"])
    def book(self, request, pk=None):
        """Transporter finalizes booking AFTER owner accepts"""
        offer = self.get_object()
        if offer.status != "accepted":
            return Response({"error": "Only accepted offers can be booked."}, status=status.HTTP_400_BAD_REQUEST)

        package = offer.package
        package.status = "Booked"
        package.booked_by = offer.sender
        package.price_expectation = offer.offer_price
        package.save()

        return Response({"message": "Booking finalized."}, status=status.HTTP_200_OK)
    
# ✅ Chat Messages CRUD
class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = Chat_Message.objects.all().order_by("timestamp")
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        room_id = self.request.query_params.get("room")
        if room_id:
            qs = qs.filter(room_id=room_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=False, methods=["get"])
    def ongoing(self, request):
        user = request.user
        # Find rooms where the user is either owner or transporter
        rooms = ChatRoom.objects.filter(
            Q(owner=user) | Q(transporter=user)
        ).select_related("package")

        # Get latest messages from all rooms of this user
        messages = Chat_Message.objects.filter(room__in=rooms) \
            .select_related("room", "sender", "room__package") \
            .order_by("timestamp")

        return Response(self.get_serializer(messages, many=True).data)


# ✅ Invoice CRUD

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by("-issue_at")
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(package__user=user)

    @action(detail=True, methods=["post"])
    def mark_paid(self, request, pk=None):
        """Mark invoice as paid"""
        invoice = self.get_object()
        invoice.paid = True
        invoice.save()
        return Response({"status": "Invoice marked as paid"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        """Generate invoice for a package, send PDF via email"""
        package_id = request.data.get("package_id")
        amount = request.data.get("amount")

        if not package_id or not amount:
            return Response(
                {"error": "package_id and amount are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        package = get_object_or_404(Package, id=package_id)

        # Only package owner can generate invoice
        if package.user != request.user:
            return Response(
                {"error": "You are not allowed to generate invoice for this package"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Prevent duplicate invoices
        if package.invoices.exists():
            return Response(
                {"error": "Invoice already exists for this package"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create the invoice
        invoice = Invoice.objects.create(
            package=package,
            transporter=package.booked_by,   # assuming Package has transporter field
            amount=amount,
        )

        # Generate PDF
        pdf_buffer = generate_invoice_pdf(invoice)

        # Send email using Owner's email as reply_to
        owner_email = package.user.email
        send_invoice_email(invoice, pdf_buffer, owner_email)

        return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get"])
    def download_pdf(self, request, pk=None):
        """Download invoice as a PDF"""
        invoice = self.get_object()
        buffer = generate_invoice_pdf(invoice)
        filename = f"Invoice_{invoice.invoice_number}.pdf"

        return FileResponse(
            buffer, as_attachment=True, filename=filename, content_type="application/pdf"
        )
# ✅ Tracking CRUD
class TrackingViewSet(viewsets.ModelViewSet):
    queryset = Tracking.objects.all()
    serializer_class = TrackingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return self.queryset
        return self.queryset.filter(package__user=user)


# ✅ Dashboard Analytics
class DashboardAnalytics(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        base_qs = Package.objects.filter(user=user) if not user.is_staff else Package.objects.all()

        total_packages = base_qs.count()
        current = base_qs.filter(status="Available").count()
        negotiating = base_qs.filter(status="Negotiating").count()
        ready_to_load = base_qs.filter(status="Booked").count()
        delivered = base_qs.filter(status="Delivered").count()
        total_offers = Offer.objects.filter(package__in=base_qs).count()
        total_invoice_amount = Invoice.objects.filter(package__in=base_qs).aggregate(total=Sum("amount"))["total"] or 0

        data = {
            "total_packages": total_packages,
            "current_packages": current,
            "negotiating_packages": negotiating,
            "ready_to_load": ready_to_load,
            "delivered_packages": delivered,
            "total_offers": total_offers,
            "total_invoice_amount": float(total_invoice_amount),
        }
        return Response(data)


# ✅ Marketplace (public)
class MarketplaceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Package.objects.filter(status="Available")
    serializer_class = PublicPackageSerializer
    permission_classes = [permissions.AllowAny]



class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all().order_by("-created_at")
    serializer_class = VehicleSerializer
    permission_classes = [permissions.IsAuthenticated]
    print('iam in')
    def get_queryset(self):
        user = self.request.user
        if user.is_transporter:
            print(self.queryset.filter(transporter=user))
            return self.queryset.filter(transporter=user)
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(transporter=self.request.user)


# ✅ Staff Management
class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all().order_by("-created_at")
    serializer_class = StaffSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, "is_superuser", False):
            return self.queryset
        if getattr(user, "is_transporter", False):
            return self.queryset.filter(transporter=user)
        return self.queryset.none()

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def perform_create(self, serializer):
        serializer.save(transporter=self.request.user)

    @decorators.action(detail=False, methods=["get"], url_path="by-vehicle")
    def staff_by_vehicle(self, request):
        """
        Return staff grouped by vehicle: one driver + helpers
        """
        user = request.user
        vehicles = Vehicle.objects.filter(transporter=user)

        data = []
        for v in vehicles:
            driver = v.staff.filter(role="driver").first()
            helpers = v.staff.filter(role="helper")
            data.append({
                "truck_number": v.truck_number,
                "driver": StaffSerializer(driver).data if driver else None,
                "helpers": StaffSerializer(helpers, many=True).data,
            })
        return response.Response(data)