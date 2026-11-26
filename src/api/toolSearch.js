import tools from "./tools.json";

export const toolGroups = ["CSS & Design", "Data & Text", "Generators"];

const catalog = tools.filter((tool) => !tool.hidden);

export function searchTools(query) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return catalog.filter((tool) => {
    const searchable = [tool.title, tool.description, tool.group, tool.keywords].join(" ").toLowerCase();
    return terms.every((term) => searchable.includes(term));
  });
}
