import { useNavigate } from "react-router-dom";
import resetSuccessImage from "@/assets/reset_success.png"; 
import SuccessPage from "@/components/common/SuccessPage";

const ResetSuccess = () => {
  const navigate = useNavigate();

  return (
    <SuccessPage
      illustration={resetSuccessImage}
      title="Password Reset Successful!"
      description="Your account security parameters have updated successfully. You can now securely log back in using your brand new password credentials."
      buttonText="Back to Login"
      onButtonClick={() => navigate("/login")}
      autoClose={10000} 
    />
  );
};

export default ResetSuccess;