import { type ReactNode } from "react";
import { Button } from "../../../../components/ui/Button/Button";

export interface AuthInfoScreenProps {
  title: string;
  description: ReactNode;
  ctaLabel: string;
  onCta: () => void;
}

export function AuthInfoScreen({
  title,
  description,
  ctaLabel,
  onCta,
}: AuthInfoScreenProps) {
  return (
    <>
      <h1 className="auth-title">{title}</h1>
      <div className="confirmation-step">
        <p className="auth-note">{description}</p>
        <div className="auth-actions">
          <Button onClick={onCta} text={ctaLabel} color="primary" size="md" />
        </div>
      </div>
    </>
  );
}
