import fs from "node:fs";
import { parse } from "parse5";
const voids = new Set(
  "area base br col embed hr img input link meta param source track wbr".split(
    " ",
  ),
);
const names = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  crossorigin: "crossOrigin",
  viewbox: "viewBox",
  strokeWidth: "strokeWidth",
  maxlength: "maxLength",
  readonly: "readOnly",
  autofocus: "autoFocus",
  datetime: "dateTime",
};
const bools = new Set(
  "hidden required disabled multiple checked selected autofocus readonly open".split(
    " ",
  ),
);
function find(n, tag) {
  if (n.tagName === tag) return n;
  for (const c of n.childNodes || []) {
    const v = find(c, tag);
    if (v) return v;
  }
}
function path(v) {
  if (v.startsWith("assets/") || v.startsWith("data/")) return v;
  if (/^[\w-]+\.html(?:#.*)?$/.test(v)) {
    const [f, hash] = v.split("#");
    return (
      (f === "index.html" ? "" : f.replace(".html", "") + "/") +
      (hash ? "#" + hash : "")
    );
  }
  return null;
}
function jsx(n, nav = false) {
  if (n.nodeName === "#text") return `{${JSON.stringify(n.value)}}`;
  if (!n.tagName || n.tagName === "script") return "";
  const internal =
    n.tagName === "a" &&
    (n.attrs || []).some(
      (a) => a.name === "href" && /^[\w-]+\.html(?:#.*)?$/.test(a.value),
    );
  const tag = internal ? "Link" : n.tagName;
  let attrs = "";
  for (const { name, value } of n.attrs || []) {
    if (name === "aria-current") continue;
    const key = names[name] || name;
    if (name === "style") {
      const style = Object.fromEntries(
        value
          .split(";")
          .filter((x) => x.includes(":"))
          .map((x) => {
            const at = x.indexOf(":");
            let k = x.slice(0, at).trim();
            if (!k.startsWith("--"))
              k = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            return [k, x.slice(at + 1).trim()];
          }),
      );
      attrs += ` style={${JSON.stringify(style)}}`;
      continue;
    }
    const p = ["href", "src", "data-gallery"].includes(name)
      ? path(value)
      : null;
    if (name === "src" && !value) continue;
    if (bools.has(name)) {
      attrs += ` ${key}={true}`;
      continue;
    }
    attrs += ` ${key}=${p !== null ? `{${internal && name === "href" ? JSON.stringify("/" + p) : `sitePath(${JSON.stringify(p)})`}}` : `{${JSON.stringify(value)}}`}`;
    if (nav && name === "href" && p !== null && p.endsWith("/"))
      attrs += ` aria-current={active===${JSON.stringify(p)}?'page':undefined}`;
  }
  return `<${tag}${attrs}${voids.has(n.tagName) ? " />" : `>${(n.childNodes || []).map((c) => jsx(c, nav)).join("")}</${tag}>`}`;
}
const files = fs
  .readdirSync(".content-cache")
  .filter((f) => f.endsWith(".html"));
for (const file of files) {
  const doc = parse(fs.readFileSync(".content-cache/" + file, "utf8")),
    body = find(doc, "body"),
    main = find(doc, "main");
  const slug = file.replace(".html", ""),
    title = find(doc, "title").childNodes[0].value.replace(" · ClubSphere", "");
  const folder =
    slug === "index" ? "app" : slug === "404" ? "app" : `app/${slug}`;
  fs.mkdirSync(folder, { recursive: true });
  const rel = slug === "index" || slug === "404" ? "../" : "../../";
  const active = slug.startsWith("player-")
    ? "squad/"
    : slug.startsWith("article-")
      ? "news/"
      : slug.startsWith("match-")
        ? "fixtures/"
        : slug + "/";
  const code = `// Generated from scripts/content.mjs and public/data. Do not edit directly.\nimport Link from '${rel}components/AppLink';\nimport SiteShell from '${rel}components/SiteShell';\nimport {sitePath} from '${rel}lib/paths';\nexport const metadata={title:${JSON.stringify(title)}};\nexport default function Page(){return <SiteShell active=${JSON.stringify(active)}>${jsx(main)}</SiteShell>;}\n`;
  fs.writeFileSync(
    `${folder}/${slug === "404" ? "not-found" : "page"}.jsx`,
    code,
  );
  if (slug === "index") {
    const elements = body.childNodes || [],
      at = elements.indexOf(main);
    fs.writeFileSync(
      "components/SiteShell.jsx",
      `import Link from './AppLink';\nimport {sitePath} from '../lib/paths';\nimport Enhancements from './Enhancements';\nexport default function SiteShell({children,active}){return <>${elements
        .slice(0, at)
        .map((n) => jsx(n, true))
        .join("")}{children}${elements
        .slice(at + 1)
        .map((n) => jsx(n))
        .join("")}<Enhancements /></>;}\n`,
    );
  }
}
console.log(`Generated ${files.length} App Router JSX views`);
