import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:4180";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL, trace: "retain-on-failure" },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4180 --strictPort",
    url: baseURL,
  },
});
