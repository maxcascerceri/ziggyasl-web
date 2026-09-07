"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MorePage() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/ops/login", { method: "DELETE" });
    router.push("/team/login");
  }

  return (
    <div>
      <h1 className="mb-5 text-2xl font-semibold tracking-tight">More</h1>
      <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-divider bg-white">
        <li>
          <Link href="/team/money" className="flex min-h-14 items-center px-4 font-medium">
            Money
          </Link>
        </li>
        <li>
          <Link href="/team/revenue" className="flex min-h-14 items-center px-4 font-medium">
            Revenue
          </Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex min-h-14 w-full items-center px-4 text-left font-medium text-secondary"
          >
            Log out
          </button>
        </li>
      </ul>
    </div>
  );
}
