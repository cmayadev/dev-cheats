function format(value) {
  return String(Number(value.toFixed(8)));
}

export function fluidType(minSize, maxSize, minWidth, maxWidth, rootSize = 16) {
  if (![minSize, maxSize, minWidth, maxWidth, rootSize].every(Number.isFinite)
      || minSize <= 0 || maxSize < minSize || minWidth <= 0
      || maxWidth <= minWidth || rootSize <= 0) {
    return null;
  }

  const slope = (maxSize - minSize) / (maxWidth - minWidth);
  const intercept = (minSize - slope * minWidth) / rootSize;
  const minRem = minSize / rootSize;
  const maxRem = maxSize / rootSize;
  if (![slope * 100, intercept, minRem, maxRem].every(Number.isFinite)) return null;

  const operator = intercept < 0 && Number(format(intercept)) !== 0 ? "-" : "+";
  return {
    css: `clamp(${format(minRem)}rem, ${format(slope * 100)}vw ${operator} ${format(Math.abs(intercept))}rem, ${format(maxRem)}rem)`,
    sizeAt(width) {
      return Math.min(maxSize, Math.max(minSize, minSize + slope * (width - minWidth)));
    },
  };
}
