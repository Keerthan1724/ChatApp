import { useRef } from "react";

const OTPInput = ({ value, onChange, error }) => {
  const inputsRef = useRef([]);

  const handleChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");

    if (!val) {
      const otp = value.split("");
      otp[index] = "";
      onChange(otp.join(""));
      return;
    }

    const otp = value.split("");
    otp[index] = val[0];
    onChange(otp.join(""));

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    onChange(pasted);

    inputsRef.current[
      Math.min(pasted.length - 1, 5)
    ]?.focus();
  };

  return (
    <>
      <div
        className="flex justify-center gap-1.5 sm:gap-3"
        onPaste={handlePaste}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={` h-12 w-10 rounded-xl border text-center text-lg font-semibold outline-none transition focus:outline-none sm:h-16 sm:w-14 sm:text-xl
              ${
                error
                  ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                  : "border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
              }
            `}
          />
        ))}
      </div>

      {error && (
        <p className="mt-2 text-center text-sm text-error">
          {error}
        </p>
      )}
    </>
  );
};

export default OTPInput;