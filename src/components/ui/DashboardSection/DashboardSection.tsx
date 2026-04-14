import { type FC, type ReactNode, type FormEvent } from 'react';
import './styles.css';

interface DashboardSectionProps {
  title: string;
  children: ReactNode;
  as?: 'div' | 'form';
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  className?: string;
}

export const DashboardSection: FC<DashboardSectionProps> = ({
  title,
  children,
  as = 'div',
  onSubmit,
  className = '',
}) => {
  const containerClassName = `dashboard-section-container ${className}`;

  const content = (
    <>
      <div className="dashboard-section-header">
        <h2 className="dashboard-section-title">{title}</h2>
      </div>
      <div className="dashboard-section-content">
        {children}
      </div>
    </>
  );

  if (as === 'form') {
    return (
      <form className={containerClassName} onSubmit={onSubmit}>
        {content}
      </form>
    );
  }

  return (
    <div className={containerClassName}>
      {content}
    </div>
  );
};
