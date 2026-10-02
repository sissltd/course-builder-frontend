import { Country } from "country-state-city";

export interface CountryOption {
  label: string;
  /** Two-letter ISO code — what every endpoint that takes a `country` expects. */
  value: string;
  searchValue: string;
}

/**
 * The country list every form in the app renders, built once.
 *
 * `Country.getAllCountries()` was previously re-derived inline at each call
 * site (register, signup-google, profile, KYC, the reviewer account tab and the
 * public contact form), so each copy could drift on the `searchValue` that
 * `FormSelect`'s searchable mode searches over. Import this instead of calling
 * `getAllCountries()` again.
 *
 * Built at module scope because the payload never changes within a session.
 */
export const COUNTRY_OPTIONS: CountryOption[] = Country.getAllCountries().map(
  (country) => ({
    label: country.name,
    value: country.isoCode,
    searchValue: `${country.name} ${country.isoCode}`,
  }),
);
