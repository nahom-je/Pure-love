// Generate PL-XXXX reference codes from request ID
export function generateRefCode(requestId) {
  // Add 1000 to make codes start around PL-1001
  const num = requestId + 1000;
  return `PL-${num}`;
}
