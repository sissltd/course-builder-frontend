import { FillerPageHeader, FillerPlaceholderBlocks } from "@/modules/website/components/Filler";

const BLOCKS = [
  {
    heading: "The Course Builder",
    body: "A studio built around the way you teach: outline courses into modules and lessons, drag and drop to reorder, and get an AI assistant that drafts your course materials for you.",
  },
  {
    heading: "Fair, Transparent Review",
    body: "Every course is reviewed against published standards. You get specific, actionable feedback — and a clear decision you can understand.",
  },
  {
    heading: "Distribution & Payments",
    body: "Approved courses are automatically distributed to SoluDesks, Udemy, and Coursera. Payment lands in your wallet on approval, ready to withdraw by bank transfer or mobile money.",
  },
];

export function ProductView() {
  return (
    <main>
      <FillerPageHeader
        title="SoluDesk Course Creator Studio"
        subtitle="Build professional courses, get them reviewed fairly, and reach learners across the world's biggest platforms."
      />
      <FillerPlaceholderBlocks blocks={BLOCKS} />
    </main>
  );
}
