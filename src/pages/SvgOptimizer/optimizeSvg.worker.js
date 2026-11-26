import { optimize } from "svgo/browser";

self.onmessage = ({ data: source }) => {
  try {
    const { data } = optimize(source, {
      plugins: [{
        name: "preset-default",
        params: { overrides: { cleanupIds: false, removeDesc: false } },
      }],
    });
    self.postMessage({ data });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
