import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import profileSetupImage from "@/assets/profile_setup.png";
import AuthLayout from "@/layouts/AuthLayout";
import Button from "@/components/ui/Button";
import ProfileImagePicker from "@/components/ui/ProfileImagePicker";

import { useRegister } from "@/context/RegisterContext";
import { setFlowState } from "@/utils/flowGuard";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { registerData, updateRegisterData } = useRegister();

  const [profileImage, setProfileImage] = useState(
    registerData.profile_picture || null,
  );
  const [preview, setPreview] = useState(
    registerData.profile_picture_preview || null,
  );
  const [form, setForm] = useState({ bio: registerData.bio || "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setProfileImage(registerData.profile_picture || null);
    setPreview(registerData.profile_picture_preview || null);
    setForm({ bio: registerData.bio || "" });
  }, [
    registerData.profile_picture,
    registerData.profile_picture_preview,
    registerData.bio,
  ]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = ({ file, preview }) => {
    setProfileImage(file);
    setPreview(preview);
    updateRegisterData({
      profile_picture: file,
      profile_picture_preview: preview,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      updateRegisterData({ [name]: value });
      return next;
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLater = () => {
    updateRegisterData({ bio: form.bio });
    setFlowState({ profileSetupCompleted: true, verificationSkipped: true });
    navigate("/verify-email");
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      updateRegisterData({
        bio: form.bio,
        profile_picture: profileImage,
        profile_picture_preview: preview,
      });

      setFlowState({ profileSetupCompleted: true });
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heading="Express Yourself"
      subheading="Add a custom profile picture and a short bio so your contacts can recognize you instantly."
      title="Customize Profile."
      subtitle="Your appearance will look beautiful throughout the active chat rooms and message cards."
      illustration={profileSetupImage}
      formHeading="Personalize Identity"
      formSubheading="Upload an avatar photo and share a brief introduction."
    >
      <div className="w-full">
        <ProfileImagePicker
          value={profileImage}
          preview={preview}
          onChange={handleImageChange}
        />

        <div className="mt-6 sm:mt-8 max-w-md mx-auto px-2">
          <label className="mb-1.5 sm:mb-2 block text-xs sm:text-sm font-medium text-text">
            Bio
          </label>
          <textarea
            name="bio"
            rows={4}
            maxLength={150}
            placeholder="Tell everyone about yourself..."
            value={form.bio}
            onChange={handleChange}
            className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <div className="mt-1.5 text-right text-[10px] sm:text-xs text-text-muted">
            {form.bio.length}/150
          </div>
        </div>

        <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-4 max-w-md mx-auto px-2">
          <Button variant="outline" onClick={handleLater}>
            Later
          </Button>
          <Button
            loading={loading}
            loadingText="Saving..."
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ProfileSetup;
