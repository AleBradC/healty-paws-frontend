import { type ChangeEvent, type FC, useEffect, useRef, useState } from "react";
import "./styles.css";

interface AvatarImageProps {
  alt: string;
  storageKey?: string;
  size?: number;
  editable?: boolean;
  fallbackSrc?: string;
  onClick?: () => void;
}

export const AvatarImage: FC<AvatarImageProps> = ({
  alt,
  storageKey,
  size = 160,
  editable = false,
  fallbackSrc = "/profile-placeholder.jpg",
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState(fallbackSrc);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    const storedImage = window.localStorage.getItem(storageKey);
    if (storedImage) {
      setImageSrc(storedImage);
    }
  }, [storageKey]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") return;

      setImageSrc(result);
      if (storageKey && typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, result);
      }
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    if (!editable) return;
    fileInputRef.current?.click();
  };

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <div
      className={`avatar-image-wrapper ${editable ? "editable" : ""}`}
      style={containerStyle}
    >
      <img
        src={imageSrc}
        alt={alt}
        className="avatar-image"
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : -1}
      />
      {editable && (
        <>
          <button
            type="button"
            className="avatar-image-overlay"
            onClick={openFilePicker}
          >
            Change Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="avatar-image-input"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};
