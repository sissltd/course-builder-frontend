import { PolicyPage, type PolicySection } from "@/modules/website/components/PolicyPage";

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    type: "list",
    body: [
      "Account and identity information: name, email, country, language, bio, photo, and — for creators — government ID and liveness verification, tax identification, and bank account details",
      "Course content: everything you upload or write, including lesson text, video, images, documents, and quiz content",
      "Payment and wallet information: transaction history, withdrawal method, and balances",
      "Usage and device information: session data, device fingerprint, IP address, and general location, used to keep accounts secure",
      "Support interactions: messages and attachments submitted through support tickets or the help centre",
    ],
  },
  {
    id: "how-we-use-this-information",
    title: "How we use this information",
    type: "list",
    body: [
      "To verify your identity and eligibility to create or take courses",
      "To operate the course builder, review process, wallet, and distribution to partner platforms",
      "To detect fraud, policy violations, and misuse, including duplicate or fraudulent accounts",
      "To improve course quality and platform performance, including through aggregate analytics",
      "To communicate with you about your account, courses, payments, and policy updates",
    ],
  },
  {
    id: "how-information-is-shared",
    title: "How information is shared",
    type: "paragraph",
    body: "We share course content and limited creator information with distribution partners (such as Udemy and Coursera) as needed to publish and sell your course there. We share payment details with our payment processors to complete withdrawals. We do not sell personal information, and we only share identity or verification data with law enforcement when legally required — for example, in response to a valid DMCA takedown dispute.",
  },
  {
    id: "data-retention",
    title: "Data retention",
    type: "paragraph",
    body: "We retain account, course, and financial records for as long as your account is active and for a further period afterward to meet our legal, tax, and dispute-resolution obligations. Support tickets and audit logs are retained to maintain a record of platform decisions.",
  },
  {
    id: "your-rights-and-choices",
    title: "Your rights and choices",
    type: "list",
    body: [
      "Access, correct, or request deletion of your personal information, subject to records we're required to keep",
      "Withdraw consent for optional features, such as the Collaboration Marketplace",
      "Manage notification preferences from your account settings",
      "Appeal decisions that affect your account, content, or payments through the support and appeals process",
    ],
  },
  {
    id: "security",
    title: "Security",
    type: "paragraph",
    body: "We use industry-standard safeguards to protect your information, including encryption in transit and at rest, and access controls that limit who at SoluDesks can view sensitive data.",
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to this policy",
    type: "paragraph",
    body: "If we make material changes to this policy, we'll notify active users and require acknowledgment before you can continue submitting or publishing courses.",
  },
  {
    id: "contact-us",
    title: "Contact us",
    type: "paragraph",
    body: "Questions about this policy can be sent to privacy@soludesks.com, or through the help centre.",
  },
];

export function PrivacyPolicyView() {
  return (
    <PolicyPage
      title="Privacy policy"
      lastUpdated="17th July, 2026"
      intro="This policy explains what information SoluDesks collects from creators and learners who use Course Creator Studio, how we use it, and the choices you have."
      sections={PRIVACY_SECTIONS}
    />
  );
}
