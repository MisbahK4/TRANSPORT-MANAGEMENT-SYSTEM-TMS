from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from .models import Package, Chat_Message, Offer, Invoice, Tracking, Vehicle, Staff

User = get_user_model()


# -------------------
# AUTH SERIALIZERS
# -------------------
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password2',
            'is_owner', 'is_transporter', 'company_name', 'phone_no',
            'address', 'state', 'country'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        is_owner = validated_data.pop('is_owner', False)
        is_transporter = validated_data.pop('is_transporter', False)
        user = User.objects.create_user(
            **validated_data,
            is_owner=bool(is_owner),
            is_transporter=bool(is_transporter)
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "is_owner",
            "is_transporter",
            "company_name",
            "phone_no",
            "address",
            "state",
            "country",
        ]
        read_only_fields = ["id", "email"]



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_owner'] = user.is_owner
        token['is_transporter'] = user.is_transporter
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not user.is_active:
            raise AuthenticationFailed("User account is disabled.")
        data['is_owner'] = user.is_owner
        data['is_transporter'] = user.is_transporter
        return data


# -------------------
# SAFE USER SERIALIZER (only ID + username + company name)
# -------------------
class SafeUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'company_name']  # 🚫 no email/phone/address


# -------------------
# PACKAGE SERIALIZERS
# -------------------
class PublicPackageSerializer(serializers.ModelSerializer):
    """Minimal package data for marketplace & dashboards (no sensitive user info)."""
    images = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Package
        fields = [
            "id", "title", "pickup_location", "drop_location",
            "weight", "price_expectation", "images",
            "status", "create_at","description"
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")
        if instance.images and request:
            rep["images"] = request.build_absolute_uri(instance.images.url)
        return rep


class PackageSerializer(serializers.ModelSerializer):
    """
    Use this if you want to include owner/transporter reference safely.
    Still avoids exposing sensitive fields.
    """
    user = SafeUserSerializer(read_only=True)
    booked_by = SafeUserSerializer(read_only=True)
    images = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = Package
        fields = [
            "id", "user", "booked_by", "title", "description",
            "pickup_location", "drop_location", "weight",
            "price_expectation", "images", "status", "create_at"
        ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        request = self.context.get("request")
        if instance.images and request:
            rep["images"] = request.build_absolute_uri(instance.images.url)
        return rep


# -------------------
# CHAT
# -------------------
class ChatMessageSerializer(serializers.ModelSerializer):
    sender = SafeUserSerializer(read_only=True)
    sender_role = serializers.SerializerMethodField()

    class Meta:
        model = Chat_Message
        fields = ["id", "room", "sender", "sender_role", "message", "timestamp"]
        read_only_fields = ["id", "sender", "sender_role", "timestamp"]

    def get_sender_role(self, obj):
        user = obj.sender
        if user.is_owner:
            return "owner"
        if user.is_transporter:
            return "transporter"
        return "unknown"

    def create(self, validated_data):
        validated_data["sender"] = self.context["request"].user
        return super().create(validated_data)


# -------------------
# INVOICE
# -------------------
class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = ["id", "package", "transporter", "invoice_number", "amount", "issue_at", "paid"]
        read_only_fields = ["invoice_number", "issue_at"]


# -------------------
# TRACKING
# -------------------
class TrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tracking
        fields = ["id", "package", "latitude", "longitude", "update_at"]
        read_only_fields = ["id", "update_at"]


# -------------------
# OFFER
# -------------------
class OfferSerializer(serializers.ModelSerializer):
    sender = SafeUserSerializer(read_only=True)
    package = PublicPackageSerializer(read_only=True)
    package_id = serializers.PrimaryKeyRelatedField(
        queryset=Package.objects.all(), source="package", write_only=True
    )

    class Meta:
        model = Offer
        fields = [
            "id", "package", "package_id", "sender",
            "offer_price", "status", "changed_by_owner",
            "created_at",
        ]
        read_only_fields = ["id", "sender", "created_at"]

    def create(self, validated_data):
        return Offer.objects.create(**validated_data)


# -------------------
# VEHICLE
# -------------------
class VehicleSerializer(serializers.ModelSerializer):
    transporter = SafeUserSerializer(read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            "id", "transporter", "truck_model", "truck_number",
            "wheels", "capacity", "available",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "transporter", "created_at", "updated_at"]


# -------------------
# STAFF
# -------------------
class StaffSerializer(serializers.ModelSerializer):
    transporter = SafeUserSerializer(read_only=True)
    vehicle = VehicleSerializer(read_only=True)

    vehicle_number = serializers.CharField(write_only=True, required=True)
    assigned_vehicle_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Staff
        fields = [
            "id", "transporter", "name", "contact", "license_number", "role",
            "vehicle", "vehicle_number", "assigned_vehicle_number",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "transporter", "created_at", "updated_at"]

    def get_assigned_vehicle_number(self, obj):
        return getattr(obj.vehicle, "truck_number", None)

    def _resolve_vehicle(self, vehicle_number):
        request = self.context.get("request")
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError({"vehicle_number": "Authentication required."})
        try:
            return Vehicle.objects.get(truck_number=vehicle_number, transporter=request.user)
        except Vehicle.DoesNotExist:
            raise serializers.ValidationError({"vehicle_number": "No such vehicle for this account."})

    def _validate_vehicle_assignment(self, vehicle, role, instance=None):
        staff_qs = vehicle.staff.all()
        if instance:
            staff_qs = staff_qs.exclude(pk=instance.pk)
        drivers = staff_qs.filter(role="driver").count()
        helpers = staff_qs.filter(role="helper").count()
        if role == "driver" and drivers >= 1:
            raise serializers.ValidationError({"role": "This vehicle already has a driver assigned."})
        if role == "helper" and helpers >= 2:
            raise serializers.ValidationError({"role": "This vehicle already has two helpers assigned."})
        return True

    def validate_contact(self, value):
        if len(value) < 7:
            raise serializers.ValidationError("Contact number looks too short.")
        return value

    def create(self, validated_data):
        vehicle_number = validated_data.pop("vehicle_number")
        role = validated_data.get("role")
        vehicle = self._resolve_vehicle(vehicle_number)
        self._validate_vehicle_assignment(vehicle, role)
        validated_data["vehicle"] = vehicle
        return super().create(validated_data)

    def update(self, instance, validated_data):
        vehicle_number = validated_data.pop("vehicle_number", None)
        role = validated_data.get("role", instance.role)
        vehicle = instance.vehicle
        if vehicle_number:
            vehicle = self._resolve_vehicle(vehicle_number)
        self._validate_vehicle_assignment(vehicle, role, instance)
        validated_data["vehicle"] = vehicle
        return super().update(instance, validated_data)
