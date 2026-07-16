import React from "react";
import { CollaboratorsTable } from "./components/CollaboratorsTable";

export const CollaboratorsView = () => {
  return (
    <div className="flex flex-col gap-[24px]">
      <CollaboratorsTable />
    </div>
  );
};
