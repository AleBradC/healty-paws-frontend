import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { addHours, addMinutes, subMinutes } from "date-fns";
import { getAppointmentDisplayStatus } from "./appointment-status";

const NOW = new Date("2026-05-17T12:00:00.000Z");

describe("getAppointmentDisplayStatus", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Pending" when baseStatus is null', () => {
    expect(getAppointmentDisplayStatus(null, NOW.toISOString())).toBe(
      "Pending",
    );
  });

  it('returns "Pending" when baseStatus is undefined', () => {
    expect(getAppointmentDisplayStatus(undefined, NOW.toISOString())).toBe(
      "Pending",
    );
  });

  it('returns "Pending" when baseStatus is the empty string', () => {
    expect(getAppointmentDisplayStatus("", NOW.toISOString())).toBe("Pending");
  });

  it("passes through non-Confirmed statuses unchanged", () => {
    expect(getAppointmentDisplayStatus("Cancelled", NOW.toISOString())).toBe(
      "Cancelled",
    );
    expect(getAppointmentDisplayStatus("Completed", NOW.toISOString())).toBe(
      "Completed",
    );
  });

  it('keeps "Confirmed" when the appointment is more than 2h away', () => {
    const future = addHours(NOW, 5).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", future)).toBe("Confirmed");
  });

  it('keeps "Confirmed" when the appointment is far in the past', () => {
    const past = addHours(NOW, -5).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", past)).toBe("Confirmed");
  });

  it('returns "Upcoming" when appointment is between 5m and 2h away', () => {
    const in1h = addMinutes(NOW, 60).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", in1h)).toBe("Upcoming");
  });

  it('returns "Upcoming" near the 2h-from-now boundary', () => {
    const justInside = subMinutes(addHours(NOW, 2), 1).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", justInside)).toBe(
      "Upcoming",
    );
  });

  it('returns "Start" when within 5m before until 1h after', () => {
    const in1m = addMinutes(NOW, 1).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", in1m)).toBe("Start");

    const ago30m = addMinutes(NOW, -30).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", ago30m)).toBe("Start");
  });

  it('returns "Start" exactly at appointment time', () => {
    expect(getAppointmentDisplayStatus("Confirmed", NOW.toISOString())).toBe(
      "Start",
    );
  });

  it('falls back to "Confirmed" once the 1h grace window has elapsed', () => {
    const longGone = addMinutes(NOW, -61 - 60).toISOString();
    expect(getAppointmentDisplayStatus("Confirmed", longGone)).toBe(
      "Confirmed",
    );
  });

  it("accepts a Date object as datetime input", () => {
    const dateInstance = addMinutes(NOW, 1);
    expect(getAppointmentDisplayStatus("Confirmed", dateInstance)).toBe(
      "Start",
    );
  });
});
