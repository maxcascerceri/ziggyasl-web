"use client";

import { usePathname } from "next/navigation";
import { OpsChrome } from "@/components/ops/OpsChrome";

export function TeamFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/team/login") return <>{children}</>;
  return <OpsChrome>{children}</OpsChrome>;
}
