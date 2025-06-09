import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()

    // Remove signature and hash from data
    const { signature, hash, ...cleanData } = paymentData

    // Create parameter string
    const paramString = Object.keys(cleanData)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(cleanData[key] || "")}`)
      .join("&")

    // Add passphrase if configured
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString

    // Generate MD5 hash using Node.js crypto (server-side)
    const md5Hash = crypto.createHash("md5").update(stringToHash).digest("hex")

    return NextResponse.json({
      success: true,
      signature: md5Hash,
    })
  } catch (error) {
    console.error("Signature generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate signature" }, { status: 500 })
  }
}
