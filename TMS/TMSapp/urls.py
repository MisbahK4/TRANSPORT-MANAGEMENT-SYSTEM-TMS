from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    Registerview, MarketplaceViewSet, Packageviewset, OfferViewSet, 
    ChatMessageViewSet, InvoiceViewSet, TrackingViewSet, 
    DashboardAnalytics, MyTokenObtainPairView, CurrentUserView,
    VehicleViewSet, StaffViewSet,
)

router = DefaultRouter()
router.register(r"packages",Packageviewset , basename="packages")
router.register(r"offers", OfferViewSet, basename="offers")
router.register(r"chatmessages", ChatMessageViewSet, basename="chatmessage")
router.register(r"invoices", InvoiceViewSet, basename="invoice")
router.register(r"tracking", TrackingViewSet, basename="tracking")
router.register(r"marketplace", MarketplaceViewSet, basename="marketplace")
router.register(r"vehicles", VehicleViewSet, basename="vehicle")
router.register(r"staff", StaffViewSet, basename="staff")
# router.register(r"ReadyToLoad", ReadyToLoadPackages, basename="ReadyToLoadPackages")

urlpatterns = [
    path('api/users/', CurrentUserView.as_view(), name='current-user'),
    path('api/register/', Registerview.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='login'),
    
    # Dashboards
    path('api/analytics/', DashboardAnalytics.as_view(), name='dashboard-analytics'),  
    path('api/', include(router.urls)),
]
