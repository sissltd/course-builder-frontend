import type { Metadata } from "next";

import { ProductView } from "@/modules/website/views/ProductView";

export const metadata: Metadata = {
  title: "Product",
};

export default function ProductPage() {
  return <ProductView />;
}
