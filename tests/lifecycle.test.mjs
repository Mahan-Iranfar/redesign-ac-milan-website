import test from "node:test";
import assert from "node:assert/strict";
import { createScope } from "../lib/lifecycle.js";
test("route cleanup removes old listeners, cancels frames and disconnects observers", () => {
  let callback,
    disconnected = 0,
    cancelled = 0;
  globalThis.requestAnimationFrame = (fn) => {
    callback = fn;
    return 7;
  };
  globalThis.cancelAnimationFrame = () => cancelled++;
  globalThis.IntersectionObserver = class {
    disconnect() {
      disconnected++;
    }
  };
  const scope = createScope(),
    button = new EventTarget();
  let clicks = 0,
    frames = 0;
  scope.on(button, "click", () => clicks++);
  button.dispatchEvent(new Event("click"));
  scope.frame(() => frames++);
  scope.observe(() => {});
  scope.dispose();
  button.dispatchEvent(new Event("click"));
  callback(1);
  assert.equal(clicks, 1);
  assert.equal(frames, 0);
  assert.equal(cancelled, 1);
  assert.equal(disconnected, 1);
  assert.equal(scope.signal.aborted, true);
  const next = createScope();
  next.on(button, "click", () => clicks++);
  button.dispatchEvent(new Event("click"));
  assert.equal(clicks, 2);
  next.dispose();
});
