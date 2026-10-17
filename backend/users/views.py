from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings

from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import UserProfile
from .serializers import UserProfileSerializer


# ==========================================
# USER LIST + CREATE
# ==========================================

class UserProfileListCreateView(
    generics.ListCreateAPIView
):

    queryset = UserProfile.objects.all()

    serializer_class = UserProfileSerializer


# ==========================================
# USER DETAIL
# GET + UPDATE + DELETE
# ==========================================

class UserProfileDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = UserProfile.objects.all()

    serializer_class = UserProfileSerializer


# ==========================================
# LOGIN
# ==========================================

@api_view(["POST"])
def login_view(request):

    email = request.data.get(
        "email",
        ""
    ).strip().lower()

    password = request.data.get(
        "password",
        ""
    )

    role = request.data.get(
        "role",
        "customer"
    )

    # ======================================
    # VALIDATE EMAIL
    # ======================================

    if not email:

        return Response(
            {
                "error": "Email address is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # VALIDATE PASSWORD
    # ======================================

    if not password:

        return Response(
            {
                "error": "Password is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # FIND USER
    # ======================================

    user = UserProfile.objects.filter(
        email__iexact=email
    ).first()


    # ======================================
    # USER NOT FOUND
    # ======================================

    if user is None:

        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


    # ======================================
    # CHECK PASSWORD
    # ======================================

    if user.password != password:

        return Response(
            {
                "error": "Invalid email or password."
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


    # ======================================
    # LOGIN SUCCESS
    # ======================================

    return Response(
        {
            "message": "Login successful.",

            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": role
            }
        },
        status=status.HTTP_200_OK
    )


# ==========================================
# FORGOT PASSWORD
# SEND RESET CODE
# ==========================================

@api_view(["POST"])
def forgot_password_view(request):

    email = request.data.get(
        "email",
        ""
    ).strip().lower()


    # ======================================
    # VALIDATE EMAIL
    # ======================================

    if not email:

        return Response(
            {
                "error": "Email address is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # FIND USER
    # ======================================

    user = UserProfile.objects.filter(
        email__iexact=email
    ).first()


    # ======================================
    # USER NOT FOUND
    # ======================================

    if user is None:

        return Response(
            {
                "error": "No account found with this email address."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # ======================================
    # GENERATE 6 DIGIT RESET CODE
    # ======================================

    import random

    reset_code = str(
        random.randint(100000, 999999)
    )


    # ======================================
    # STORE RESET CODE
    # 10 MINUTES
    # ======================================

    cache_key = f"password_reset_{email}"

    cache.set(
        cache_key,
        reset_code,
        timeout=600
    )


    # ======================================
    # EMAIL CONTENT
    # ======================================

    subject = "Smart Local Services - Password Reset"

    message = f"""
Hello {user.name},

We received a request to reset your Smart Local Services password.

Your password reset code is:

{reset_code}

This code is valid for 10 minutes.

If you did not request a password reset, you can ignore this email.

Regards,
Smart Local Services
"""


    # ======================================
    # SEND EMAIL
    # ======================================

    try:

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False
        )

    except Exception as error:

        print(
            "Password reset email error:",
            error
        )

        return Response(
            {
                "error":
                    "Unable to send reset email. "
                    "Please check email configuration."
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


    # ======================================
    # SUCCESS
    # ======================================

    return Response(
        {
            "message":
                "Password reset instructions have been sent to your email."
        },
        status=status.HTTP_200_OK
    )


# ==========================================
# RESET PASSWORD
# ==========================================

@api_view(["POST"])
def reset_password_view(request):

    email = request.data.get(
        "email",
        ""
    ).strip().lower()

    reset_code = request.data.get(
        "reset_code",
        ""
    ).strip()

    new_password = request.data.get(
        "new_password",
        ""
    )

    confirm_password = request.data.get(
        "confirm_password",
        ""
    )


    # ======================================
    # VALIDATE EMAIL
    # ======================================

    if not email:

        return Response(
            {
                "error":
                    "Email address is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # VALIDATE RESET CODE
    # ======================================

    if not reset_code:

        return Response(
            {
                "error":
                    "Reset code is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # VALIDATE NEW PASSWORD
    # ======================================

    if not new_password:

        return Response(
            {
                "error":
                    "New password is required."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    if len(new_password) < 6:

        return Response(
            {
                "error":
                    "Password must be at least 6 characters."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # CONFIRM PASSWORD
    # ======================================

    if new_password != confirm_password:

        return Response(
            {
                "error":
                    "Passwords do not match."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # GET STORED RESET CODE
    # ======================================

    cache_key = f"password_reset_{email}"

    stored_code = cache.get(
        cache_key
    )


    # ======================================
    # CHECK CODE
    # ======================================

    if stored_code is None:

        return Response(
            {
                "error":
                    "Reset code has expired. Please request a new code."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    if stored_code != reset_code:

        return Response(
            {
                "error":
                    "Invalid reset code."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ======================================
    # FIND USER
    # ======================================

    user = UserProfile.objects.filter(
        email__iexact=email
    ).first()


    if user is None:

        return Response(
            {
                "error":
                    "User account not found."
            },
            status=status.HTTP_404_NOT_FOUND
        )


    # ======================================
    # UPDATE PASSWORD
    # ======================================

    user.password = new_password

    user.save()


    # ======================================
    # DELETE USED RESET CODE
    # ======================================

    cache.delete(
        cache_key
    )


    # ======================================
    # SUCCESS
    # ======================================

    return Response(
        {
            "message":
                "Password reset successfully. You can login now."
        },
        status=status.HTTP_200_OK
    )