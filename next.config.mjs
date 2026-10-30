const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath))
  throw new Error("NEXT_PUBLIC_BASE_PATH must be empty or /repository-name");
export default {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  poweredByHeader: false,
};
