"use client";

import React from "react";
import { BaseTable } from "@/components/shared/BaseTable";
import { collaboratorColumns, Collaborator } from "../columns/collaborators";
import { Sort } from "iconsax-react";

const collaborators: Collaborator[] = [
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Author",       avatarColor: "#0063EF" },
  { name: "Adams Nelson",     email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#F05A25" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
  { name: "Osaite Emmanuel",  email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", avatarColor: "#0063EF" },
];

export const CollaboratorsTable = () => {
  return (
    <BaseTable
      title="Collaborators"
      columns={collaboratorColumns}
      data={collaborators}
      searchPlaceholder="Search collaborator"
      filters={[
        {
          label: "Role",
          icon: <Sort size={20} variant="Linear" color="#606060" />,
          options: [
            { label: "Author",       value: "Author" },
            { label: "Collaborator", value: "Collaborator" },
          ],
          onValueChange: (val) => console.log("Role filter:", val),
        },
      ]}
      showDateFilter
      showHeader={false}
      showPagination
    />
  );
};
