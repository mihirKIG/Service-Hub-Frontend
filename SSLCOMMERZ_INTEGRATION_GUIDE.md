# SSLCommerz Payment Integration Guide

## Overview
This guide covers the complete integration of SSLCommerz payment gateway for 10% advance booking payment.

---

## BACKEND CHANGES (Django)

### 1. Install SSLCommerz Package

```bash
pip install sslcommerz-python
```

Add to `requirements.txt`:
```
sslcommerz-python==1.0
```

### 2. Update Django Settings

Add to `settings.py`:

```python
# SSLCommerz Configuration
SSLCZ_STORE_ID = 'your_store_id'  # Get from SSLCommerz
SSLCZ_STORE_PASSWORD = 'your_store_password'  # Get from SSLCommerz
SSLCZ_IS_SANDBOX = True  # Set False for production

# Payment URLs
FRONTEND_URL = 'http://localhost:3000'
PAYMENT_SUCCESS_URL = f'{FRONTEND_URL}/payment/success'
PAYMENT_FAIL_URL = f'{FRONTEND_URL}/payment/fail'
PAYMENT_CANCEL_URL = f'{FRONTEND_URL}/payment/cancel'
PAYMENT_IPN_URL = 'http://your-backend-url/api/payments/ipn/'  # For production
```

### 3. Create Payment Models

Update `payments/models.py`:

```python
from django.db import models
from django.contrib.auth import get_user_model
from bookings.models import Booking

User = get_user_model()

class Payment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_TYPE = [
        ('advance', 'Advance Payment'),
        ('full', 'Full Payment'),
        ('refund', 'Refund'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    
    # Payment Details
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE, default='advance')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='BDT')
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    
    # SSLCommerz Details
    tran_id = models.CharField(max_length=100, unique=True)  # Unique transaction ID
    val_id = models.CharField(max_length=100, blank=True, null=True)  # Validation ID from SSLCommerz
    card_type = models.CharField(max_length=50, blank=True, null=True)
    card_issuer = models.CharField(max_length=100, blank=True, null=True)
    bank_tran_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Metadata
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    payment_response = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.tran_id} - {self.amount} {self.currency}"
```

### 4. Create Payment Serializer

Create `payments/serializers.py`:

```python
from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']

class PaymentInitiateSerializer(serializers.Serializer):
    booking_id = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    customer_name = serializers.CharField(max_length=100)
    customer_email = serializers.EmailField()
    customer_phone = serializers.CharField(max_length=15)
    customer_address = serializers.CharField(max_length=255)
```

### 5. Create Payment Views

Create `payments/views.py`:

