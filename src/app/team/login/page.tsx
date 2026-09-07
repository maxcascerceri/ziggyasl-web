"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PrimaryButton, inputClass } from "@/components/ops/fields";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/team";
  const err = params.get("error");
  const [show, setShow] = useState(false);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-5">
      <form
        method="post"
        action="/api/ops/login"
        className="w-full max-w-sm rounded-3xl border border-divider bg-white p-7"
        autoComplete="on"
      >
        <p className="text-sm font-medium text-secondary">Ziggy team</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-secondary">
          Shared password for Bernie, Jared, and Max. Chrome can save it.
        </p>

        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-secondary">
            Account
          </span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            defaultValue="Ziggy team"
            className={inputClass}
          />
        </label>

        <input type="hidden" name="next" value={next} />

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-secondary">
            Password
          </span>
          <span className="relative block">
            <input
              type={show ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              autoFocus
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-secondary"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
        </label>
        {err === "1" && (
          <p className="mt-3 text-sm text-pastel-peach-icon">Wrong password.</p>
        )}
        {err === "rate" && (
          <p className="mt-3 text-sm text-pastel-peach-icon">
            Too many tries. Wait a minute.
          </p>
        )}
        <PrimaryButton type="submit" className="mt-6 w-full">
          Continue
        </PrimaryButton>
      </form>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5.5 20 19.5M9.5 9.7A3 3 0 0 0 14.3 14M7 7.4C4.7 9 3 12 3 12s3.5 7 9 7c1.7 0 3.2-.5 4.5-1.2M10.8 6.2C11.2 6.1 11.6 6 12 6c6 0 9 7 9 7s-.6 1.2-1.7 2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TeamLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
