import { diffArrays, diffChars } from "diff";

function lines(text) {
  return text ? text.split(/\r\n|[\r\n]/) : [];
}

export function compareText(original, updated) {
  if (original.length + updated.length > 500_000) {
    throw new Error("Compare up to 500,000 characters at a time.");
  }
  const parts = diffArrays(lines(original), lines(updated), { timeout: 150 });
  if (!parts) throw new Error("These texts differ too much to compare in one pass. Try shorter excerpts.");

  const rows = [];
  let originalLine = 1;
  let updatedLine = 1;
  let removed = [];
  let added = [];

  function flush() {
    for (let index = 0; index < Math.max(removed.length, added.length); index++) {
      const before = removed[index];
      const after = added[index];
      rows.push({
        before, after,
        kind: before === undefined ? "Added" : after === undefined ? "Removed" : "Changed",
        originalLine: before === undefined ? null : originalLine++,
        updatedLine: after === undefined ? null : updatedLine++,
      });
    }
    removed = [];
    added = [];
  }

  for (const part of parts) {
    if (part.removed) {
      removed = part.value;
    } else if (part.added) {
      added = part.value;
    } else {
      flush();
      originalLine += part.value.length;
      updatedLine += part.value.length;
    }
  }
  flush();
  return rows;
}

export function highlightLine(before, after) {
  if (before === undefined || after === undefined || before.length + after.length > 2000) return null;
  return diffChars(before, after, { maxEditLength: 160 }) ?? null;
}
