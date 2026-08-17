import type { Metadata } from "next";
import { ContactUsView } from "@/modules/website/views/ContactUsView";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Reach out to the SoluDesks team — partnerships, sponsorships, or just to say hello. We would be so happy to hear from you.",
};

export default function ContactPage() {
  return <ContactUsView />;
}
