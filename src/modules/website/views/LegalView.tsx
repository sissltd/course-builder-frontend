import { FillerPageHeader, FillerPlaceholderBlocks } from "@/modules/website/components/Filler";

const LEGAL_BLOCKS = [
  {
    heading: "Terms placeholder",
    body: "This page will contain the full terms of use for SoluDesk services. Content is coming soon.",
  },
  {
    heading: "Acceptable use",
    body: "Details on acceptable use of the platform will live here once finalised.",
  },
  {
    heading: "Contact",
    body: "Questions about these terms? Reach out to our support team.",
  },
];

export function LegalView() {
  return (
    <main>
      <FillerPageHeader
        title="Terms of Use"
        subtitle="The terms that govern your use of SoluDesk and the Course Creator Studio."
      />
      <FillerPlaceholderBlocks blocks={LEGAL_BLOCKS} />
    </main>
  );
}
