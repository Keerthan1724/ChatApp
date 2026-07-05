import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiShield } from "react-icons/fi";

import verifyEmailImage from "@/assets/verify_email.png";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useRegister } from "@/context/RegisterContext";
import authService from "@/services/authServices";
import { setFlowState } from "@/utils/flowGuard";
import { validateEmail } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";

const EmailVerification = () => {
  const navigate = useNavigate();
  const { registerData, updateRegisterData } = useRegister();

  const [form, setForm] = useState({
    email: registerData.email || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm({ email: registerData.email || "" });
  }, [registerData.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };
      updateRegisterData({ [name]: value });
      return next;
    });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      auth: "",
    }));
  };

  const handleLater = () => {
    updateRegisterData({
      email: form.email,
    });

    setFlowState({
      verificationSkipped: true,
      profileSetupCompleted: true,
    });

    navigate("/review-info");
  };

  const handleSendOTP = async () => {
    const validationErrors = validateEmail(form.email);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await authService.sendVerificationOTP(form.email);

      updateRegisterData({
        email: form.email,
      });

      setFlowState({
        verificationEmailRequested: true,
        profileSetupCompleted: true,
      });

      navigate("/verify-email-otp");
    } catch (error) {
      setErrors({
        auth: getBackendErrorMessage(
          error,
          "Failed to send verification code.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      bannerHeading="Shield Your Profile"
      bannerSubheading="Verify your email communication channels or choose to complete this later."
      title="Stay Protected."
      subtitle="Adding a verified email keeps your account secure and enables important notifications."
      illustration={verifyEmailImage}
      formHeading="Verify Email"
      formSubheading="Confirm your email address to continue."
      authError={errors.auth}
    >
      <div className="w-full">
        <div className="mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-3 rounded-xl bg-primary/5 p-3 sm:p-4 text-sm text-text leading-relaxed border border-primary/20 text-center sm:text-left">
          <FiShield size={32} className="shrink-0 text-primary mt-0.5" />

          <p>
            We use email verification to confirm account ownership, secure your
            data, and deliver important notifications.
          </p>
        </div>

        <Input
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          placeholder="john@example.com"
          icon={FiMail}
          onChange={handleChange}
          error={errors.email}
        />

        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={handleLater}>
            Later
          </Button>

          <Button
            loading={loading}
            loadingText="Sending..."
            onClick={handleSendOTP}
          >
            Send OTP
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerification;
