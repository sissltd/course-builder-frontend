import React from "react";
import { AdminUsersView } from "@/modules/admin/users/AdminUsersView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users Moderation | SoluDesks Admin",
  description: "Platform user roster and account moderation",
};

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
