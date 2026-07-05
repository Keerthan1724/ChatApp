import { useRef, useState } from "react";
import { FiCamera, FiUser } from "react-icons/fi";
import Input from "@/components/ui/Input";
import { validateProfileImage } from "@/utils/validators";

const ProfileImagePicker = ({
  value = null,
  preview = null,
  onChange,
}) => {
  const inputRef = useRef(null);
  const [error, setError] = useState("");

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateProfileImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    onChange({
      file,
      preview: URL.createObjectURL(file),
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleImageChange}
      />

      <div
        onClick={handleClick}
        className="relative cursor-pointer transition hover:scale-105"
      >
        <div
          className="flex h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 items-center justify-center overflow-hidden rounded-full border-4 border-primary/50 bg-white shadow-lg transition-all"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <FiUser
              className="text-slate-400 h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14"
          />
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className="absolute bottom-0 right-0 sm:bottom-0.5 sm:right-0.5 md:bottom-1 md:right-1 flex h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg transition hover:scale-110"
        >
          <FiCamera className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]" />
        </button>
      </div>

      <button
        type="button"
        onClick={handleClick}
        className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-primary hover:underline"
      >
        Upload Photo
      </button>

      <p className="mt-1 text-[10px] sm:text-xs text-text-muted">
        JPG, PNG, WEBP • Max 5MB
      </p>

      {error && (
        <p className="mt-2 text-center text-xs sm:text-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProfileImagePicker;