import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

import loginImage from "@/assets/login_icon.png";

import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";

import { validateLogin } from "@/utils/validators";
import { getBackendErrorMessage } from "@/utils/errorHelpers";
import authService from "@/services/authServices";
import useChat from "@/hooks/useChat";

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useChat();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // 1. Default rememberMe to true if credentials exist in localStorage
  const [rememberMe, setRememberMe] = useState(() => {
    return !!localStorage.getItem("access");
  });

  // 2. Safely resolve auto-login without mixing sessionStorage and localStorage
  useEffect(() => {
    let token = null;
    let storedUser = null;

    if (sessionStorage.getItem("access") && sessionStorage.getItem("user")) {
      token = sessionStorage.getItem("access");
      storedUser = sessionStorage.getItem("user");
    } else if (localStorage.getItem("access") && localStorage.getItem("user")) {
      token = localStorage.getItem("access");
      storedUser = localStorage.getItem("user");
    }

    if (token && storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        navigate("/chat", { replace: true });
      } catch {
        setCurrentUser(null);
      }
    }
  }, [navigate, setCurrentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name] || errors.auth) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        auth: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // This correctly passes { email, password, remember } to your service!
      await authService.login({
        ...formData,
        remember: rememberMe,
      });

      // 3. Retrieve user profile cleanly from whichever storage was used
      const activeStorage = rememberMe ? localStorage : sessionStorage;
      const storedUser = JSON.parse(activeStorage.getItem("user") || "null");

      if (storedUser) {
        setCurrentUser(storedUser);
      }

      navigate("/chat");
    } catch (err) {
      setErrors({
        auth: getBackendErrorMessage(err, "Invalid login credentials."),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Welcome Back"
      subheading="Log in to your account to continue."
      formHeading="Sign In"
      formSubheading="Enter your credentials to access your account."
      title="Connect Instantly."
      subtitle="Chat with your friends and teams seamlessly around the world."
      illustration={loginImage}
      authError={errors.auth}
    >
      <form onSubmit={handleLogin} className="w-full">
        <div className="space-y-4 sm:space-y-5">
          <Input
            label="Email or Mobile Number"
            name="email"
            type="text"
            icon={FiUser}
            placeholder="Email or 10-digit mobile"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="username"
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        <div className="mt-4 flex items-center justify-between px-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary accent-primary cursor-pointer"
            />

            <span className="text-xs sm:text-sm font-medium text-text-muted">
              Remember me
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-xs sm:text-sm font-semibold text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 sm:mt-8">
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            loadingText="Signing in..."
          >
            Sign In
          </Button>
        </div>

        <p className="mt-6 text-center text-xs sm:text-sm text-text-muted">
          Don't have an account?{" "}
          <Link
            to="/create-account"
            className="font-semibold text-primary hover:underline"
          >
            Sign up for free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;