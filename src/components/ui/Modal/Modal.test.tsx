import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders the title', () => {
    render(<Modal title="My Modal" onClose={vi.fn()}><p>Body</p></Modal>);
    expect(screen.getByRole('heading', { name: 'My Modal' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Modal title="T" onClose={vi.fn()}><p>Hello Content</p></Modal>);
    expect(screen.getByText('Hello Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<Modal title="T" onClose={onClose}><p>Body</p></Modal>);
    await userEvent.click(screen.getByRole('button', { name: /close modal/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders footerContent when provided', () => {
    render(
      <Modal title="T" onClose={vi.fn()} footerContent={<button>Save</button>}>
        <p>Body</p>
      </Modal>
    );
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not render footer when footerContent is not provided', () => {
    render(<Modal title="T" onClose={vi.fn()}><p>Body</p></Modal>);
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('has a modal-overlay wrapper', () => {
    const { container } = render(<Modal title="T" onClose={vi.fn()}><p>Body</p></Modal>);
    expect(container.firstChild).toHaveClass('modal-overlay');
  });
});
