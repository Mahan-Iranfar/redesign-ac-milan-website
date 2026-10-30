import fs from "node:fs";
fs.writeFileSync("out/.nojekyll", "");
if (process.env.PAGES_CUSTOM_DOMAIN)
  fs.writeFileSync("out/CNAME", process.env.PAGES_CUSTOM_DOMAIN + "\n");
console.log("Static export ready in out/");
