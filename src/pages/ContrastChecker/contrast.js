import { hexToRgb } from "../../utils.js";

export function normalizeHex(value) {
  const hex = value.trim().replace(/^#/, "");
  const expanded = /^[\da-f]{3}$/i.test(hex)
    ? [...hex].map((digit) => digit.repeat(2)).join("")
    : hex;
  return /^[\da-f]{6}$/i.test(expanded) ? `#${expanded.toUpperCase()}` : null;
}

function linearChannel(value) {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }) {
  return 0.2126 * linearChannel(r) + 0.7152 * linearChannel(g) + 0.0722 * linearChannel(b);
}

export function contrastRatio(foreground, background) {
  const text = hexToRgb(normalizeHex(foreground));
  const surface = hexToRgb(normalizeHex(background));
  if (!text || !surface) return null;

  const first = luminance(text);
  const second = luminance(surface);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}
