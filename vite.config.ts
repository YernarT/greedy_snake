import { defineConfig } from "vite";

import path from "path";
import autoprefixer from "autoprefixer";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(path.resolve(), "./src"),
    },
  },

  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: "last 2 versions",
        }),
      ],
    },
  },
});
