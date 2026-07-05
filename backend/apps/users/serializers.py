from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    mobile_number = serializers.CharField(max_length=10)
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    bio = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.ImageField(required=False)

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")
        email = data.get("email")
        mobile_number = data.get("mobile_number")

        if len(password) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email already exists.")

        if User.objects.filter(mobile_number=mobile_number).exists():
            raise serializers.ValidationError("Mobile number already exists.")

        return data


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get("identifier"):
            raise serializers.ValidationError({ "identifier": "This field is required." })

        if not data.get("password"):
            raise serializers.ValidationError({ "password": "This field is required." })

        return data


class UserEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        try:
            self.context["user"] = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        return value


class RegistrationEmailSerializer(UserEmailSerializer):
    email = serializers.EmailField()


class RegistrationVerifyOTPSerializer(UserEmailSerializer):
    otp = serializers.CharField(max_length=6)

    def validate_email(self, value):
        try:
            self.context["user"] = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User with this email does not exist.")

        return value


class SendPasswordResetOTPSerializer(UserEmailSerializer):
    pass


class VerifyPasswordResetOTPSerializer(UserEmailSerializer):
    otp = serializers.CharField(max_length=6)


class ResetPasswordSerializer(UserEmailSerializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if len(data["new_password"]) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters.")

        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        return data