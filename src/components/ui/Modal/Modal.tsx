import { type FC, type ReactNode } from "react";
import "./styles.css";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footerContent?: ReactNode;
}

export const Modal: FC<ModalProps> = ({
  title,
  onClose,
  children,
  footerContent,
}) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h2>{title}</h2>
        <button
          onClick={onClose}
          className="close-button"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {footerContent && <div className="modal-footer">{footerContent}</div>}
    </div>
  </div>
);
