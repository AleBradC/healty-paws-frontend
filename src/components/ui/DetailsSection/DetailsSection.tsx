import { type FC, type ReactNode } from 'react';
import './styles.css';

interface DetailsSectionProps {
  title: string;
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const DetailsSection: FC<DetailsSectionProps> = ({
  title,
  headerActions,
  children,
  className = "",
}) => {
  return (
    <section className={`details-section-container ${className}`}>
      <div className="details-section-header">
        <h2 className="details-section-title">{title}</h2>
        {headerActions && <div className="details-section-actions">{headerActions}</div>}
      </div>
      <div className="details-section-content">
        {children}
      </div>
    </section>
  );
};
