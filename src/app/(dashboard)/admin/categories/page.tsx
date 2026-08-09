import React from "react";
import { CategoriesView } from "@/modules/admin/categories/CategoriesView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return <CategoriesView />;
}
