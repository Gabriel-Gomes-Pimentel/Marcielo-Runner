import { defineConfig } from "vite";

const pageBase = (() => {
  if (!process.env.CI_PAGES_URL) {
    return "./";
  }

  try {
    const path = new URL(process.env.CI_PAGES_URL).pathname;
    return path.endsWith("/") ? path : `${path}/`;
  } catch {
    return "./";
  }
})();

export default defineConfig({
  base: pageBase,
});
