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
