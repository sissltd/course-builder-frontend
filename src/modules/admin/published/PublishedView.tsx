"use client";

import React, { useState } from "react";
import { Filter, Sort } from "iconsax-react";
import { BaseTable } from "@/components/shared/BaseTable";
import { ColumnDef } from "@tanstack/react-table";
import { PublishedDetailsDrawer } from "./components/PublishedDetailsDrawer";

interface PublishedCourse {
  id: string;
  title: string;
  creator: string;
  creatorId: string;
  courseId: string;
  category: string;
  difficulty: string;
  source: string;
  priceSoluDesks: string;
  priceCoursera: string;
  priceUdemy: string;
  approvedBy: string;
  dateApproved: string;
  dateCreated: string;
}

const data: PublishedCourse[] = [
  { id: "1", title: "Machine Learning and Design", creator: "Osaite Emmanuel", creatorId: "SLD-e43r-3d55-09dE-0", courseId: "Td4fJcvnJ88-04924945", category: "Software Engineering", difficulty: "Advanced", source: "AI Created", priceSoluDesks: "$250.98", priceCoursera: "$250.00", priceUdemy: "$250.00", approvedBy: "Osaite Emmanuel", dateApproved: "21 May 2026, 08:43PM", dateCreated: "17 May 2026, 08:45PM" },
  { id: "2", title: "Introduction to Python", creator: "Sarah Johnson", creatorId: "SLD-f54s-4d66-19fF-1", courseId: "PY-101-2233-aa44", category: "Data Science", difficulty: "Beginner", source: "Manual", priceSoluDesks: "$150.00", priceCoursera: "$145.00", priceUdemy: "$140.00", approvedBy: "James Wilson", dateApproved: "20 May 2026, 02:15PM", dateCreated: "15 May 2026, 10:30AM" },
  { id: "3", title: "Advanced Web Development", creator: "Michael Chen", creatorId: "SLD-g65t-5e77-29gG-2", courseId: "WEB-8821-bb55", category: "Software Engineering", difficulty: "Advanced", source: "AI Created", priceSoluDesks: "$300.00", priceCoursera: "$295.00", priceUdemy: "$290.00", approvedBy: "Osaite Emmanuel", dateApproved: "19 May 2026, 11:30AM", dateCreated: "14 May 2026, 09:15AM" },
  { id: "4", title: "UI/UX Design Fundamentals", creator: "Emily Davis", creatorId: "SLD-h76u-6f88-39hH-3", courseId: "UI-UX-7731-224b", category: "Design", difficulty: "Intermediate", source: "Manual", priceSoluDesks: "$200.00", priceCoursera: "$195.00", priceUdemy: "$190.00", approvedBy: "Anna Martinez", dateApproved: "18 May 2026, 09:00AM", dateCreated: "12 May 2026, 02:30PM" },
  { id: "5", title: "Data Science with Python", creator: "Osaite Emmanuel", creatorId: "SLD-e43r-3d55-09dE-0", courseId: "DS-PY-6620-335c", category: "Data Science", difficulty: "Intermediate", source: "AI Created", priceSoluDesks: "$275.00", priceCoursera: "$270.00", priceUdemy: "$265.00", approvedBy: "James Wilson", dateApproved: "17 May 2026, 04:45PM", dateCreated: "11 May 2026, 08:00AM" },
  { id: "6", title: "Cloud Architecture", creator: "David Brown", creatorId: "SLD-k09x-9i11-69kK-6", courseId: "CLD-5519-446d", category: "Software Engineering", difficulty: "Advanced", source: "Manual", priceSoluDesks: "$350.00", priceCoursera: "$345.00", priceUdemy: "$340.00", approvedBy: "Osaite Emmanuel", dateApproved: "16 May 2026, 03:10PM", dateCreated: "10 May 2026, 11:45AM" },
  { id: "7", title: "Network Security", creator: "Lisa Anderson", creatorId: "SLD-l10y-0j22-79lL-7", courseId: "SEC-4408-557e", category: "Security", difficulty: "Intermediate", source: "AI Created", priceSoluDesks: "$225.00", priceCoursera: "$220.00", priceUdemy: "$215.00", approvedBy: "Anna Martinez", dateApproved: "15 May 2026, 01:30PM", dateCreated: "09 May 2026, 04:20PM" },
  { id: "8", title: "Digital Marketing", creator: "Sarah Johnson", creatorId: "SLD-f54s-4d66-19fF-1", courseId: "MKT-3397-668f", category: "Business", difficulty: "Beginner", source: "Manual", priceSoluDesks: "$125.00", priceCoursera: "$120.00", priceUdemy: "$115.00", approvedBy: "James Wilson", dateApproved: "14 May 2026, 10:20AM", dateCreated: "08 May 2026, 07:30AM" },
];

const categoryOptions = [
  { label: "All", value: "all" },
  { label: "Software Engineering", value: "Software Engineering" },
  { label: "Data Science", value: "Data Science" },
  { label: "Design", value: "Design" },
  { label: "Security", value: "Security" },
  { label: "Business", value: "Business" },
];

const approverOptions = [
  { label: "All", value: "all" },
  { label: "Osaite Emmanuel", value: "Osaite Emmanuel" },
  { label: "James Wilson", value: "James Wilson" },
  { label: "Anna Martinez", value: "Anna Martinez" },
];

export const PublishedView = () => {
  const [selectedCourse, setSelectedCourse] = useState<PublishedCourse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns: ColumnDef<PublishedCourse>[] = [
    {
      accessorKey: "title",
      header: "Course Title",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.title}</span>
      ),
      size: 234,
    },
    {
      accessorKey: "creator",
      header: "Creator",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.creator}</span>
      ),
      size: 167,
    },
    {
      accessorKey: "courseId",
      header: "Course ID",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px] font-mono text-[12px]">{row.original.courseId}</span>
      ),
      size: 138,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.category}</span>
      ),
      size: 171,
    },
    {
      accessorKey: "priceSoluDesks",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-[14px] font-medium text-[#202020] tracking-[-0.28px] leading-[20px]">{row.original.priceSoluDesks}</span>
      ),
      size: 106,
    },
    {
      accessorKey: "approvedBy",
      header: "Approved by",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.approvedBy}</span>
      ),
      size: 172,
    },
    {
      accessorKey: "dateApproved",
      header: "Date Approved",
      cell: ({ row }) => (
        <span className="text-[14px] text-[#606060] tracking-[-0.28px] leading-[20px]">{row.original.dateApproved}</span>
      ),
      size: 175,
    },
  ];

  return (
    <>
      <PublishedDetailsDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        course={selectedCourse}
      />
      <div className="flex flex-col gap-[24px]">

        <BaseTable
          title="Published"
          columns={columns}
          data={data}
          searchPlaceholder="Search course title, ID etc"
          filters={[
            {
              label: "Category",
              icon: <Filter size={20} variant="Linear" color="#606060" />,
              options: categoryOptions,
              onValueChange: () => {},
            },
            {
              label: "Approver",
              icon: <Sort size={20} variant="Linear" color="#606060" />,
              options: approverOptions,
              onValueChange: () => {},
            },
          ]}
          showDateFilter
          dateFilterInline
          showHeader={false}
          showPagination
          onRowClick={(course) => {
            setSelectedCourse(course);
            setIsDrawerOpen(true);
          }}
        />
      </div>
    </>
  );
};
