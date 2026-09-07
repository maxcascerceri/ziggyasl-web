const COOKIE = "ziggy_ops";
const MAX_AGE = 60 * 60 * 24 * 30;

function sessionSecret(): string {
  return (
    process.env.OPS_SESSION_SECRET ||
    process.env.OPS_TEAM_PASSWORD ||
    "ziggy-ops-dev-secret"
  );
}

function teamPassword(): string {
  return process.env.OPS_TEAM_PASSWORD || "ZIGGYTEAM";
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return [...new Uint8Array(sig)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const payload = `v1.${Date.now()}`;
  const sig = await hmacHex(sessionSecret(), payload);
  return `${payload}.${sig}`;
}

export async function isValidSessionToken(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  if (!payload.startsWith("v1.")) return false;
  const expected = await hmacHex(sessionSecret(), payload);
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  }
  return diff === 0;
}

export function passwordsMatch(input: string): boolean {
  const expected = teamPassword();
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function sessionCookieHeader(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`;
}

export function clearSessionCookieHeader(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export { COOKIE as OPS_COOKIE };
