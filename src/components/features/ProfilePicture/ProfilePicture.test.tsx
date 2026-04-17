import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfilePicture } from './ProfilePicture';

const menuItems = [
  { label: 'My Profile', redirect: vi.fn() },
  { label: 'Logout', redirect: vi.fn() },
];

describe('ProfilePicture', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the avatar image', () => {
    render(<ProfilePicture menuItems={menuItems} />);
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('dropdown is closed initially', () => {
    render(<ProfilePicture menuItems={menuItems} />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens the dropdown when the avatar is clicked', async () => {
    render(<ProfilePicture menuItems={menuItems} />);
    await userEvent.click(screen.getByAltText('Profile'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('closes the dropdown when clicked outside', async () => {
    render(
      <div>
        <ProfilePicture menuItems={menuItems} />
        <button>Outside</button>
      </div>
    );
    await userEvent.click(screen.getByAltText('Profile'));
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('toggles the dropdown on repeated clicks', async () => {
    render(<ProfilePicture menuItems={menuItems} />);
    await userEvent.click(screen.getByAltText('Profile'));
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await userEvent.click(screen.getByAltText('Profile'));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
