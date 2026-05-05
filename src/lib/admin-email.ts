/**
 * Emails that always receive the "admin" role (plus optional ADMIN_EMAILS env).
 * ADMIN_EMAILS: comma-separated list, e.g. "a@x.com,b@y.com"
 */
const PRIMARY_ADMIN_EMAIL = "carsbybran@gmail.com";

export function isAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const fromEnv =
    process.env.ADMIN_EMAILS?.split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) ?? [];
  const set = new Set<string>([PRIMARY_ADMIN_EMAIL.toLowerCase(), ...fromEnv]);
  return set.has(normalized);
}
