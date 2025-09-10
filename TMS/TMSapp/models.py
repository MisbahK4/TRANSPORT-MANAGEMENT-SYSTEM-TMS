from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.utils import timezone
from django.utils.timezone import now
import uuid

# Create your models here.
class User(AbstractUser):
    is_owner = models.BooleanField(default=False)
    is_transporter = models.BooleanField(default=False)
    company_name = models.TextField(blank=True, null=True)
    phone_no = models.BigIntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.username

class Package(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='packages'   # Owner who created the package
    )
    booked_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='booked_packages'   # Transporter who books it
    )

    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    pickup_location = models.TextField(max_length=300)
    drop_location = models.TextField(max_length=300)
    weight = models.FloatField(help_text='Weight in KG')
    price_expectation = models.DecimalField(max_digits=10, decimal_places=2)
    images = models.ImageField(upload_to='packages/', blank=True, null=True)

    status_choice = [
        ('Available', 'Available'),
        ('Negotiating', 'Negotiating'),
        ('Booked', 'Booked'),
        ('Loaded', 'Loaded'), 
        ('Delivered', 'Delivered')
    ]
    status = models.CharField(max_length=20, choices=status_choice, default='Available')
    create_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f'{self.title} ({self.pickup_location} -> {self.drop_location})'

class ChatRoom (models.Model):
    package = models.ForeignKey(Package,on_delete=models.CASCADE,related_name='chat_rooms')
    owner =  models.ForeignKey(User,on_delete=models.CASCADE,related_name='owner_rooms')
    transporter =  models.ForeignKey(User,on_delete=models.CASCADE,related_name='transporter_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("package", "owner", "transporter")

    def __str__(self):
        return f"Room {self.id} - Package {self.package.title}"    


class Chat_Message(models.Model):
    room = models.ForeignKey(ChatRoom,on_delete=models.CASCADE,related_name='messages', null=True)
    sender = models.ForeignKey(User,on_delete=models.CASCADE,related_name='sent_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender.username}: {self.message[:30]}'
    
# models.py
class Offer(models.Model):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="offers")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_offers")
    receiver = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name="received_offers",
    null=True,      
    blank=True,     
)

    offer_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=[("pending", "Pending"), ("accepted", "Accepted"), ("rejected", "Rejected")],
        default="pending",
    )
    changed_by_owner = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Offer {self.id} - {self.package.title} ({self.status})"


def generate_invoice_number():
    return f"INV-{uuid.uuid4().hex[:8].upper()}"

class Invoice(models.Model):
    package = models.ForeignKey(
        "Package", on_delete=models.CASCADE, related_name="invoices"
    )
    transporter = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_invoices", null=True
    )
    invoice_number = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    issue_at = models.DateTimeField(default=timezone.now)  
    paid = models.BooleanField(default=False)

    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            self.invoice_number = generate_invoice_number()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {'Paid' if self.paid else 'Unpaid'}"
class Tracking(models.Model):
    package = models.OneToOneField(Package,on_delete=models.CASCADE,related_name='tracking')
    latitude = models.DecimalField(max_digits=9,decimal_places=6,null=True,blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    update_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Tracking for {self.package.title}'

class Vehicle(models.Model):
    transporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles"
    )
    truck_model = models.CharField(max_length=100,null=True)
    truck_number = models.CharField(max_length=50, unique=True)
    capacity = models.DecimalField(max_digits=10, decimal_places=2)
    wheels = models.IntegerField(default=6)  # e.g., 6-wheeler, 10-wheeler
    available = models.BooleanField(default=True)

    # Add timestamps ✅
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.truck_number} ({self.wheels} wheels)"


class Staff(models.Model):
    ROLE_CHOICES = (
        ("driver", "Driver"),
        ("helper", "Helper"),
    )

    transporter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="staff",
        default=True

    )
    name = models.CharField(max_length=100)
    contact = models.CharField(max_length=15)
    license_number = models.CharField(max_length=50, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    # 🔑 allow multiple staff per vehicle
    vehicle = models.ForeignKey(
        Vehicle,
        on_delete=models.CASCADE,
        related_name="staff"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.role})"