```python
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from sslcommerz_python.payment import SSLCSession
from decimal import Decimal
import uuid
from datetime import datetime

from .models import Payment
from .serializers import PaymentSerializer, PaymentInitiateSerializer
from bookings.models import Booking

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """Initiate SSLCommerz payment for 10% advance"""
        serializer = PaymentInitiateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        total_amount = Decimal(data['total_amount'])
        advance_amount = total_amount * Decimal('0.10')  # 10% advance
        
        # Generate unique transaction ID
        tran_id = f"TXN{uuid.uuid4().hex[:12].upper()}{int(datetime.now().timestamp())}"
        
        # Create payment record
        payment = Payment.objects.create(
            user=request.user,
            transaction_id=tran_id,
            tran_id=tran_id,
            payment_type='advance',
            amount=advance_amount,
            status='pending'
        )
        
        # Initialize SSLCommerz
        sslcz = SSLCSession(
            sslc_is_sandbox=settings.SSLCZ_IS_SANDBOX,
            sslc_store_id=settings.SSLCZ_STORE_ID,
            sslc_store_pass=settings.SSLCZ_STORE_PASSWORD
        )
        
        # Prepare payment data
        post_body = {
            'total_amount': float(advance_amount),
            'currency': 'BDT',
            'tran_id': tran_id,
            'success_url': f"{settings.PAYMENT_SUCCESS_URL}?tran_id={tran_id}",
            'fail_url': f"{settings.PAYMENT_FAIL_URL}?tran_id={tran_id}",
            'cancel_url': f"{settings.PAYMENT_CANCEL_URL}?tran_id={tran_id}",
            'ipn_url': settings.PAYMENT_IPN_URL,
            'emi_option': 0,
            'cus_name': data['customer_name'],
            'cus_email': data['customer_email'],
            'cus_phone': data['customer_phone'],
            'cus_add1': data['customer_address'],
            'cus_city': 'Dhaka',
            'cus_country': 'Bangladesh',
            'shipping_method': 'NO',
            'product_name': f"Booking Advance Payment",
            'product_category': 'Service',
            'product_profile': 'general',
        }
        
        # Initiate payment session
        response = sslcz.init_payment(post_body, sslcz.init_ipn)
        
        if response.get('status') == 'SUCCESS':
            payment.payment_response = response
            payment.save()
            
            return Response({
                'success': True,
                'payment_id': payment.id,
                'gateway_url': response['GatewayPageURL'],
                'tran_id': tran_id,
                'amount': float(advance_amount),
                'total_amount': float(total_amount),
                'advance_percentage': 10
            })
        else:
            payment.status = 'failed'
            payment.save()
            return Response({
                'success': False,
                'message': 'Failed to initiate payment'
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def validate(self, request):
        """Validate payment after successful transaction"""
        tran_id = request.data.get('tran_id')
        val_id = request.data.get('val_id')
        
        if not tran_id or not val_id:
            return Response({
                'success': False,
                'message': 'Missing transaction ID or validation ID'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            payment = Payment.objects.get(tran_id=tran_id)
            
            # Validate with SSLCommerz
            sslcz = SSLCSession(
                sslc_is_sandbox=settings.SSLCZ_IS_SANDBOX,
                sslc_store_id=settings.SSLCZ_STORE_ID,
                sslc_store_pass=settings.SSLCZ_STORE_PASSWORD
            )
            
            validation_response = sslcz.transaction_query_session(tran_id, 'sessionkey')
            
            if validation_response.get('status') == 'VALID' or validation_response.get('status') == 'VALIDATED':
                payment.status = 'completed'
                payment.val_id = val_id
                payment.card_type = validation_response.get('card_type', '')
                payment.card_issuer = validation_response.get('card_issuer', '')
                payment.bank_tran_id = validation_response.get('bank_tran_id', '')
                payment.payment_response = validation_response
                payment.save()
                
                # Update booking if exists
                booking_id = request.data.get('booking_id')
                if booking_id:
                    booking = Booking.objects.get(id=booking_id)
                    booking.payment_status = 'advance_paid'
                    booking.advance_payment = payment.amount
                    payment.booking = booking
                    payment.save()
                    booking.save()
                
                return Response({
                    'success': True,
                    'message': 'Payment validated successfully',
                    'payment': PaymentSerializer(payment).data
                })
            else:
                payment.status = 'failed'
                payment.save()
                return Response({
                    'success': False,
                    'message': 'Payment validation failed'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Payment.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def ipn(self, request):
        """IPN (Instant Payment Notification) handler"""
        tran_id = request.data.get('tran_id')
        val_id = request.data.get('val_id')
        status_ipn = request.data.get('status')
        
        try:
            payment = Payment.objects.get(tran_id=tran_id)
            
            if status_ipn == 'VALID' or status_ipn == 'VALIDATED':
                payment.status = 'completed'
                payment.val_id = val_id
                payment.payment_response = request.data
                payment.save()
                
            elif status_ipn == 'FAILED':
                payment.status = 'failed'
                payment.save()
                
            elif status_ipn == 'CANCELLED':
                payment.status = 'failed'
                payment.save()
            
            return Response({'status': 'success'})
            
        except Payment.DoesNotExist:
            return Response({'status': 'not_found'}, status=status.HTTP_404_NOT_FOUND)
```

### 6. Update Booking Models

Add to `bookings/models.py`:

```python
class Booking(models.Model):
    # ... existing fields ...
    
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('advance_paid', 'Advance Paid (10%)'),
        ('fully_paid', 'Fully Paid'),
        ('refunded', 'Refunded'),
    ]
    
    payment_status = models.CharField(
        max_length=20, 
        choices=PAYMENT_STATUS, 
        default='pending'
    )
    advance_payment = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        default=0
    )
    total_amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        null=True,
        blank=True
    )
```

### 7. Update URLs

In `payments/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet

router = DefaultRouter()
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

### 8. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## FRONTEND CHANGES (React)

See the updated files I'm creating for you in the frontend.

## Testing

### Test Mode Credentials (SSLCommerz Sandbox):
- Test Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

## Environment Variables

Create `.env` file in backend:
```
SSLCZ_STORE_ID=your_test_store_id
SSLCZ_STORE_PASSWORD=your_test_password
SSLCZ_IS_SANDBOX=True
FRONTEND_URL=http://localhost:3000
```
