"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createScope } from "../lib/lifecycle";
import { initUI } from "../public/js/ui";
import { initFootball } from "../public/js/football";
import { initFans } from "../public/js/fans";
export default function Enhancements() {
  const pathname = usePathname();
  useEffect(() => {
    const scope = createScope();
    initUI(scope);
    initFootball(scope);
    void initFans(scope);
    return () => {F
      scope.dispose();
      document.body.classList.remove("menu-open");
      document.documentElement.classList.remove("js-motion");
    };
  }, [pathname]);
  return null;
}
