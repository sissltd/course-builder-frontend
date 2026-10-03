import { getTimeZones } from "@vvo/tzdb";

export interface TimezoneOption {
  label: string;
  value: string;
  searchValue: string;
}

const formatOffset = (minutes: number) => {
  const sign = minutes >= 0 ? "+" : "-";
  const absolute = Math.abs(minutes);
  const hours = Math.floor(absolute / 60).toString().padStart(2, "0");
  const remainder = (absolute % 60).toString().padStart(2, "0");

  return `UTC${sign}${hours}:${remainder}`;
};

const optionByName = new Map<string, TimezoneOption>();

for (const timezone of getTimeZones({ includeUtc: true })) {
  const offset = formatOffset(timezone.currentTimeOffsetInMinutes);

  for (const name of timezone.group) {
    optionByName.set(name, {
      label: `(${offset}) ${name.replaceAll("_", " ")} — ${timezone.alternativeName}`,
      value: name,
      searchValue: [
        name,
        name.replaceAll("_", " "),
        timezone.alternativeName,
        timezone.abbreviation,
        timezone.countryName,
        timezone.continentName,
        timezone.mainCities.join(" "),
        offset,
      ].join(" "),
    });
  }
}

export const TIMEZONE_OPTIONS = Array.from(optionByName.values()).sort(
  (first, second) => first.label.localeCompare(second.label),
);

export const getTimezoneOptions = (currentTimezone?: string) => {
  if (
    !currentTimezone ||
    TIMEZONE_OPTIONS.some(({ value }) => value === currentTimezone)
  ) {
    return TIMEZONE_OPTIONS;
  }

  return [
    {
      label: currentTimezone,
      value: currentTimezone,
      searchValue: currentTimezone,
    },
    ...TIMEZONE_OPTIONS,
  ];
};
