import { useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import clsx from "clsx"; 

import ErrorMessage from "./ErrorMessage";
import PasswordStrength from "./PasswordStrength";

const PasswordInput = ({
  label,
  error,
  showStrength = false,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const iconClasses = "h-4 w-4 sm:h-5 sm:w-5 text-text-muted shrink-0";

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block font-medium text-text text-sm sm:text-base">
          {label}
        </label>
      )}

      <div
        className={clsx(
          "input-field flex items-center gap-2.5 transition-all focus-within:border-primary",          
          "px-3.5 py-2.5 sm:px-4 sm:py-3.5",          
          error ? "border-error" : "",
          className
        )}
      >
        <FiLock className={iconClasses} />
        
        <input
          type={showPassword ? "text" : "password"}
          className="w-full bg-transparent outline-none text-sm sm:text-base"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="transition hover:text-primary flex items-center justify-center shrink-0"
        >
          {showPassword ? (
            <FiEyeOff className={iconClasses} />
          ) : (
            <FiEye className={iconClasses} />
          )}
        </button>
      </div>

      <ErrorMessage error={error} />

      {showStrength && <PasswordStrength password={props.value || ""} />}
    </div>
  );
};

export default PasswordInput;