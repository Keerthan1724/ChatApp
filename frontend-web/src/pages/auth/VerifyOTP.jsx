import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import verifyOtpImage from "@/assets/verify_otp.png";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import OTPInput from "@/components/auth/OTPInput";

import maskEmail from "@/utils/maskEmail";
import { validateEmailOTP } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";
import authService from "@/services/authServices";
import { setFlowState } from "@/utils/flowGuard";

const VerifyOTP = () => {
  const OTP_TIME = 300;

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIME);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authError, setAuthError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();

    const validationErrors = validateEmailOTP(otp);
    if (validationErrors.otp) {
      setOtpError(validationErrors.otp);
      return;
    }

    try {
      setLoading(true);
      setOtpError("");
      setAuthError("");
      setResendMessage("");

      await authService.verifyPasswordResetOTP({ email, otp });
      setFlowState({ passwordResetOtpVerified: true });
      navigate("/reset-password", { state: { email, otp } });
    } catch (err) {
      setAuthError(
        getBackendErrorMessage(err, "Invalid or expired verification code.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setAuthError("");
      setResendMessage("");

      await authService.sendPasswordResetOTP(email);

      setTimer(OTP_TIME);
      setOtp("");
      setResendMessage("A new verification code has been sent!");
    } catch (err) {
      const errorMessage = getBackendErrorMessage(
        err,
        "Failed to resend code."
      );
      setAuthError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Protecting Your Privacy"
      subheading="We want to ensure this account belongs completely to you before modifying details."
      title="Two-Factor Validation"
      subtitle="Our security tokens expire quickly to maintain a strict perimeter over your personal profile dataset."
      illustration={verifyOtpImage}
      formHeading="Verify OTP"
      formSubheading={
        <>
          <p className="mt-2 text-sm text-text-muted text-center">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold text-primary break-all px-2 text-sm sm:text-base text-center mt-1">
            {email ? maskEmail(email) : "your email"}
          </p>
        </>
      }
      authError={authError}
    >
      <form onSubmit={handleVerify} className="w-full">

        <div className="space-y-4">
          {resendMessage && (
            <div className="rounded-xl bg-success/10 p-3 text-center text-sm font-medium text-success">
              {resendMessage}
            </div>
          )}

          <div className="my-6">
            <OTPInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                setOtpError("");
                setAuthError("");
              }}
              error={otpError}
            />
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            {timer > 0 ? (
              <p className="text-xs sm:text-sm text-text-muted">
                Resend code in{" "}
                <span className="font-semibold tabular-nums">
                  {String(Math.floor(timer / 60)).padStart(2, "0")}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-xs sm:text-sm font-semibold text-primary hover:underline focus:outline-none disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </button>
            )}
          </div>

          <div className="mt-6 sm:mt-8">
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Verifying..."
            >
              Verify Code
            </Button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
