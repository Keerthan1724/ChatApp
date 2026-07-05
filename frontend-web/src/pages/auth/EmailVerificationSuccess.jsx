import { useNavigate } from "react-router-dom";
import emailVerifiedImage from "@/assets/email_verification_success.png";
import SuccessPage from "@/components/ui/SuccessPage";
import { setFlowState } from "@/utils/flowGuard";

const EmailVerificationSuccess = ({ mode = "register" }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (mode === "register") {
      setFlowState({ emailVerified: true, registrationCompleted: false });
      navigate("/review-info", { replace: true });
      return;
    }
    navigate(-1);
  };

  return (
    <SuccessPage
      illustration={emailVerifiedImage}
      title="Email Verified!"
      description="Your email has been verified successfully. Your account is now protected and you'll receive important account notifications."
      buttonText={mode === "register" ? "Next" : "Done"}
      onButtonClick={handleContinue}
      autoClose={10000} 
    />
  );
};

export default EmailVerificationSuccess;
