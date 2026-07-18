import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthRouteGuard from "@/components/auth/AuthRouteGuard";
import CreateAccount from "@/pages/auth/CreateAccount";
import ProfileSetup from "@/pages/auth/ProfileSetup";
import EmailVerification from "@/pages/auth/EmailVerification";
import VerifyEmailOTP from "@/pages/auth/VerifyEmailOTP";
import EmailVerificationSuccess from "@/pages/auth/EmailVerificationSuccess";
import ReviewInfo from "@/pages/auth/ReviewInfo";
import RegistrationSuccess from "@/pages/auth/RegistrationSuccess";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import VerifyOTP from "@/pages/auth/VerifyOTP";
import ResetPassword from "@/pages/auth/ResetPassword";
import ResetSuccess from "@/pages/auth/ResetSuccess";

import ChatPage from "@/pages/chat/ChatPage";

export default function AppRoutes() {
  
  return (
    <BrowserRouter>
      <AuthRouteGuard>
        <Routes>
          {/* Default Fallbacks */}
          <Route path="/" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<Navigate to="/chat" replace />} />

          {/* Registration Flow */}
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/verify-email-otp" element={<VerifyEmailOTP />} />
          <Route path="/email-verification-success" element={<EmailVerificationSuccess />} />
          <Route path="/review-info" element={<ReviewInfo />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />

          {/* Authentication & Password Management */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-success" element={<ResetSuccess />} />

          {/* Core Messaging Hub */}
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/chat/:conversationId" element={<ChatPage />} />
        </Routes>
      </AuthRouteGuard>
    </BrowserRouter>
  );
}