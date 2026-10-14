/* Bundles the React demo into one plain script, so product.html also works when opened from disk */
import { build } from "esbuild";

await build({
    entryPoints: ["src/main.tsx"],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "none",
    outfile: "../ts/product-demo.js"
});

console.log("Built ../ts/product-demo.js");