"use client";
import Link from "next/link";
import {
  queueNavigation,
  clearNavigation,
  scrollToDestination,
} from "../lib/navigation-scroll";
export default function AppLink({ href, children, ...props }) {
  return (
    <Link
      {...props}
      href={href}
      scroll={false}
      onNavigate={() => {
        const url = new URL(
          typeof href === "string" ? href : href.pathname,
          window.location.origin,
        );
        // Next adds basePath to the actual anchor. Use it for matching the committed URL.
        const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
        if (
          base &&
          !url.pathname.startsWith(base + "/") &&
          url.pathname !== base
        )
          url.pathname = base + url.pathname;
        if (url.pathname === window.location.pathname) {
          clearNavigation();
          scrollToDestination(url.hash);
        } else queueNavigation(url);
      }}
    >
      {children}
    </Link>
  );
}
