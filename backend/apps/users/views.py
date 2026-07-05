from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from apps.users.serializers import (
    RegisterSerializer,
    LoginSerializer,
    RegistrationEmailSerializer,
    RegistrationVerifyOTPSerializer,
    SendPasswordResetOTPSerializer,
    VerifyPasswordResetOTPSerializer,
    ResetPasswordSerializer,
)

from apps.users.services import (
    RegisterService,
    AuthService,
    OTPService,
    ResetPasswordService,
)


class RegisterAPIView(APIView):
    permission_classes = [AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = RegisterService.create_user(serializer.validated_data)

        return Response(
            {
                "message": "Account created successfully.",
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
            },
            status=status.HTTP_201_CREATED,
        )


class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return AuthService.login(serializer.validated_data)


class RefreshTokenAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return AuthService.refresh(request)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return AuthService.logout(request)


class SendVerificationOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationEmailSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.context["user"]

        response = OTPService.send_email_verification_otp(user)

        return Response(response, status=status.HTTP_200_OK)


class VerifyEmailAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationVerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.context["user"]
        otp = serializer.validated_data["otp"]

        response = OTPService.verify_email_otp(user, otp)

        return Response(response, status=status.HTTP_200_OK)


class SendPasswordResetOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendPasswordResetOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.context["user"]

        response = OTPService.send_password_reset_otp(user)

        return Response(response, status=status.HTTP_200_OK)


class VerifyPasswordResetOTPAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyPasswordResetOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.context["user"]
        otp = serializer.validated_data["otp"]

        response = OTPService.verify_password_reset_otp(user, otp)

        return Response(response, status=status.HTTP_200_OK)


class ResetPasswordAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.context["user"]

        response = ResetPasswordService.reset_password(
            user=user,
            new_password=serializer.validated_data["new_password"],
        )

        return Response(response, status=status.HTTP_200_OK)