import type { Metadata } from "next";
import { TemplateBrowser } from "@/components/landing/TemplateBrowser";
export const metadata: Metadata = { title: "Template worksheet" };
export default function Page() {
  return (
    <main id="main" className="container page-main">
      <div className="center-heading">
        <span className="section-kicker">PERPUSTAKAAN IDE KECIL</span>
        <h1>
          Inspirasi yang siap kamu kreasikan <span>✧</span>
        </h1>
        <p>
          Mulai dari template favorit, lalu sesuaikan untuk petualangan belajar
          si kecil.
        </p>
      </div>
      <TemplateBrowser />
    </main>
  );
}
