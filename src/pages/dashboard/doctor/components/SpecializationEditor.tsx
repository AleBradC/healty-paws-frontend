import { useState, type FormEvent } from "react";
import type { Service, Specialization } from "../../../../types";
import { Input } from "../../../../components/ui/Input/Input";
import { Button } from "../../../../components/ui/Button/Button";
import "../styles.css";

export function SpecializationEditor({
  specialization,
  onUpdate,
  onDelete,
}: {
  specialization: Specialization;
  onUpdate: (updatedSpec: Specialization) => void;
  onDelete: (specId: string) => void;
}) {
  const [customServiceName, setCustomServiceName] = useState("");
  const [customServicePrice, setCustomServicePrice] = useState("");

  const handleUpdateService = (serviceId: string, newPrice: string) => {
    const updatedServices = specialization.services.map((prevServices) =>
      prevServices.id === serviceId
        ? { ...prevServices, price: Number(newPrice) || 0 }
        : prevServices
    );
    onUpdate({ ...specialization, services: updatedServices });
  };

  const handleDeleteService = (serviceId: string) => {
    const updatedServices = specialization.services.filter(
      (prevServices) => prevServices.id !== serviceId
    );
    onUpdate({ ...specialization, services: updatedServices });
  };

  const handleAddCustomService = (e: FormEvent) => {
    e.preventDefault();
    if (!customServiceName.trim()) return;

    const newService: Service = {
      id: `custom-${Date.now()}`,
      name: customServiceName.trim(),
      price: Number(customServicePrice) || 0,
      specialization_id: specialization.id,
    };

    onUpdate({
      ...specialization,
      services: [...specialization.services, newService],
    });
    setCustomServiceName("");
    setCustomServicePrice("");
  };

  return (
    <div className="specialization-editor-block">
      <div className="specialization-editor-header">
        <h3>{specialization.name}</h3>
        <Button
          text="Remove Specialization"
          size="sm"
          onClick={() => onDelete(specialization.id)}
        />
      </div>
      <div className="service-editor-list">
        {(specialization.services ?? []).map((service) => (
          <div key={service.id} className="service-editor-row">
            <span className="readonly-service-name">{service.name}</span>
            <Input
              type="number"
              value={String(service.price)}
              onChange={(e) => handleUpdateService(service.id, e.target.value)}
              placeholder="Price ($)"
            />
            <button
              type="button"
              className="delete-service-btn"
              onClick={() => handleDeleteService(service.id)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleAddCustomService}
        className="add-custom-service-form"
      >
        <p>Add a custom service:</p>
        <div className="custom-service-inputs">
          <Input
            value={customServiceName}
            onChange={(e) => setCustomServiceName(e.target.value)}
            placeholder="Custom Service Name"
            required
          />
          <Input
            type="number"
            value={customServicePrice}
            onChange={(e) => setCustomServicePrice(e.target.value)}
            placeholder="Price ($)"
            required
          />
          <Button text="Add Service to Draft" type="submit" size="sm" />
        </div>
      </form>
    </div>
  );
}
