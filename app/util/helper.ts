import crypto from "crypto"

 export function generateSignature(data: Record<string, string | number>, passphrase?: string) {
  // Exclude signature itself
  const filtered = Object.fromEntries(
    Object.entries(data).filter(([key]) => key !== "signature")
  )

  // Sort keys
  const sortedKeys = Object.keys(filtered).sort()

  // Build key=value pairs
  let signatureString = sortedKeys
    .map((key) => `${key}=${encodeURIComponent(String(filtered[key] ?? ""))}`)
    .join("&")

  // Add passphrase if provided
  if (passphrase) {
    signatureString += `&passphrase=${encodeURIComponent(passphrase)}`
  }

  return crypto.createHash("md5").update(signatureString).digest("hex")
  // const input = document.createElement("input");
  // input.type = "hidden";
  // input.name = "signature";
  // input.value = signature; // Or however the signature is constructed
  // return input;
}
