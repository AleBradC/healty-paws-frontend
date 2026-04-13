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
  const canAddCustomService =
    customServiceName.trim().length > 0 &&
    Number(customServicePrice) > 0;

  const handleUpdateService = (serviceId: string, newPrice: string) => {
    const normalizedPrice = Math.max(0, Number(newPrice) || 0);
    const updatedServices = specialization.services.map((prevServices) =>
      prevServices.id === serviceId
        ? { ...prevServices, price: normalizedPrice }
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
      price: Math.max(0, Number(customServicePrice) || 0),
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
          type="button"
          size="sm"
          color="danger"
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
              min="0"
              step="0.01"
            />
            <button
              type="button"
              className="delete-service-btn"
              onClick={() => handleDeleteService(service.id)}
              aria-label="Remove service"
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
            onChange={(e) =>
              setCustomServicePrice(String(Math.max(0, Number(e.target.value) || 0)))
            }
            placeholder="Price ($)"
            min="0"
            step="0.01"
            required
          />
          <Button
            text="+ Add Service"
            type="submit"
            size="sm"
            color="primary"
            disabled={!canAddCustomService}
          />
        </div>
      </form>
    </div>
  );
}
