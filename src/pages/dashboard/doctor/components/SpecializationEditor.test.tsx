import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SpecializationEditor } from './SpecializationEditor';
import type { Specialization } from '../../../../types';

function makeSpec(overrides: Partial<Specialization> = {}): Specialization {
  return {
    id: 'spec-1',
    name: 'Cardiology',
    services: [
      {
        id: 'svc-1',
        specialization_id: 'spec-1',
        name: 'Checkup',
        price: 50,
      },
      {
        id: 'svc-2',
        specialization_id: 'spec-1',
        name: 'EKG',
        price: 80,
      },
    ],
    ...overrides,
  };
}

describe('SpecializationEditor', () => {

  it('renders the specialization name and existing services', () => {
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Cardiology' })
    ).toBeInTheDocument();
    expect(screen.getByText('Checkup')).toBeInTheDocument();
    expect(screen.getByText('EKG')).toBeInTheDocument();
  });

  it('invokes onDelete with the specialization id when "Remove" is clicked', async () => {
    const onDelete = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={vi.fn()}
        onDelete={onDelete}
      />
    );
    await userEvent.click(
      screen.getByRole('button', { name: /remove specialization/i })
    );
    expect(onDelete).toHaveBeenCalledWith('spec-1');
  });

  it('updates a service price (clamped to >= 0)', () => {
    const onUpdate = vi.fn();
    const spec = makeSpec();
    render(
      <SpecializationEditor
        specialization={spec}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    const priceInputs = screen.getAllByPlaceholderText('Price ($)');
    // The first two inputs are the per-service prices (the third is the
    // custom-service price field below). fireEvent.change avoids the
    // controlled-input append behaviour you'd get from userEvent.type
    // when the parent doesn't update the value prop.
    fireEvent.change(priceInputs[0], { target: { value: '100' } });

    const lastCall = onUpdate.mock.calls.at(-1)?.[0] as Specialization;
    expect(lastCall.services[0].price).toBe(100);
    expect(lastCall.services[1].price).toBe(80);
  });

  it('treats a non-numeric/empty price as 0', () => {
    const onUpdate = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    const priceInputs = screen.getAllByPlaceholderText('Price ($)');
    fireEvent.change(priceInputs[0], { target: { value: '' } });

    const lastCall = onUpdate.mock.calls.at(-1)?.[0] as Specialization;
    expect(lastCall.services[0].price).toBe(0);
  });

  it('clamps a negative price input to 0', () => {
    const onUpdate = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    const priceInputs = screen.getAllByPlaceholderText('Price ($)');
    fireEvent.change(priceInputs[0], { target: { value: '-50' } });

    const lastCall = onUpdate.mock.calls.at(-1)?.[0] as Specialization;
    expect(lastCall.services[0].price).toBe(0);
  });

  it('removes a service when its delete button is clicked', async () => {
    const onUpdate = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    const removeButtons = screen.getAllByLabelText(/remove service/i);
    await userEvent.click(removeButtons[0]);

    const lastCall = onUpdate.mock.calls.at(-1)?.[0] as Specialization;
    expect(lastCall.services).toHaveLength(1);
    expect(lastCall.services[0].id).toBe('svc-2');
  });

  it('keeps the "Add Service" button disabled until name and positive price are provided', async () => {
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const addButton = screen.getByRole('button', { name: /add service/i });
    expect(addButton).toBeDisabled();

    await userEvent.type(
      screen.getByPlaceholderText('Custom Service Name'),
      'New Service'
    );
    expect(addButton).toBeDisabled();

    const priceInputs = screen.getAllByPlaceholderText('Price ($)');
    // The custom-service price field is the last one rendered.
    fireEvent.change(priceInputs.at(-1)!, { target: { value: '25' } });
    expect(addButton).not.toBeDisabled();
  });

  it('appends a custom service via onUpdate and resets the form', async () => {
    const onUpdate = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    const nameInput = screen.getByPlaceholderText('Custom Service Name');
    await userEvent.type(nameInput, '   X-Ray   ');
    const priceInputs = screen.getAllByPlaceholderText('Price ($)');
    fireEvent.change(priceInputs.at(-1)!, { target: { value: '99' } });

    await userEvent.click(screen.getByRole('button', { name: /add service/i }));

    const lastCall = onUpdate.mock.calls.at(-1)?.[0] as Specialization;
    expect(lastCall.services).toHaveLength(3);
    expect(lastCall.services[2]).toMatchObject({
      name: 'X-Ray',
      price: 99,
      specialization_id: 'spec-1',
    });
    expect(lastCall.services[2].id).toMatch(/^custom-/);

    // Inputs are cleared after submit.
    expect(nameInput).toHaveValue('');
  });

  it('ignores submission when the custom service name is whitespace-only', async () => {
    const onUpdate = vi.fn();
    render(
      <SpecializationEditor
        specialization={makeSpec()}
        onUpdate={onUpdate}
        onDelete={vi.fn()}
      />
    );

    // Bypass the disabled state to exercise the early-return guard inside
    // handleAddCustomService directly. We submit the form element instead
    // of clicking the button (which is disabled by canAddCustomService).
    const form = screen
      .getByPlaceholderText('Custom Service Name')
      .closest('form')!;
    fireEvent.submit(form);

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('handles a specialization without a services array', () => {
    render(
      <SpecializationEditor
        specialization={{
          id: 'spec-2',
          name: 'Empty',
          services: undefined as unknown as Specialization['services'],
        }}
        onUpdate={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByRole('heading', { name: 'Empty' })).toBeInTheDocument();
  });
});
