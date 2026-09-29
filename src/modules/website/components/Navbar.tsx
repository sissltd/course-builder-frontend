"use client";

import { CloseSquare, HambergerMenu } from "iconsax-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/shared/Button";
import { AuthRoute } from "@/lib/routes";
import { NAV_LINKS } from "@/modules/website/data/content";
import { PageContainer } from "@/modules/website/components/PageContainer";
import {
  getDashboardRoute,
  getWorkspaceForRole,
} from "@/modules/auth/utils/workspace";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const isAuthenticated = status === "authenticated";
  const ctaHref = isAuthenticated
    ? getDashboardRoute(
        session?.user?.workspace ?? getWorkspaceForRole(session?.user?.role),
      )
    : AuthRoute.LOGIN;
  const ctaLabel = isAuthenticated ? "Dashboard" : "Log in";
  const ctaLoading = status === "loading";

  return (
    <header className="sticky top-0 z-50 bg-[#FDFDFF]">
      <PageContainer>
        <nav className="flex h-[80px] w-full items-center justify-between">
        <div className="flex items-center gap-[18px]">
          <Link href="/" aria-label="SoluDesks home" onClick={closeMenu}>
            <img
              src="/assets/auth/logo.png"
              alt="SoluDesks"
              className=" w-[180px] object-contain"
            />
          </Link>
          <ul className="hidden items-center gap-[6px] lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-[40px] items-center rounded-full px-3 py-2 text-sm leading-5 text-sd-grey-11 transition-colors hover:bg-sd-grey-3/70",
                    pathname === link.href && "bg-[#F5F9FF] text-sd-blue hover:bg-[#F5F9FF]"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {ctaLoading ? (
            <div
              aria-hidden="true"
              data-testid="navbar-cta-skeleton-desktop"
              className="h-[36px] min-w-[120px] animate-pulse rounded-[8px] border border-sd-blue/40 bg-sd-blue/5"
            />
          ) : (
            <Link href={ctaHref}>
              <Button
                variant="app-outline"
                size="app"
                className="h-[36px] px-6 text-[14px]"
              >
                {ctaLabel}
              </Button>
            </Link>
          )}
          <Link href={AuthRoute.REGISTER}>
            <Button variant="app-primary" size="app" className="h-[36px] px-6 text-[14px]">
              Contact sales
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-sd-grey-3/70 lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <CloseSquare variant="Linear" color="#202020" size={24} />
          ) : (
            <HambergerMenu variant="Linear" color="#202020" size={24} />
          )}
        </button>
        </nav>
      </PageContainer>

      {menuOpen && (
        <PageContainer>
          <div className="border-t border-sd-grey-3 bg-[#FDFDFF] pb-6 pt-2 lg:hidden">
            <ul className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex h-[44px] items-center rounded-full px-4 text-[15px] text-sd-grey-11 transition-colors hover:bg-sd-grey-3/70",
                      pathname === link.href && "bg-[#F5F9FF] text-sd-blue"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3">
              {ctaLoading ? (
                <div
                  aria-hidden="true"
                  data-testid="navbar-cta-skeleton-mobile"
                  className="h-[44px] w-full animate-pulse rounded-[8px] border border-sd-blue/40 bg-sd-blue/5"
                />
              ) : (
                <Link href={ctaHref} onClick={closeMenu}>
                  <Button variant="app-outline" size="app" className="w-full text-[14px]">
                    {ctaLabel}
                  </Button>
                </Link>
              )}
              <Link href={AuthRoute.REGISTER} onClick={closeMenu}>
                <Button variant="app-primary" size="app" className="w-full text-[14px]">
                  Contact sales
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      )}
    </header>
  );
}
