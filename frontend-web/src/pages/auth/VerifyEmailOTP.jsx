import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import verifyEmailImage from "@/assets/verify_email_otp.png";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import OTPInput from "@/components/auth/OTPInput";

import { useRegister } from "@/context/RegisterContext";
import authService from "@/services/authServices";

import maskEmail from "@/utils/maskEmail";
import { validateEmailOTP } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";
import { setFlowState } from "@/utils/flowGuard";

const VerifyEmailOTP = () => {
  const OTP_TIME = 300;

  const navigate = useNavigate();
  const { registerData, updateRegisterData } = useRegister();

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(OTP_TIME);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [authError, setAuthError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    const validationErrors = validateEmailOTP(otp);

    if (validationErrors.otp) {
      setOtpError(validationErrors.otp);
      return;
    }

    try {
      setLoading(true);
      setOtpError("");
      setAuthError("");

      await authService.verifyEmailOTP({ email: registerData.email, otp });

      updateRegisterData({ email_verified: true });
      setFlowState({ emailVerified: true });
      navigate("/email-verification-success");
    } catch (err) {
      setAuthError(getBackendErrorMessage(err, "Invalid verification code."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setAuthError("");
      setResendMessage("");

      await authService.sendVerificationOTP(registerData.email);

      setTimer(OTP_TIME);
      setOtp("");
      setResendMessage("A new verification code has been sent!");
    } catch (err) {
      setAuthError(
        getBackendErrorMessage(err, "Failed to resend verification code."),
      );
    }
  };

  return (
    <AuthLayout
      heading="Check Your Inbox"
      subheading="A secure verification dispatch token has been fired across global network routers."
      title="One Step Away."
      subtitle="Grab the timed unique authentication digits directly from your local software application email platform."
      illustration={verifyEmailImage}
      formHeading="Enter Code"
      formSubheading={
        <>
          <p className="mt-2 text-sm text-text-muted text-center">
            We've sent a 6-digit passcode to
          </p>
          <p className="font-semibold text-primary break-all px-2 text-sm sm:text-base text-center mt-1">
            {registerData.email ? maskEmail(registerData.email) : "your email"}
          </p>
        </>
      }
      authError={authError}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerify();
        }}
        className="w-full"
      >
        <div className="space-y-4">
          {resendMessage && (
            <div className="rounded-xl bg-success/10 p-3 text-center text-sm font-medium text-success">
              {resendMessage}
            </div>
          )}

          <div className="my-6">
            <OTPInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setOtpError("");
                setAuthError("");
              }}
              error={otpError}
            />
          </div>

          <div className="mt-4 text-center">
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
                className="text-xs sm:text-sm font-semibold text-primary hover:underline focus:outline-none"
              >
                Resend Code
              </button>
            )}
          </div>

          <div className="mt-6">
            <Button loading={loading} loadingText="Verifying..." type="submit">
              Verify Email
            </Button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyEmailOTP;
