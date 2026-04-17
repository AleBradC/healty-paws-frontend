import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

const tabs = [
  { id: 'tab1', label: 'Tab One' },
  { id: 'tab2', label: 'Tab Two' },
  { id: 'tab3', label: 'Tab Three' },
];

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(<Tabs tabs={tabs} activeTab="tab1" onTabClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Tab One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tab Two' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Tab Three' })).toBeInTheDocument();
  });

  it('marks the active tab with the "active" class', () => {
    render(<Tabs tabs={tabs} activeTab="tab2" onTabClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Tab Two' })).toHaveClass('active');
  });

  it('does not mark inactive tabs as active', () => {
    render(<Tabs tabs={tabs} activeTab="tab2" onTabClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Tab One' })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Tab Three' })).not.toHaveClass('active');
  });

  it('calls onTabClick with the correct id when a tab is clicked', async () => {
    const onTabClick = vi.fn();
    render(<Tabs tabs={tabs} activeTab="tab1" onTabClick={onTabClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Tab Three' }));
    expect(onTabClick).toHaveBeenCalledWith('tab3');
  });

  it('renders an empty list when no tabs are provided', () => {
    const { container } = render(<Tabs tabs={[]} activeTab="" onTabClick={vi.fn()} />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});
