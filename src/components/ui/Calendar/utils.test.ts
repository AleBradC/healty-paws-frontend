import { describe, it, expect } from 'vitest';
import { generateTimeSlots } from './utils';

describe('generateTimeSlots', () => {
  it('generates correct slots for 9–10 with 30-min interval', () => {
    const slots = generateTimeSlots(9, 10, 30);
    expect(slots).toEqual(['09:00', '09:30']);
  });

  it('generates correct slots for 9–17 with 30-min interval (workday)', () => {
    const slots = generateTimeSlots(9, 17, 30);
    expect(slots).toHaveLength(16);
    expect(slots[0]).toBe('09:00');
    expect(slots[slots.length - 1]).toBe('16:30');
  });

  it('generates slots with 60-min interval', () => {
    const slots = generateTimeSlots(9, 12, 60);
    expect(slots).toEqual(['09:00', '10:00', '11:00']);
  });

  it('returns empty array when start equals end', () => {
    const slots = generateTimeSlots(9, 9, 30);
    expect(slots).toHaveLength(0);
  });

  it('pads hours and minutes with leading zeros', () => {
    const slots = generateTimeSlots(8, 9, 30);
    expect(slots[0]).toBe('08:00');
    expect(slots[1]).toBe('08:30');
  });

  it('generates slots with 15-min interval', () => {
    const slots = generateTimeSlots(9, 10, 15);
    expect(slots).toEqual(['09:00', '09:15', '09:30', '09:45']);
  });
});
