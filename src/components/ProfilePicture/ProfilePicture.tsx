import React, { type FC, useState, useRef, useEffect } from "react";
import { DropdownMenu } from "../DropDownMenu/DropdownMenu";
import "./styles.css";

export interface MenuItem {
  label: string;
  redirect: () => void;
}

interface ProfilePictureProps {
  menuItems: MenuItem[];
}

export const ProfilePicture: FC<ProfilePictureProps> = ({ menuItems }) => {
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
      <img
        src="/profile-placeholder.jpg"
        alt="Profile"
        className="profile-picture"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        width={40}
        height={40}
      />

      <DropdownMenu
        items={menuItems}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};
