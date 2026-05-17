import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvatarImage } from './AvatarImage';

// jsdom doesn't implement FileReader.readAsDataURL, so we mock it
const mockReadAsDataURL = vi.fn();
vi.stubGlobal('FileReader', class {
  onload: ((e: any) => void) | null = null;
  result: string | null = null;
  readAsDataURL(file: File) {
    mockReadAsDataURL(file);
    this.result = 'data:image/png;base64,abc';
    this.onload?.({ target: this });
  }
});

describe('AvatarImage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockReadAsDataURL.mockClear();
  });

  it('renders with the fallback src by default', () => {
    render(<AvatarImage alt="Profile" fallbackSrc="/placeholder.jpg" />);
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', '/placeholder.jpg');
  });

  it('loads image from localStorage when storageKey matches', () => {
    localStorage.setItem('avatar-key', 'data:image/png;base64,stored');
    render(<AvatarImage alt="Profile" storageKey="avatar-key" />);
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', 'data:image/png;base64,stored');
  });

  it('applies the correct size dimensions', () => {
    const { container } = render(<AvatarImage alt="A" size={80} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.width).toBe('80px');
    expect(wrapper.style.height).toBe('80px');
  });

  it('shows the "Change Photo" overlay when editable', () => {
    render(<AvatarImage alt="A" editable />);
    expect(screen.getByRole('button', { name: /change photo/i })).toBeInTheDocument();
  });

  it('does not show the overlay when not editable', () => {
    render(<AvatarImage alt="A" />);
    expect(screen.queryByRole('button', { name: /change photo/i })).not.toBeInTheDocument();
  });

  it('calls onClick when the image is clicked', async () => {
    const onClick = vi.fn();
    render(<AvatarImage alt="A" onClick={onClick} />);
    await userEvent.click(screen.getByAltText('A'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has role="button" on the img when onClick is provided', () => {
    render(<AvatarImage alt="A" onClick={vi.fn()} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not have role="button" on the img when onClick is not provided', () => {
    render(<AvatarImage alt="A" />);
    // The img should not have role button
    const img = screen.getByAltText('A');
    expect(img).not.toHaveAttribute('role', 'button');
  });

  it('opens the file picker when "Change Photo" is clicked', async () => {
    render(<AvatarImage alt="A" editable />);
    // The hidden <input type="file"> doesn't expose a friendly query, so
    // grab it via querySelector and spy on its click().
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');
    await userEvent.click(
      screen.getByRole('button', { name: /change photo/i })
    );
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('reads an uploaded image and persists it to localStorage', async () => {
    render(<AvatarImage alt="A" editable storageKey="avatar-key" />);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['x'], 'pic.png', { type: 'image/png' });
    await userEvent.upload(fileInput, file);

    expect(mockReadAsDataURL).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('A')).toHaveAttribute(
      'src',
      'data:image/png;base64,abc'
    );
    expect(localStorage.getItem('avatar-key')).toBe('data:image/png;base64,abc');
  });

  it('ignores non-image file types', async () => {
    render(<AvatarImage alt="A" editable />);
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const txt = new File(['x'], 'note.txt', { type: 'text/plain' });
    await userEvent.upload(fileInput, txt);
    expect(mockReadAsDataURL).not.toHaveBeenCalled();
  });
});
