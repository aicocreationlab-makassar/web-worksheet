"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

// Use cached documents when offline; RSC navigation needs a server response.
export function useAppRouter() {
  const router = useRouter();
  return useMemo(
    () => ({
      push: (href: string) => {
        if (!navigator.onLine) window.location.assign(href);
        else router.push(href);
      },
      replace: (href: string, options?: { scroll?: boolean }) => {
        if (!navigator.onLine) window.location.replace(href);
        else router.replace(href, options);
      },
    }),
    [router],
  );
}
