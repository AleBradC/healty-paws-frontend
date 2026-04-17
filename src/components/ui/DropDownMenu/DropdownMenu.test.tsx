import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropdownMenu } from './DropdownMenu';

const items = [
  { label: 'My Profile', redirect: vi.fn() },
  { label: 'Logout', redirect: vi.fn() },
];

describe('DropdownMenu', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <DropdownMenu items={items} isOpen={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders all items when isOpen is true', () => {
    render(<DropdownMenu items={items} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('calls redirect and onClose when an item is clicked', async () => {
    const onClose = vi.fn();
    const redirect = vi.fn();
    render(
      <DropdownMenu
        items={[{ label: 'Go', redirect }]}
        isOpen={true}
        onClose={onClose}
      />
    );
    await userEvent.click(screen.getByText('Go'));
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls redirect and onClose on Enter key', async () => {
    const onClose = vi.fn();
    const redirect = vi.fn();
    render(
      <DropdownMenu
        items={[{ label: 'Go', redirect }]}
        isOpen={true}
        onClose={onClose}
      />
    );
    screen.getByText('Go').focus();
    await userEvent.keyboard('{Enter}');
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls redirect and onClose on Space key', async () => {
    const onClose = vi.fn();
    const redirect = vi.fn();
    render(
      <DropdownMenu
        items={[{ label: 'Go', redirect }]}
        isOpen={true}
        onClose={onClose}
      />
    );
    screen.getByText('Go').focus();
    await userEvent.keyboard(' ');
    expect(redirect).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has correct ARIA roles', () => {
    render(<DropdownMenu items={items} isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(2);
  });
});
