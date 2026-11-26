const maxTime = 8_640_000_000_000_000n;
const isoDate = /^([+-]\d{6}|\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})$/i;

export function parseTimestamp(input, format) {
  const value = input.trim();

  if (format === "iso") {
    const match = value.match(isoDate);
    if (!match) return null;
    const [, yearText, monthText, dayText, hour, minute, second = "0"] = match;
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month < 1 || month > 12 || day < 1 || day > days[month - 1]
        || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return null;
    const time = Date.parse(value);
    return Number.isFinite(time) ? time : null;
  }

  const pattern = format === "seconds" ? /^([+-]?)(\d+)(?:\.(\d{1,3}))?$/ : /^([+-]?)(\d+)$/;
  const match = value.match(pattern);
  if (!match) return null;
  const [, sign, whole, fraction = ""] = match;
  const digits = whole.replace(/^0+(?=\d)/, "");
  if (digits.length > 16) return null;
  const magnitude = format === "seconds"
    ? BigInt(digits) * 1000n + BigInt(fraction.padEnd(3, "0"))
    : BigInt(digits);
  if (magnitude > maxTime) return null;
  return Number(sign === "-" ? -magnitude : magnitude);
}
