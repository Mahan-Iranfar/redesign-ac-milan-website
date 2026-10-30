import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { parse } from "parse5";
const base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
let pages = 0,
  links = 0;
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
for (const file of walk("out").filter((f) => f.endsWith(".html"))) {
  pages++;
  const doc = parse(fs.readFileSync(file, "utf8"));
  function visit(n) {
    for (const a of n.attrs || []) {
      if (
        !["src", "href", "data-gallery"].includes(a.name) ||
        !a.value ||
        /^(https?:|mailto:|tel:|data:|#)/.test(a.value)
      )
        continue;
      let url = a.value.split(/[?#]/)[0];
      if (!url) continue;
      assert(
        url.startsWith(base + "/"),
        `${file}: missing base path in ${url}`,
      );
      url = decodeURI(url.slice(base.length));
      const target = path.join("out", url);
      assert(fs.existsSync(target), `${file}: missing ${target}`);
      if (fs.statSync(target).isDirectory())
        assert(
          fs.existsSync(path.join(target, "index.html")),
          `${target}: missing index`,
        );
      links++;
    }
    for (const c of n.childNodes || []) visit(c);
  }
  visit(doc);
}
assert(pages >= 60);
assert(fs.existsSync("out/404.html"));
assert(fs.existsSync("out/.nojekyll"));
console.log(
  `PASS: ${pages} exported pages; ${links} valid local references; basePath=${base || "/"}`,
);
