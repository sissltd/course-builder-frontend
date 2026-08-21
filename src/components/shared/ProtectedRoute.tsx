"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthRoute } from "@/lib/routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(AuthRoute.LOGIN);
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
