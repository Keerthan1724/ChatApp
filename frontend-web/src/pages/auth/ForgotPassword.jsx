import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail } from "react-icons/fi";

import forgotPasswordImage from "@/assets/send_otp.png";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import authService from "@/services/authServices";
import { setFlowState } from "../../utils/flowGuard";
import { validateEmail } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const validationErrors = validateEmail(email);
    if (Object.keys(validationErrors).length) {
      setEmailError(validationErrors.email);
      return;
    }

    try {
      setLoading(true);
      setEmailError("");
      setAuthError("");

      await authService.sendPasswordResetOTP(email);
      setFlowState({ forgotPasswordRequested: true });
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      setAuthError(
        getBackendErrorMessage(err, "Failed to send verification code.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Trouble Logging In?"
      subheading="Don't worry, it happens. Let's get your account access restored quickly."
      title="Secure Verification Panel"
      subtitle="QuickChat uses end-to-end encrypted protocol channels to guarantee valid credential updates."
      illustration={forgotPasswordImage}
      formHeading="Find Your Account"
      formSubheading="Enter your registered email address to receive a 6-digit passcode."
      authError={authError}
    >
      <form onSubmit={handleSendOTP} className="w-full">

        <div className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            icon={FiMail}
            placeholder="john@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError("");
              if (authError) setAuthError("");
            }}
            error={emailError}
            autoComplete="email"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading}
            loadingText="Sending code..."
          >
            Send Verification Code
          </Button>

          <p className="text-center text-sm text-text-muted">
            Remembered your password?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-primary hover:underline focus:outline-none"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
