import { FillerPageHeader, FillerPlaceholderBlocks } from "@/modules/website/components/Filler";

const BLOCKS = [
  {
    heading: "Our mission",
    body: "To make course creation fair, transparent, and profitable for creators — so the world gets access to more of what experts actually know.",
  },
  {
    heading: "Our values",
    body: "Fairness in review, transparency in compensation, and quality in every course that ships to learners.",
  },
  {
    heading: "Contact us",
    body: "For partnerships, press, and enterprise inquiries, reach out to our team and we'll get back to you shortly.",
  },
];

export function CompanyView() {
  return (
    <main>
      <FillerPageHeader
        title="Company"
        subtitle="We're building the operating system for creators who teach — fair review, clear payouts, and global distribution."
      />
      <FillerPlaceholderBlocks blocks={BLOCKS} />
    </main>
  );
}
