import { type FC } from "react";
import "./styles.css";

interface InfoBlockProps {
  label: string;
  value: string | number | undefined | null;
}

const InfoBlock: FC<InfoBlockProps> = ({ label, value }) => (
  <div className="info-block">
    <span className="info-label">{label}</span>
    <span className="info-value">{value ?? "N/A"}</span>
  </div>
);

export default InfoBlock;
