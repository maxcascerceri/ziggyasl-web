"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PrimaryButton, inputClass } from "@/components/ops/fields";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/ops/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Could not sign in.");
      return;
    }
    router.replace(params.get("next") || "/team");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-3xl border border-divider bg-white p-7"
      >
        <p className="text-sm font-medium text-secondary">Ziggy team</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-secondary">
          Shared password for Bernie, Jared, and Max.
        </p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-secondary">
            Password
          </span>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </label>
        {error && <p className="mt-3 text-sm text-pastel-peach-icon">{error}</p>}
        <PrimaryButton
          type="submit"
          disabled={busy}
          className="mt-6 w-full"
        >
          {busy ? "Checking…" : "Continue"}
        </PrimaryButton>
      </form>
    </div>
  );
}

export default function TeamLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
