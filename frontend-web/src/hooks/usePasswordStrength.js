const usePasswordStrength = (password) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const passed = Object.values(checks).filter(Boolean).length;

  let strength = "Weak";

  if (passed >= 5) {
    strength = "Strong";
  } else if (passed >= 3) {
    strength = "Medium";
  }

  return {
    checks,
    strength,
    score: passed,
  };
};

export default usePasswordStrength;