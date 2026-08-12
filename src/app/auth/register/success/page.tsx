import type { Metadata } from "next";
import RegisterSuccessView from "@/modules/auth/views/RegisterSuccessView";

export const metadata: Metadata = {
  title: "Check your email | SoluDesk",
};

export default function RegisterSuccessPage() {
  return <RegisterSuccessView />;
}
