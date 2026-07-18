import ErrorMessage from "./ErrorMessage";
import clsx from "clsx"; 

const Input = ({
  label,
  icon: Icon,
  error,
  className = "",
  type = "text", 
  ...props
}) => {
  const isHidden = className.includes("hidden");

  return (
    <div className={clsx(isHidden ? "hidden" : "w-full")}>
      {label && (
        <label className="mb-1.5 block font-medium text-text text-sm sm:text-base">
          {label}
        </label>
      )}

      <div
        className={clsx(
          !isHidden && "input-field flex items-center gap-2.5 transition-all focus-within:border-primary px-3.5 py-2.5 sm:px-4 sm:py-3.5",
          error ? "border-error" : "",
          className
        )}
      >
        {Icon && (
          <Icon className="text-text-muted h-4 w-4 sm:h-5 sm:w-5 shrink-0" 
 />
        )}

        <input
          type={type}
          className="w-full bg-transparent outline-none text-sm sm:text-base"
          {...props}
        />
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};

export default Input;