export function startOfUtcDay(date: Date | string): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = startOfUtcDay(checkOut).getTime() - startOfUtcDay(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function timeStringToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimeSlots(openTime: string, closeTime: string, stepMin: number): string[] {
  const open = timeStringToMinutes(openTime);
  const close = timeStringToMinutes(closeTime);
  const slots: string[] = [];
  for (let t = open; t + stepMin <= close; t += stepMin) {
    slots.push(minutesToTimeString(t));
  }
  return slots;
}

export function isFutureDate(date: Date): boolean {
  return startOfUtcDay(date).getTime() >= startOfUtcDay(new Date()).getTime();
}

export function hoursUntil(date: Date): number {
  return (date.getTime() - Date.now()) / (1000 * 60 * 60);
}
