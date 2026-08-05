import { FillerPageHeader, FillerPlaceholderBlocks } from "@/modules/website/components/Filler";

const BLOCKS = [
  {
    heading: "Our story",
    body: "SoluDesk started with a simple observation: experts have valuable knowledge, but building and selling a course is hard. We built the Course Creator Studio to remove the friction — for creators and for learners.",
  },
  {
    heading: "The team",
    body: "A small team of builders, educators, and reviewers who care about the craft of teaching online.",
  },
];

export function AboutView() {
  return (
    <main>
      <FillerPageHeader
        title="About us"
        subtitle="We exist to help experts turn what they know into courses the world can take."
      />
      <FillerPlaceholderBlocks blocks={BLOCKS} />
    </main>
  );
}
