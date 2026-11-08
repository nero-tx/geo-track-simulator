export function getFormattedTime(timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      ...(timeZone && { timeZone }),
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  } catch {
    return "--:--:--";
  }
}

export function getUtcTime(): string {
  return new Date().toISOString().slice(11, 19) + "Z";
}
