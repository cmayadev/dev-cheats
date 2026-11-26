export function transformJson(input, pretty) {
  JSON.parse(input);

  // Keep the original tokens so large integers and duplicate keys survive formatting.
  const tokens = input.match(/"(?:[^"\\]|\\[\s\S])*"|[{}\[\],:]|[^\s{}\[\],:"]+/g);
  if (!pretty) return tokens.join("");

  let depth = 0;
  const output = [];
  const newline = () => output.push("\n", "  ".repeat(depth));

  for (const [index, token] of tokens.entries()) {
    const previous = tokens[index - 1];
    const next = tokens[index + 1];
    if (token === "}" || token === "]") {
      depth--;
      if (previous !== "{" && previous !== "[") newline();
    }

    output.push(token);

    if (token === "{" || token === "[") {
      depth++;
      if (next !== "}" && next !== "]") newline();
    } else if (token === ",") {
      newline();
    } else if (token === ":") {
      output.push(" ");
    }
  }

  return output.join("");
}

export function jsonErrorLocation(input, message) {
  const position = message.match(/\bat position (\d+)(?:\s*\(line \d+ column \d+\))?\s*$/i);
  const coordinates = message.match(/\bat line (\d+) column (\d+)(?: of the JSON data)?\s*$/i);
  const lines = input.split(/\r\n|[\r\n]/);
  let offset;

  if (position) {
    offset = Number(position[1]);
  } else if (coordinates) {
    const line = Number(coordinates[1]);
    const column = Number(coordinates[2]);
    if (line < 1 || line > lines.length || column < 1 || column > lines[line - 1].length + 1) return null;
    const breaks = [...input.matchAll(/\r\n|[\r\n]/g)];
    const previousBreak = breaks[line - 2];
    offset = (previousBreak ? previousBreak.index + previousBreak[0].length : 0) + column - 1;
  } else if (/^unexpected end of (?:json input|data)\.?$/i.test(message)) {
    offset = input.length;
  }

  if (!Number.isInteger(offset) || offset < 0 || offset > input.length) return null;
  const preceding = input.slice(0, offset).split(/\r\n|[\r\n]/);
  return { offset, line: preceding.length, column: preceding.at(-1).length + 1 };
}
