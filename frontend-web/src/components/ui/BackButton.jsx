import { FiArrowLeft } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { getFallbackRoute, getPreviousRoute } from "@/utils/flowGuard";

const BackButton = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const previousRoute = getPreviousRoute(location.pathname, {
      skipPaths: [
        "/email-verification-success",
        "/registration-success",
        "/reset-success",
      ],
    });

    if (previousRoute) {
      navigate(previousRoute, { replace: true });
      return;
    }

    navigate(getFallbackRoute(location.pathname), { replace: true });
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={clsx(
        "absolute flex items-center justify-center rounded-full border border-border bg-white shadow-sm transition",
        "left-4 top-4 h-8 w-8 sm:left-6 sm:top-6 sm:h-10 sm:w-10",
        "hover:bg-gray-50 active:scale-95",
        className,
      )}
    >
      <FiArrowLeft className="h-4 w-4 sm:h-[18px] sm:w-[18px] text-text shrink-0" />
    </button>
  );
};

export default BackButton;
