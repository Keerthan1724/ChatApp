import { FiCheck, FiX } from "react-icons/fi";
import usePasswordStrength from "@/hooks/usePasswordStrength";

const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const { checks, strength } = usePasswordStrength(password);

  const rules = [
    { key: "length", label: "8+ Characters" },
    { key: "uppercase", label: "Uppercase" },
    { key: "lowercase", label: "Lowercase" },
    { key: "number", label: "Number" },
    { key: "special", label: "Special" },
  ];

  const passed = rules.filter(rule => checks[rule.key]).length;

  const colors = {
    Weak: "bg-error",
    Medium: "bg-warning",
    Strong: "bg-success",
  };

  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="caption">
          Password Strength
        </span>

        <span
          className={`text-xs font-semibold ${
            strength === "Weak"
              ? "text-error"
              : strength === "Medium"
              ? "text-warning"
              : "text-success"
          }`}
        >
          {strength}
        </span>
      </div>

      <div className="mb-4 flex gap-1.5">
        {rules.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              index < passed
                ? colors[strength]
                : "bg-border"
            }`}
          />
        ))}
      </div>

      {passed === 5 ? (
        <div className="flex items-center gap-2 text-success text-sm">
          <FiCheck />
          Strong password
        </div>

      ) : (
        <div className="space-y-1">
          {rules.map(rule =>
            !checks[rule.key] && (
              <div
                key={rule.key}
                className="flex items-center gap-2 text-sm text-text-muted"
              >
                <FiX className="text-error" />
                {rule.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default PasswordStrength;