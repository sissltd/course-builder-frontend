import { PolicyPage, type PolicySection } from "@/modules/website/components/PolicyPage";

export const COOKIE_SECTIONS: PolicySection[] = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies",
    type: "paragraph",
    body: "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, and understand how the platform is used so we can improve it.",
  },
  {
    id: "cookies-we-use",
    title: "Cookies We Use",
    type: "list",
    body: [
      "Essential cookies: required for core features like signing in, keeping your session secure, and completing payments",
      "Preference cookies: remember your language, region, and display choices",
      "Analytics cookies: help us understand how creators and learners use Course Creator Studio so we can improve the experience",
      "Marketing cookies: used (with consent) to measure the reach of our campaigns and show relevant content",
    ],
  },
  {
    id: "how-we-use-this-information",
    title: "How We Use This Information",
    type: "list",
    body: [
      "To keep your account and session secure and prevent fraud",
      "To remember your settings and preferences across visits",
      "To measure platform performance and improve course quality through aggregate analytics",
      "To personalize communications, where you have opted in",
    ],
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    type: "paragraph",
    body: "Some cookies are set by services we rely on, such as payment processors, distribution partners, and analytics providers. These providers may process limited data under their own privacy policies. We do not sell personal information to third parties.",
  },
  {
    id: "managing-cookies",
    title: "Managing Cookies",
    type: "list",
    body: [
      "Adjust your browser settings to block or delete cookies at any time",
      "Update your consent preferences from the cookie banner or your account settings",
      "Note that disabling essential cookies may prevent some features, such as signing in, from working correctly",
    ],
  },
  {
    id: "data-storage-and-security",
    title: "Data Storage and Security",
    type: "paragraph",
    body: "Information collected through cookies is stored securely and retained only as long as needed for the purposes described in this policy, or as required by law. We use encryption and access controls to protect it.",
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Policy",
    type: "paragraph",
    body: "If we change how we use cookies, we will update this policy and, where required, ask for fresh consent before setting new cookie types.",
  },
  {
    id: "contact-us",
    title: "Contact Us",
    type: "paragraph",
    body: "Questions about this cookie policy can be sent to privacy@SoluDeskss.com, or through the help centre.",
  },
];

export function CookiePolicyView() {
  return (
    <PolicyPage
      title="Cookie policy"
      lastUpdated="17th July, 2026"
      intro="This policy explains how SoluDeskss uses cookies and similar technologies when you use Course Creator Studio, and the choices you have."
      sections={COOKIE_SECTIONS}
    />
  );
}
