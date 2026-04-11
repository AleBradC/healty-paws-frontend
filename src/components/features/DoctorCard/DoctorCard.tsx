import { type FC } from "react";
import { Button } from "../../ui/Button/Button";
import "./styles.css";

interface DoctorCardProps {
  id: string;
  name: string;
  specializations?: string;
  clinic?: string;
  address?: string;
  imageUrl: string;
  onSelect: (id: string) => void;
}

export const DoctorCard: FC<DoctorCardProps> = ({
  id,
  name,
  specializations,
  clinic,
  address,
  imageUrl,
  onSelect,
}) => (
  <article className="doctor-card">
    <div className="doctor-photo">
      <img
        src={imageUrl}
        alt={`Photo of ${name}`}
        width={150}
        height={150}
        className="doctor-image"
      />
    </div>
    <div className="doctor-details">
      <h3 className="doctor-name">{name}</h3>
      <p className="doctor-specialization">{specializations}</p>
      <div className="doctor-location">
        <p className="doctor-clinic">{clinic}</p>
        <p className="doctor-address">{address}</p>
      </div>
      <div className="doctor-actions">
        <Button
          text="Choose this Doctor"
          color="primary"
          size="md"
          onClick={() => onSelect(id)}
        />
      </div>
    </div>
  </article>
);
