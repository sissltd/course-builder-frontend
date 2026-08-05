import type { Metadata } from "next";

import { AnnouncementBar } from "@/modules/website/components/AnnouncementBar";
import { Footer } from "@/modules/website/components/Footer";
import { Navbar } from "@/modules/website/components/Navbar";
import { PageContainer } from "@/modules/website/components/PageContainer";

export const metadata: Metadata = {
  title: {
    default: "SoluDesk — Course Creator Studio",
    template: "%s | SoluDesk",
  },
  description:
    "SoluDesk's Course Creator Studio lets you build professional courses, ensures fair review, and automatically distributes to SoluDesks, Udemy, and Coursera while you get paid without managing any of it yourself.",
};

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer />
    </div>
  );
}
