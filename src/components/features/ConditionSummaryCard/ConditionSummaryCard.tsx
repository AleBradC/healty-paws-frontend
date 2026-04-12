import { type FC } from "react";
import "./styles.css";

interface ConditionSummaryCardProps {
  disease: string;
  treatment: string;
  active?: boolean;
}

export const ConditionSummaryCard: FC<ConditionSummaryCardProps> = ({
  disease,
  treatment,
  active = false,
}) => (
  <div className={`condition-summary-card ${active ? "active" : ""}`}>
    <strong>{disease}</strong>
    <p>{treatment}</p>
  </div>
);
