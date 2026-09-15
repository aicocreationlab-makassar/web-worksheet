import type { Metadata } from "next";
import { Result } from "@/components/result/Result";
export const metadata: Metadata = {
  title: "Prompt worksheet-mu",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Result />;
}
