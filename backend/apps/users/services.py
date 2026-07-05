from datetime import timedelta
import random

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User, OTP


class RegisterService:

    @staticmethod
    def create_user(validated_data):
        user = User.objects.create_user(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            mobile_number=validated_data["mobile_number"],
            password=validated_data["password"],
        )

        user.bio = validated_data.get("bio") or "💬 QuickChat User"

        if validated_data.get("profile_picture"):
            user.profile_picture = validated_data["profile_picture"]

        user.save()

        return user


class AuthService:

    @staticmethod
    def _set_refresh_cookie(response, refresh_token):
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite=settings.SESSION_COOKIE_SAMESITE,
            max_age=int(
                settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
            ),
        )

    @staticmethod
    def _delete_refresh_cookie(response):
        response.delete_cookie("refresh_token")

    @staticmethod
    def login(validated_data):
        identifier = validated_data["identifier"].strip()
        password = validated_data["password"]

        if "@" in identifier:
            user = User.objects.filter(email__iexact=identifier).first()
        else:
            user = User.objects.filter(mobile_number=identifier).first()

        if not user or not user.check_password(password):
            raise ValidationError({ "detail": "Invalid email/mobile number or password." })

        if not user.is_active:
            raise ValidationError({ "detail": "Your account has been disabled." })

        refresh = RefreshToken.for_user(user)

        response = Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "user": {
                    "id": str(user.id),
                    "full_name": user.full_name,
                    "email": user.email,
                    "mobile_number": user.mobile_number,
                    "bio": user.bio,
                    "profile_picture": (
                        user.profile_picture.url
                        if user.profile_picture
                        else None
                    ),
                    "is_email_verified": user.is_email_verified,
                },
            }
        )

        AuthService._set_refresh_cookie(response, str(refresh))

        return response

    @staticmethod
    def refresh(request):
        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise ValidationError({ "detail": "Refresh token not found." })

        try:
            refresh = RefreshToken(refresh_token)

            user = User.objects.get(id=refresh["user_id"])

            response = Response({ "access": str(refresh.access_token) })

            if settings.SIMPLE_JWT["ROTATE_REFRESH_TOKENS"]:
                refresh.blacklist()

                new_refresh = RefreshToken.for_user(user)

                AuthService._set_refresh_cookie(response, str(new_refresh))

            return response

        except (TokenError, User.DoesNotExist):
            raise ValidationError({ "detail": "Invalid refresh token." })

    @staticmethod
    def logout(request):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            try:
                RefreshToken(refresh_token).blacklist()
            except TokenError:
                pass

        response = Response({ "message": "Logged out successfully." })

        AuthService._delete_refresh_cookie(response)

        return response


class OTPService:

    OTP_EXPIRY_MINUTES = 5

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def _invalidate_old_otps(user, purpose):
        OTP.objects.filter(
            email=user.email,
            purpose=purpose,
            is_used=False,
        ).update(is_used=True)

    @staticmethod
    def _create_otp(user, purpose):
        OTPService._invalidate_old_otps(user, purpose)

        otp = OTPService.generate_otp()

        OTP.objects.create(
            email=user.email,
            otp=make_password(otp),
            purpose=purpose,
            expires_at=timezone.now() + timedelta(minutes=OTPService.OTP_EXPIRY_MINUTES),
        )

        print(f"\nOTP for {user.email}: {otp}\n")

        return {"message": "OTP sent successfully."}

    @staticmethod
    def _verify_otp(user, entered_otp, purpose):
        otp_instance = (
            OTP.objects.filter(
                email=user.email,
                purpose=purpose,
                is_used=False,
            ).order_by("-created_at").first()
        )

        if not otp_instance:
            raise ValidationError({ "otp": "No active OTP found." })

        if timezone.now() > otp_instance.expires_at:
            raise ValidationError({ "otp": "OTP has expired." })

        if not check_password(entered_otp, otp_instance.otp):
            raise ValidationError({ "otp": "Invalid OTP." })

        return otp_instance

    @staticmethod
    def send_email_verification_otp(user):
        if user.is_email_verified:
            raise ValidationError({ "email": "Email already verified." })

        return OTPService._create_otp(user, OTP.PurposeChoices.EMAIL_VERIFICATION)

    @staticmethod
    def verify_email_otp(user, entered_otp):
        otp = OTPService._verify_otp(
            user,
            entered_otp,
            OTP.PurposeChoices.EMAIL_VERIFICATION,
        )

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])

        return {"message": "Email verified successfully."}

    @staticmethod
    def send_password_reset_otp(user):
        return OTPService._create_otp(user, OTP.PurposeChoices.PASSWORD_RESET)

    @staticmethod
    def verify_password_reset_otp(user, entered_otp):
        otp = OTPService._verify_otp(user, entered_otp, OTP.PurposeChoices.PASSWORD_RESET)

        otp.is_verified = True
        otp.save(update_fields=["is_verified"])

        return {"message": "OTP verified successfully."}


class ResetPasswordService:

    @staticmethod
    def reset_password(user, new_password):
        otp = (
            OTP.objects.filter(
                email=user.email,
                purpose=OTP.PurposeChoices.PASSWORD_RESET,
                is_verified=True,
                is_used=False,
            ).order_by("-created_at").first()
        )

        if not otp:
            raise ValidationError({ "otp": "Please verify OTP first." })

        if timezone.now() > otp.expires_at:
            raise ValidationError({ "otp": "OTP expired. Please request a new OTP." })

        user.set_password(new_password)
        user.save(update_fields=["password"])

        otp.is_used = True
        otp.is_verified = False
        otp.save(update_fields=["is_used", "is_verified"])

        return {"message": "Password reset successfully."}