/**
 * Normalises a phone number to E.164.
 * Ethiopia: 09xxxxxxxx / 07xxxxxxxx / 9xxxxxxxx / 2519… / +2519… → +2519xxxxxxxx
 * Diaspora: any +country number with 7–15 digits.
 */
export function normalizePhone(raw: string): string | null {
  let s = raw.replace(/[\s\-().]/g, "");
  if (s.startsWith("00")) s = "+" + s.slice(2);
  if (/^0[79]\d{8}$/.test(s)) return "+251" + s.slice(1);
  if (/^[79]\d{8}$/.test(s)) return "+251" + s;
  if (/^251[79]\d{8}$/.test(s)) return "+" + s;
  if (/^\+251[79]\d{8}$/.test(s)) return s;
  if (/^\+(?!251)[1-9]\d{6,14}$/.test(s)) return s;
  return null;
}
