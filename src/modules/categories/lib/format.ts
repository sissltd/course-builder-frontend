
export const formatNaira = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) {
    // Better to show the raw value than a confident `₦NaN`.
    return String(value);
  }

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats a `date-time` for the table. Invalid or missing values render as an
 * em dash rather than "Invalid Date".
 */
export const formatCategoryDate = (value: string | null | undefined): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};
