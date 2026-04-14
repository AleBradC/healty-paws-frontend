import { type FC } from "react";
import "./styles.css";

interface ConditionSummaryCardProps {
  disease: string;
  treatment: string;
  variant?: "stable" | "active";
}

export const ConditionSummaryCard: FC<ConditionSummaryCardProps> = ({
  disease,
  treatment,
  variant = "stable",
}) => (
  <div className={`condition-summary-card ${variant}`}>
    <div className="condition-row">
      <span className="condition-label">Condition:</span>
      <span className="condition-value">{disease}</span>
    </div>
    <div className="condition-row">
      <span className="condition-label">Treatment:</span>
      <span className="condition-value">{treatment}</span>
    </div>
  </div>
);
