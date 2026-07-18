import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import resetPasswordImage from "@/assets/reset_password.png";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/auth/PasswordInput";

import { validateResetPassword } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";
import { setFlowState } from "@/utils/flowGuard";
import authService from "@/services/authServices";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email || !otp) {
      navigate("/forgot-password");
    }
  }, [email, otp, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      auth: "",
    }));
  };

  const handleReset = async (e) => {
    e.preventDefault();

    const validationErrors = validateResetPassword(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      await authService.resetPassword({
        email,
        otp,
        new_password: form.password,
        confirm_password: form.confirm_password,
      });

      setSuccess(true);

      setFlowState({
        passwordResetSuccess: true,
      });

      navigate("/reset-success");
    } catch (err) {
      setErrors({
        auth: getBackendErrorMessage(
          err,
          "Unable to reset password. Please try again.",
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Create a Strong Password"
      subheading="You're almost done. Choose a secure password to protect your account."
      title="Password Recovery"
      subtitle="Your new password will replace the old one immediately after successful verification."
      illustration={resetPasswordImage}
      formHeading="New Password"
      formSubheading="Set and confirm your updated system credentials below."
      authError={errors.auth}
    >
      <form onSubmit={handleReset} className="w-full">
        <div className="space-y-4">
          <PasswordInput
            label="New Password"
            name="password"
            placeholder="Create new password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            showStrength
          />

          <PasswordInput
            label="Confirm New Password"
            name="confirm_password"
            placeholder="Confirm new password"
            value={form.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            loading={loading || success}
            loadingText="Updating..."
          >
            Reset Password
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;