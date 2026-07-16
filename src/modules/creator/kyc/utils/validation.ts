import { z } from "zod";

export const kycSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      if (isNaN(dob.getTime())) return false;
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      return age >= 18;
    }, "You must be at least 18 years old to verify your identity"),
  address: z.string().min(1, "Address is required"),
  agreed: z
    .boolean()
    .refine((val) => val === true, "You must agree to the Terms & Conditions to proceed"),
  countryOfIssue: z.string().min(1, "Country of issue is required"),
  selectedId: z.string().min(1, "Please select an ID type"),
  idNumber: z.string().min(1, "ID number is required"),
}).superRefine((data, ctx) => {
  if (data.selectedId === "National ID (NIN)") {
    if (!/^\d{11}$/.test(data.idNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "National ID (NIN) must be exactly 11 digits",
        path: ["idNumber"],
      });
    }
  }
});

export type KYCFormData = z.infer<typeof kycSchema>;
