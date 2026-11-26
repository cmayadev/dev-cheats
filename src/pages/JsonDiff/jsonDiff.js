import { compareLosslessNumber, LosslessNumber, parse, stringify } from "lossless-json";

function kind(value) {
  if (value instanceof LosslessNumber) return "number";
  if (Array.isArray(value)) return "array";
  return value === null ? "null" : typeof value;
}

function pointerKey(key) {
  return key.replaceAll("~", "~0").replaceAll("/", "~1");
}

export function compareJson(before, after) {
  const changes = [];

  function compare(left, right, path) {
    if (left === right) return;
    const type = kind(left);
    if (type === kind(right)) {
      if (type === "number" && compareLosslessNumber(left, right) === 0) return;
      if (type === "object" || type === "array") {
        const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
        for (const key of keys) {
          const child = `${path}/${pointerKey(key)}`;
          if (!Object.hasOwn(left, key)) {
            changes.push({ type: "Added", path: child, after: stringify(right[key]) });
          } else if (!Object.hasOwn(right, key)) {
            changes.push({ type: "Removed", path: child, before: stringify(left[key]) });
          } else {
            compare(left[key], right[key], child);
          }
        }
        return;
      }
    }
    changes.push({ type: "Changed", path, before: stringify(left), after: stringify(right) });
  }

  compare(before, after, "");
  return changes;
}

export function parseDocument(input) {
  if (!input.trim()) throw new Error("Enter a JSON document.");
  return parse(input);
}
