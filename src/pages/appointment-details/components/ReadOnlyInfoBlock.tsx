const ReadOnlyInfoBlock = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) => (
  <div className="readonly-info-block">
    <div className="readonly-label">{label}</div>
    <div className="readonly-value">{value || "N/A"}</div>
  </div>
);

export default ReadOnlyInfoBlock;
