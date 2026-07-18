import { useNavigate } from "react-router-dom";
import registrationSuccessImage from "@/assets/registration_success.png";
import SuccessPage from "@/components/common/SuccessPage";

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  return (
    <SuccessPage
      illustration={registrationSuccessImage}
      title="Account Created Successfully!"
      description="Welcome to QuickChat! Your account is ready and you can now securely connect, chat, and share with your friends."
      buttonText="Go to Login"
      onButtonClick={() => navigate("/login")}
      autoClose={10000}
    />
  );
};

export default RegistrationSuccess;