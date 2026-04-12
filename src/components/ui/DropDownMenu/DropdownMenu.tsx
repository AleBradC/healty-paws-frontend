import { type KeyboardEvent, type FC } from "react";
import "./styles.css";

export interface MenuItem {
  label: string;
  redirect: () => void;
}

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (
    e: KeyboardEvent<HTMLAnchorElement>,
    redirect: () => void
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      redirect();
      onClose();
    }
  };

  return (
    <div className="dropdown-menu" role="menu">
      {items.map((item, idx) => (
        <a
          key={idx}
          role="menuitem"
          tabIndex={0}
          className="dropdown-item"
          onClick={() => {
            item.redirect();
            onClose();
          }}
          onKeyDown={(e) => handleKeyDown(e, item.redirect)}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
};
