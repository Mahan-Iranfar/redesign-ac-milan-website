// A route owns its listeners, animation frames, observers and pending requests.
// Disposing also works during React Strict Mode's setup → cleanup → setup cycle.
export function createScope() {
  const controller = new AbortController();
  const cleanups = [];
  const frames = new Set();
  const signal = controller.signal;
  const on = (target, event, handler, options = {}) => {
    if (target && !signal.aborted)
      target.addEventListener(event, handler, {
        ...(typeof options === "boolean" ? { capture: options } : options),
        signal,
      });
  };
  const frame = (callback) => {
    if (signal.aborted) return;
    const id = requestAnimationFrame((t) => {
      frames.delete(id);
      if (!signal.aborted) callback(t);
    });
    frames.add(id);
    return id;
  };
  const interval = (callback, delay) => {
    const id = setInterval(callback, delay);
    cleanups.push(() => clearInterval(id));
    return id;
  };
  const observe = (callback, options) => {
    const observer = new IntersectionObserver((entries) => {
      if (!signal.aborted) callback(entries);
    }, options);
    cleanups.push(() => observer.disconnect());
    return observer;
  };
  return {
    signal,
    on,
    frame,
    interval,
    observe,
    dispose() {
      controller.abort();
      frames.forEach(cancelAnimationFrame);
      cleanups.forEach((fn) => fn());
      frames.clear();
      cleanups.length = 0;
    },
  };
}
