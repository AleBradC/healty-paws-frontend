import { Input } from "../../../components/ui/Input/Input";

const LabeledInput = ({
  label,
  ...props
}: { label: string } & React.ComponentProps<typeof Input>) => (
  <div className="labeled-input">
    <label>{label}</label>
    <Input {...props} />
  </div>
);

export default LabeledInput;
