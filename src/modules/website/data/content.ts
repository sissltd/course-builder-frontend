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

export interface CreatorFeature {
  icon: string;
  title: string;
  description: string;
  background: string;
}

export const CREATOR_FEATURES: CreatorFeature[] = [
  {
    icon: "/images/products/creators/wallet-icon.svg",
    title: "Instant Payment",
    description: "Automatically get paid once your course is created and approved.",
    background:
      "linear-gradient(76.93deg, rgba(0, 99, 239, 0.06) 7.05%, rgba(250, 133, 0, 0.06) 98.16%)",
  },
  {
    icon: "/images/products/creators/cash-icon.svg",
    title: "Transparent Review",
    description: "Clear standards, real feedback, and a decision you can understand.",
    background: "linear-gradient(176.04deg, #C3DEF3 2.7%, #F5F3F4 71.9%)",
  },
];

export interface CreatorTopic {
  label: string;
  left: number;
  top: number;
  dot: string;
  gap: number;
}

export const CREATOR_TOPICS: CreatorTopic[] = [
  { label: "Software development", left: 0, top: 0, dot: "/images/products/creators/dot-1.svg", gap: 8 },
  { label: "Counseling", left: 73, top: 46, dot: "/images/products/creators/dot-2.svg", gap: 8 },
  { label: "Database management", left: 0, top: 92, dot: "/images/products/creators/dot-3.svg", gap: 8 },
  { label: "Cloud computing", left: 6, top: 138, dot: "/images/products/creators/dot-4.svg", gap: 8 },
  { label: "Cybersecurity", left: 16, top: 184, dot: "/images/products/creators/dot-5.svg", gap: 8 },
  { label: "Machine learning", left: 0, top: 230, dot: "/images/products/creators/dot-6.svg", gap: 8 },
  { label: "Urban planning", left: 195, top: 23, dot: "/images/products/creators/dot-6.svg", gap: 10 },
  { label: "Environmental science", left: 195, top: 69, dot: "/images/products/creators/dot-3.svg", gap: 10 },
  { label: "Culinary arts", left: 195, top: 115, dot: "/images/products/creators/dot-2.svg", gap: 10 },
  { label: "Psychology", left: 160, top: 161, dot: "/images/products/creators/dot-1.svg", gap: 10 },
  { label: "Mechanical engineering", left: 160, top: 207, dot: "/images/products/creators/dot-4.svg", gap: 10 },
  { label: "Event management", left: 152, top: 253, dot: "/images/products/creators/dot-1.svg", gap: 10 },
];

export type CreatorTransactionStatus = "Pending" | "Successful" | "Failed";

export interface CreatorTransaction {
  title: string;
  date: string;
  amount: string;
  status: CreatorTransactionStatus;
}

export const CREATOR_TRANSACTIONS: CreatorTransaction[] = [
  { title: "Fundamentals of programming", date: "23 Mar 2026, 10:34 PM", amount: "+$500.00", status: "Pending" },
  { title: "Fundamentals of programming", date: "23 Mar 2026, 10:34 PM", amount: "-$234.00", status: "Successful" },
  { title: "Fundamentals of programming", date: "23 Mar 2026, 10:34 PM", amount: "+$1,200.00", status: "Failed" },
];

export interface WalletStat {
  label: string;
  value: string;
}

export const WALLET_STATS: WalletStat[] = [
  { label: "Total amount earned", value: "$456,000.03" },
  { label: "Wallet Balance", value: "$456,000" },
  { label: "Pending payments", value: "$34,000" },
];

export interface CreatorCollaborator {
  initials: string;
  name: string;
  email: string;
  dateAdded: string;
  role: string;
  color: string;
}

export const CREATOR_COLLABORATORS: CreatorCollaborator[] = [
  { initials: "D", name: "Dog Whales", email: "dogwhales@support.com", dateAdded: "25 March 2025, 07:40 PM", role: "Author", color: "#0A60E1" },
  { initials: "A", name: "Adams Nelson", email: "adams_nelson2@hotmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#D54800" },
  { initials: "A", name: "Jeremy Nathan", email: "jnathan63@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
  { initials: "A", name: "Benjamin Ben", email: "benajmin2sq@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
  { initials: "A", name: "Benjamin Ben", email: "benajmin2sq@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
  { initials: "A", name: "Osaite Emmanuel", email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
  { initials: "A", name: "Osaite Emmanuel", email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
  { initials: "A", name: "Osaite Emmanuel", email: "emmanuelosaite@gmail.com", dateAdded: "25 March 2025, 07:40 PM", role: "Collaborator", color: "#0A60E1" },
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
      { label: "Cookies Policy", href: "/cookies" },
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
