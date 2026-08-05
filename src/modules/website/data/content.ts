import { Global, Money, MoneyRecive, PenTool2, Wallet, type Icon } from "iconsax-react";

export type WebsiteIcon = React.ComponentType<React.ComponentProps<typeof Icon>>;

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Product", href: "/product" },
  { label: "Creators", href: "/creators" },
  { label: "Company", href: "/company" },
  { label: "About", href: "/about" },
];

export interface StatItem {
  value: string;
  label: string;
}

export const STATS: StatItem[] = [
  { value: "12.5k+", label: "Creators Worldwide" },
  { value: "12k+", label: "Courses Produced" },
  { value: "1.2B+", label: "Earned Globally" },
];

export interface Benefit {
  icon: WebsiteIcon;
  color: string;
  title: string;
  description: string;
}

export const BENEFITS: Benefit[] = [
  {
    icon: PenTool2,
    color: "#D54800",
    title: "Carefully Designed Tools",
    description: "A course builder made for teaching, not fighting software.",
  },
  {
    icon: Money,
    color: "#00B000",
    title: "Transparent Review",
    description: "Clear standards, real feedback, and a decision you can understand.",
  },
  {
    icon: Wallet,
    color: "#D54800",
    title: "Instant Payment",
    description: "Automatically get paid once your course is created and approved.",
  },
  {
    icon: Global,
    color: "#0A60E1",
    title: "Global Reach",
    description: "Get your course produced and distributed across learning platforms.",
  },
];

export interface Feature {
  heading: string;
  description: string;
  align: "left" | "right";
}

export const FEATURES: Feature[] = [
  {
    heading: "A course builder that thinks the way you teach.",
    description:
      "Structure your course into modules and lessons, reorder everything by drag and drop, and watch your outline take shape in a navigation tree that always shows what's done, what's in progress, and what still needs work",
    align: "left",
  },
  {
    heading: "Build Course with Our AI Intelligence.",
    description:
      "Structure your course into modules and lessons, reorder everything by drag and drop, and watch your outline take shape in a navigation tree that always shows what's done, what's in progress, and what still needs work",
    align: "right",
  },
  {
    heading: "Know your price before you write a single word.",
    description:
      "Once your course is approved, payment is credited to your creator wallet automatically, and you can withdraw by bank transfer or mobile money whenever you're ready",
    align: "left",
  },
];

export interface Step {
  number: string;
  icon: WebsiteIcon;
  title: string;
  description: string;
}

export const STEPS: Step[] = [
  {
    number: "01",
    icon: PenTool2,
    title: "Create your account",
    description: "Tell us about yourself, and complete a short identity and bank verification.",
  },
  {
    number: "02",
    icon: PenTool2,
    title: "Choose your category",
    description:
      "Browse categories with published compensation rates and pick the one that fits what you know.",
  },
  {
    number: "03",
    icon: MoneyRecive,
    title: "Complete the Creator Course",
    description:
      "A short, guided training on what makes a course succeed on xyz, before you start building.",
  },
  {
    number: "04",
    icon: Global,
    title: "Build Your Course",
    description:
      "Structure your modules, write your lessons, and build your quizzes in the Course Builder",
  },
  {
    number: "05",
    icon: PenTool2,
    title: "Submit for review",
    description:
      "Once your checklist is green, submit. A reviewer will watch, read, and respond with specific feedback",
  },
  {
    number: "06",
    icon: MoneyRecive,
    title: "Get Approved and Paid",
    description:
      "On approval, payment lands in your wallet automatically, and your course goes li",
  },
  {
    number: "07",
    icon: MoneyRecive,
    title: "Reach learners everywhere",
    description:
      "Your course is published across platforms, and your dashboard starts tracking how it performs.",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "Who can become a creator on SoluDesks?",
    answer:
      "Anyone with knowledge worth sharing. Create an account, complete your identity and bank verification, and you're ready to start building.",
  },
  {
    question: "Why do I need to verify my identity and bank details?",
    answer:
      "It protects your income and your reputation. Verified creators are the reason learners — and the platforms we distribute to — can trust what's on SoluDesks.",
  },
  {
    question: "When do I actually get paid?",
    answer:
      "Once your course is approved, payment is credited to your creator wallet automatically, and you can withdraw by bank transfer or mobile money whenever you're ready.",
  },
  {
    question: "Can I build a course with someone else?",
    answer:
      "Yes. Collaborate with other creators on your course and share the credit — and the payouts.",
  },
  {
    question: "Will my course reach learners outside English speakers?",
    answer:
      "Yes. Approved courses are distributed across SoluDesks, Udemy, and Coursera so learners around the world can find them.",
  },
];

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Menu",
    links: [
      { label: "Course Builder", href: "/product" },
      { label: "Creators", href: "/creators" },
      { label: "Creating Account", href: "/auth/register" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Cookies Policy", href: "/privacy" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Helpdesk", href: "/company" },
      { label: "Marketing /Sales", href: "/company" },
    ],
  },
];
