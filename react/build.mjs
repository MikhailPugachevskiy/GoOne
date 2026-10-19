/* Bundles both React parts into plain scripts, so the pages also work when opened from disk */
import { build } from "esbuild";

const shared = {
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2020",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "none"
};

/* Interactive app demo on product.html */
await build({ ...shared, entryPoints: ["src/main.tsx"], outfile: "../ts/product-demo.js" });

/* Break-even calculator on business.html */
await build({ ...shared, entryPoints: ["src/calculatorMain.tsx"], outfile: "../ts/business-calculator.js" });

console.log("Built ../ts/product-demo.js and ../ts/business-calculator.js");