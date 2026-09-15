import type { Metadata } from "next";
import { History } from "@/components/result/History";
export const metadata: Metadata = {
  title: "Riwayat prompt",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <History />;
}
