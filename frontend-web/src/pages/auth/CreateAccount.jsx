import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";

import createAccountImage from "@/assets/create_account.png";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/auth/PasswordInput";

import { useRegister } from "@/context/RegisterContext";
import { validateCreateAccount } from "@/utils/validators";
import { setFlowState, getFlowState, clearFlowState } from "@/utils/flowGuard";

const CreateAccount = () => {
  const navigate = useNavigate();
  const { registerData, updateRegisterData } = useRegister();
  const [form, setForm] = useState(registerData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      updateRegisterData({ [name]: value });
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCreateAccount(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    clearFlowState();
    updateRegisterData({
      ...form,
      email_verified: false,
    });

    setFlowState({
      createAccountCompleted: true,
      emailVerified: false,
      registrationCompleted: false,
    });

    navigate("/profile-setup");
  };

  useEffect(() => {
    if (registerData) {
      setForm(registerData);
    }
  }, [registerData]);

  useEffect(() => {
    const flow = getFlowState();
    if (flow.emailVerified && !flow.registrationCompleted) {
      setFlowState({ emailVerified: false });
      updateRegisterData({ email_verified: false });
    }
  }, []);

  return (
    <AuthLayout
      heading="Join Our Community"
      subheading="Get started today to begin interacting with teams globally."
      title="Connect. Chat. Share."
      subtitle="Create your QuickChat account and start secure conversations."
      illustration={createAccountImage}
      formHeading="Get Started"
      formSubheading="Fill in your profile details to create your new credentials."
    >
      <form onSubmit={handleSubmit} className="w-full">

        <div className="space-y-4">
          <Input
            label="Full Name"
            name="full_name"
            placeholder="John Doe"
            value={form.full_name}
            onChange={handleChange}
            icon={FiUser}
            error={errors.full_name}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            icon={FiMail}
            error={errors.email}
          />

          <Input
            label="Phone Number"
            name="mobile_number"
            placeholder="+91 9876543210"
            value={form.mobile_number}
            onChange={handleChange}
            icon={FiPhone}
            error={errors.mobile_number}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            showStrength
          />

          <PasswordInput
            label="Confirm Password"
            name="confirm_password"
            placeholder="Confirm password"
            value={form.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password}
          />

          <Button type="submit" className="mt-2 w-full">
            Continue
          </Button>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-primary hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default CreateAccount;
