// Utility for gender-based admin routing

/**
 * Returns the Telegram admin ID responsible for a given gender.
 * @param {string} gender - "Male", "Female", "ወንድ", "ሴት", etc.
 * @returns {string|null} - Admin Telegram ID or null if unconfigured
 */
export function getAdminIdForGender(gender) {
  if (!gender) return null;
  const g = String(gender).trim().toLowerCase();
  if (g === "male" || g === "ወንድ") {
    return process.env.MALE_ADMIN_ID?.trim() || null;
  }
  if (g === "female" || g === "ሴት") {
    return process.env.FEMALE_ADMIN_ID?.trim() || null;
  }
  return null;
}

/**
 * Returns the gender role handled by an admin Telegram ID.
 * @param {string|number} adminId
 * @returns {"male"|"female"|null}
 */
export function getAdminGenderRole(adminId) {
  if (!adminId) return null;
  const idStr = String(adminId).trim();
  const maleId = process.env.MALE_ADMIN_ID?.trim();
  const femaleId = process.env.FEMALE_ADMIN_ID?.trim();

  if (maleId && idStr === maleId) return "male";
  if (femaleId && idStr === femaleId) return "female";
  return null;
}

/**
 * Checks if a given context or ID belongs to any configured admin.
 * @param {object|string|number} ctxOrId
 * @returns {boolean}
 */
export function isAdmin(ctxOrId) {
  const id = typeof ctxOrId === "object" ? ctxOrId?.from?.id : ctxOrId;
  return getAdminGenderRole(id) !== null;
}
