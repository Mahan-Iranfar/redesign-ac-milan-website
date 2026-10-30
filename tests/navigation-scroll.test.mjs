import test from "node:test";
import assert from "node:assert/strict";
import {
  queueNavigation,
  takeNavigation,
  clearNavigation,
  scrollToDestination,
} from "../lib/navigation-scroll.js";
test("only matching completed navigation consumes scroll request; supports base path and hashes", () => {
  clearNavigation();
  assert.equal(takeNavigation("/squad/"), null);
  queueNavigation(new URL("https://example.com/repo/squad/#players"));
  assert.equal(takeNavigation("/repo/news/"), null);
  assert.deepEqual(takeNavigation("/repo/squad/"), {
    pathname: "/repo/squad/",
    hash: "#players",
  });
  assert.equal(takeNavigation("/repo/squad/"), null);
  queueNavigation(new URL("https://example.com/club/"));
  clearNavigation();
  assert.equal(takeNavigation("/club/"), null);
});
test("new page starts at zero without smooth animation or focus scrolling; hash targets preserved", () => {
  let scrolled, focused, anchor;
  globalThis.window = { scrollTo: (o) => (scrolled = o) };
  globalThis.document = {
    getElementById: (id) =>
      id === "main"
        ? { setAttribute() {}, focus: (o) => (focused = o) }
        : id === "quiz"
          ? { scrollIntoView: (o) => (anchor = o) }
          : null,
  };
  scrollToDestination("");
  assert.equal(scrolled.top, 0);
  assert.equal(scrolled.behavior, "instant");
  assert.deepEqual(focused, { preventScroll: true });
  scrollToDestination("#quiz");
  assert.equal(anchor.block, "start");
});
