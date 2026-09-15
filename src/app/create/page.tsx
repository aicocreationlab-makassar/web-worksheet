import { Suspense } from "react";
import type { Metadata } from "next";
import { Generator } from "@/components/generator/Generator";
export const metadata: Metadata = { title: "Buat prompt worksheet" };
export default function Page() {
  return (
    <Suspense
      fallback={
        <main id="main" className="container page-main">
          Menyiapkan ruang kreativitasmu…
        </main>
      }
    >
      <Generator />
    </Suspense>
  );
}
