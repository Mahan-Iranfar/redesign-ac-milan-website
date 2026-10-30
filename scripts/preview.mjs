import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out"),
  base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};
http
  .createServer((req, res) => {
    let url = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (base && url !== base && !url.startsWith(base + "/")) {
      res.writeHead(404);
      return res.end("Outside configured base path");
    }
    url = url.slice(base.length);
    let file = path.resolve(root, "." + url);
    if (!file.startsWith(root + path.sep) && file !== root) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory())
      file = path.join(file, "index.html");
    let status = 200;
    if (!fs.existsSync(file)) {
      file = path.join(root, "404.html");
      status = 404;
    }
    res.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(4174, () => console.log(`Preview: http://localhost:4174${base}/`));
