export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(
  /\/$/,
  "",
);
export function sitePath(path) {
  return `${basePath}/${path.replace(/^\//, "")}`;
}
