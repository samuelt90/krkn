
import type { Metadata } from "next";
import KrknStore from "@/components/store/KrknStore";

export const metadata: Metadata = {
  title: "Tienda | KRKN",
  description: "Explora las prendas de KRKN.",
};

export default function StorePage() {
  return <KrknStore />;
}
