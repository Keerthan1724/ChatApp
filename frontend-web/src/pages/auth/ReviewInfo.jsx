import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import reviewInfoImage from "@/assets/review_info.png";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import { useRegister } from "@/context/RegisterContext";
import authService from "@/services/authServices";
import { setFlowState } from "@/utils/flowGuard";
import { getBackendErrorMessage } from "@/utils/errorHelpers";

const ReviewInfo = () => {
  const navigate = useNavigate();
  const { registerData } = useRegister();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInitials = (name = "") => {
    const words = name.trim().split(" ").filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleCreateAccount = async () => {
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("full_name", registerData.full_name);
      payload.append("email", registerData.email);
      payload.append("mobile_number", registerData.mobile_number);
      payload.append("password", registerData.password);
      payload.append("confirm_password", registerData.confirm_password);
      payload.append("bio", registerData.bio || "QuickChat User 👋");

      if (registerData.profile_picture) {
        payload.append("profile_picture", registerData.profile_picture);
      }

      await authService.register(payload);
      setFlowState({ registrationCompleted: true });
      navigate("/registration-success");
    } catch (err) {
      const errorMessage = getBackendErrorMessage(
        err,
        "Failed to create account. Please try again.",
      );
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Ready to Finalize"
      subheading="Look over your structural identity nodes before storing them securely into our operational chat engine files."
      title="Almost There."
      subtitle="Take one final comprehensive look at your configured workspace data strings."
      illustration={reviewInfoImage}
      formHeading="Review Info"
      formSubheading="Verify every input correctly before profile creation."
      authError={error}
    >
      <div className="w-full">
        <div className="mb-6 flex flex-col items-center">
          {registerData.profile_picture_preview ? (
            <img
              src={registerData.profile_picture_preview}
              alt=""
              className="mb-3 h-24 w-24 rounded-full object-cover border-4 border-primary/20"
            />
          ) : (
            <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              {getInitials(registerData.full_name)}
            </div>
          )}
          <h2
            className="text-xl font-bold text-text-main"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {registerData.full_name}
          </h2>
          <p className="mt-1 text-sm text-text-muted text-center px-4">
            {registerData.bio || "QuickChat user 👋"}
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <FiUser className="text-primary mt-0.5 shrink-0" size={18} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Full Name
              </p>
              <p className="font-medium text-sm text-text break-words">
                {registerData.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiPhone className="text-primary mt-0.5 shrink-0" size={18} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Mobile Number
              </p>
              <p className="font-medium text-sm text-text break-words">
                {registerData.mobile_number}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiMail className="text-primary mt-0.5 shrink-0" size={18} />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Email Address
              </p>
              <p className="font-medium text-sm text-text break-all">
                {registerData.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {registerData.email_verified ? (
              <FiCheckCircle
                className="text-green-600 mt-0.5 shrink-0"
                size={18}
              />
            ) : (
              <FiClock className="text-amber-500 mt-0.5 shrink-0" size={18} />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                Email Verification
              </p>
              <p
                className={`font-medium text-sm ${registerData.email_verified ? "text-green-600" : "text-amber-600"}`}
              >
                {registerData.email_verified
                  ? "Verified"
                  : "Skipped (Can be verified later)"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-3 sm:p-4">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary shrink-0 rounded"
            />
            <span className="text-xs sm:text-sm leading-normal text-text-muted">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => navigate("/terms-and-conditions")}
                className="font-semibold text-primary hover:underline focus:outline-none"
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => navigate("/privacy-policy")}
                className="font-semibold text-primary hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
              .
            </span>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => navigate("/create-account")}>
            Edit Info
          </Button>
          <Button
            loading={loading}
            loadingText="Creating..."
            disabled={!acceptedTerms}
            onClick={handleCreateAccount}
          >
            Create Account
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ReviewInfo;
