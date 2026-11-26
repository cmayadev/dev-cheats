export function inspectUrl(input) {
  const source = input.trim();
  if (!/^https?:\/\//i.test(source)) return null;
  try {
    return new URL(source);
  } catch {
    return null;
  }
}

export function updateQuery(url, parameters) {
  const result = new URL(url);
  result.search = new URLSearchParams(
    parameters.map(({ name, value }) => [name, value])
  ).toString();
  return result.href;
}
