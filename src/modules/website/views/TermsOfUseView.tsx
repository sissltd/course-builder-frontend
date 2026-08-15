import { PolicyPage, type PolicySection } from "@/modules/website/components/PolicyPage";

export const TERMS_SECTIONS: PolicySection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    type: "paragraph",
    body: "By creating an account or using Course Creator Studio, you agree to these Terms of Use. If you do not agree, you may not use the platform. We may update these terms from time to time and will notify active users of material changes.",
  },
  {
    id: "creator-eligibility",
    title: "Creator Eligibility",
    type: "list",
    body: [
      "You must be at least 18 years old and able to enter a binding agreement",
      "You must complete identity and liveness verification, and provide valid tax and bank details",
      "You must not create duplicate or fraudulent accounts",
      "You are responsible for keeping your account credentials secure",
    ],
  },
  {
    id: "course-content-and-conduct",
    title: "Course Content and Conduct",
    type: "list",
    body: [
      "You own the content you create and grant SoluDesks a license to distribute it through partner platforms",
      "Content must be original or you must hold the necessary rights to use it",
      "You must not submit content that is unlawful, infringing, or misleading",
      "We may remove content that violates these terms or our review standards",
    ],
  },
  {
    id: "review-and-publishing",
    title: "Review and Publishing",
    type: "paragraph",
    body: "Every course is reviewed against published standards before it goes live. We may reject, request revision of, or remove a course that does not meet those standards. Decisions can be appealed through the support and appeals process.",
  },
  {
    id: "payments-and-withdrawals",
    title: "Payments and Withdrawals",
    type: "list",
    body: [
      "Compensation rates are published per category before you build",
      "Payment is credited to your creator wallet automatically on approval",
      "Withdrawals are processed by bank transfer or mobile money through our payment processors",
      "We may withhold payments where fraud or policy violations are suspected",
    ],
  },
  {
    id: "account-termination",
    title: "Account Termination",
    type: "paragraph",
    body: "You can close your account at any time. We may suspend or terminate accounts that breach these terms, harm other users, or put the platform at risk. On termination, published courses may be removed from distribution.",
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    type: "paragraph",
    body: "SoluDesks provides the platform as-is. To the fullest extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the platform, including lost earnings from courses that are rejected or removed.",
  },
  {
    id: "contact-us",
    title: "Contact Us",
    type: "paragraph",
    body: "Questions about these terms can be sent to privacy@SoluDeskss.com, or through the help centre.",
  },
];

export function TermsOfUseView() {
  return (
    <PolicyPage
      title="Terms of Use"
      lastUpdated="17th July, 2026"
      intro="These terms govern your use of SoluDesks and the Course Creator Studio, including creating and publishing courses, receiving payments, and using partner platform distribution."
      sections={TERMS_SECTIONS}
    />
  );
}
