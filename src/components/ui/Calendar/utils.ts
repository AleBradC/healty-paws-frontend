export const generateTimeSlots = (
  start: number,
  end: number,
  interval: number
): string[] => {
  const slots: string[] = [];
  for (let hour = start; hour < end; hour++) {
    for (let min = 0; min < 60; min += interval) {
      slots.push(
        `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`
      );
    }
  }
  return slots;
};
