from django.urls import path

from apps.users.views import (
    RegisterAPIView,
    LoginAPIView,
    RefreshTokenAPIView,
    LogoutAPIView,
    SendVerificationOTPAPIView,
    VerifyEmailAPIView,
    SendPasswordResetOTPAPIView,
    VerifyPasswordResetOTPAPIView,
    ResetPasswordAPIView,
)


urlpatterns = [
    path("register/", RegisterAPIView.as_view(), name="register"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("token/refresh/", RefreshTokenAPIView.as_view(), name="token-refresh"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("send-verification-otp/", SendVerificationOTPAPIView.as_view(), name="send-verification-otp"),
    path("verify-email/", VerifyEmailAPIView.as_view(), name="verify-email"),
    path("send-password-reset-otp/", SendPasswordResetOTPAPIView.as_view(), name="send-password-reset-otp"),
    path("verify-password-reset-otp/", VerifyPasswordResetOTPAPIView.as_view(), name="verify-password-reset-otp"),
    path("reset-password/", ResetPasswordAPIView.as_view(), name="reset-password"),
]