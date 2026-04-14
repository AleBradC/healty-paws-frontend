import { type FC, useState, useRef, useEffect } from "react";
import { DropdownMenu } from "../../ui/DropDownMenu/DropdownMenu";
import { AvatarImage } from "../../ui/AvatarImage/AvatarImage";
import "./styles.css";

export interface MenuItem {
  label: string;
  redirect: () => void;
}

interface ProfilePictureProps {
  menuItems: MenuItem[];
  avatarStorageKey?: string;
}

export const ProfilePicture: FC<ProfilePictureProps> = ({
  menuItems,
  avatarStorageKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="profile-picture-container"
      ref={containerRef}
      suppressHydrationWarning
    >
      <AvatarImage
        alt="Profile"
        storageKey={avatarStorageKey}
        size={40}
        onClick={() => setIsOpen(!isOpen)}
      />

      <DropdownMenu
        items={menuItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};
