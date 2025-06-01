import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // build both CommonJS and ES Modules
  dts: true, // generate types declaration file
  outDir: "dist",
  clean: true,
  sourcemap: true,
  splitting: false, // disable code splitting for library build
  minify: false, // no minification for easier debugging
});
