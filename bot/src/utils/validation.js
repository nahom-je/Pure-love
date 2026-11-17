// Validate Ethiopian phone numbers
export function validatePhone(phone) {
  const normalized = phone.replace(/[\s\-\(\)]/g, "");
  // Accepts: 09XXXXXXXX, 07XXXXXXXX, +2519XXXXXXXX, +2517XXXXXXXX, 2519XXXXXXXX
  return /^(\+?251|0)(9|7)\d{8}$/.test(normalized);
}

export function validateName(name) {
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
}
