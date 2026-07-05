import clsx from "clsx";
import { FiLoader } from "react-icons/fi";

const Button = ({
  children,
  type = "button",
  variant = "gradient",
  fullWidth = true,
  loading = false,
  loadingText,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  ...props
}) => {
  const variants = {
    gradient:
      "btn-gradient hover:opacity-95 disabled:bg-gray-300 disabled:text-gray-500",
    outline:
      "border border-primary bg-transparent text-primary hover:bg-primary hover:text-white disabled:border-gray-300 disabled:text-gray-400 disabled:bg-transparent",
    text:
      "bg-transparent text-primary hover:underline disabled:text-gray-400 disabled:no-underline",
  };

  const iconClasses = "h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0";

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300",
        "px-4 py-2.5 text-sm sm:px-6 sm:py-3.5 sm:text-base",
        "disabled:cursor-not-allowed disabled:opacity-60",
        !disabled &&
          !loading &&
          variant !== "text" &&
          "hover:scale-[1.01] active:scale-[0.98]",
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <FiLoader
            className={clsx("animate-spin", iconClasses)}
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className={iconClasses} />}
          <span>{children}</span>
          {RightIcon && <RightIcon className={iconClasses} />}
        </>
      )}
    </button>
  );
};

export default Button;