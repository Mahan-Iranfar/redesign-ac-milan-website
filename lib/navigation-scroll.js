let pending = null;
export function queueNavigation(url) {
  pending = { pathname: url.pathname, hash: url.hash };
}
export function takeNavigation(pathname) {
  if (
    !pending ||
    pending.pathname.replace(/\/$/, "") !== pathname.replace(/\/$/, "")
  )
    return null;
  const next = pending;
  pending = null;
  return next;
}
export function clearNavigation() {
  pending = null;
}
export function scrollToDestination(hash) {
  let id = "";
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    id = hash.slice(1);
  }
  const target = id ? document.getElementById(id) : null;
  if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
  else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  if (!hash) {
    const main = document.getElementById("main");
    if (main) {
      main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  }
}
