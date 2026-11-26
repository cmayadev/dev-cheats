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
  const query = new URLSearchParams(parameters.map(({ name, value }) => [name, value])).toString();
  if (query === url.searchParams.toString()) return url.href;
  const result = new URL(url);
  result.search = query;
  return result.href;
}
