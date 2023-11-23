import { toast } from "react-toastify";

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const rgbToHsl = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "dark",
    });
  });
};

const parseHSL = (hsl) => {
  const [h, s, l] = hsl.match(/\d+/g).map(Number);
  return { h, s, l };
};

export const generateTints = (hsl, count) => {
  hsl = parseHSL(hsl);
  const tints = [];
  for (let i = 1; i <= count; i++) {
    const lightness = Math.min(100, hsl.l + i * 10);
    tints.push(`hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`);
  }
  return tints;
};

export const generateShades = (hsl, count) => {
  hsl = parseHSL(hsl);
  const shades = [];
  for (let i = 1; i <= count; i++) {
    const lightness = Math.max(0, hsl.l - i * 10);
    shades.push(`hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`);
  }
  return shades;
};

export const generateTones = (hsl, count) => {
  hsl = parseHSL(hsl);
  const tones = [];
  for (let i = 1; i <= count; i++) {
    const saturation = Math.max(0, hsl.s - i * 10);
    tones.push(`hsl(${hsl.h}, ${saturation}%, ${hsl.l}%)`);
  }
  return tones;
};

export const getComplementaryColor = (hsl) => {
  const { h, s, l } = parseHSL(hsl);

  const complementaryHue = (h + 180) % 360;

  return `hsl(${complementaryHue}, ${s}%, ${l}%)`;
};
