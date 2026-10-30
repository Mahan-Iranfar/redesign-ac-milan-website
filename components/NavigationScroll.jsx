"use client";
import { useLayoutEffect, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  takeNavigation,
  clearNavigation,
  scrollToDestination,
} from "../lib/navigation-scroll";
export default function NavigationScroll() {
  const pathname = usePathname();
  useEffect(() => {
    window.addEventListener("popstate", clearNavigation);
    return () => window.removeEventListener("popstate", clearNavigation);
  }, []);
  useLayoutEffect(() => {
    // Only clicked AppLinks request a reset. Direct loads and history restoration
    // remain under browser/Next control, including existing fragment links.
    const request = takeNavigation(window.location.pathname);
    if (request) scrollToDestination(request.hash);
  }, [pathname]);
  return null;
}
