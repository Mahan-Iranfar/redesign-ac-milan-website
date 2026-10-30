import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// Execute the actual effect and its cleanup: an accidental bare identifier
// (such as the deployed `F`) is valid syntax but throws only on navigation.
const source = fs
  .readFileSync(
    new URL("../components/Enhancements.jsx", import.meta.url),
    "utf8",
  )
  .replace(/^import\s[\s\S]*?;\s*$/gm, "")
  .replace("export default function Enhancements", "function Enhancements");

test("page departure cleans up without throwing and the next page initializes", () => {
  let cleanup;
  let pathname = "/";
  const calls = [];
  const context = {
    usePathname: () => pathname,
    useEffect: (effect, deps) => {
      assert.deepEqual([...deps], [pathname]);
      cleanup = effect();
    },
    createScope: () => ({ dispose: () => calls.push("dispose") }),
    initUI: () => calls.push("ui"),
    initFootball: () => calls.push("football"),
    initFans: () => calls.push("fans"),
    document: {
      body: { classList: { remove: (value) => calls.push(value) } },
      documentElement: { classList: { remove: (value) => calls.push(value) } },
    },
  };
  vm.runInNewContext(source + "\nEnhancements();", context);
  assert.doesNotThrow(() => cleanup());
  pathname = "/squad/";
  vm.runInNewContext("Enhancements();", context);
  assert.doesNotThrow(() => cleanup());
  assert.deepEqual(
    calls,
    Array(2)
      .fill(["ui", "football", "fans", "dispose", "menu-open", "js-motion"])
      .flat(),
  );
});
