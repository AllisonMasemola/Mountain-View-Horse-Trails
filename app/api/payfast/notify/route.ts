import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { db, bookingLogs } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const data: Record<string, string> = {}

    // Convert FormData to object
    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    // Log the incoming notification
    console.log("PayFast notification received:", data)

    // Verify the payment notification from PayFast
    const isValid = await verifyPayFastSignature(data, request)

    if (!isValid) {
      console.error("Invalid PayFast signature")
      await logPaymentEvent(data.custom_str2 || "unknown", "signature_invalid", data)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Extract booking information
    const bookingData = JSON.parse(data.custom_str1 || "{}")
    const bookingId = data.custom_str2
    const paymentStatus = data.payment_status
    const paymentId = data.pf_payment_id

    // Log the payment notification
    await logPaymentEvent(bookingId, "payment_notification", {
      status: paymentStatus,
      paymentId,
      amount: data.amount_gross,
    })

    // Update booking status based on payment
    if (paymentStatus === "COMPLETE") {
      // Payment successful - log instead of database update
      console.log(`Payment successful for booking ${bookingId}`)
      console.log("Booking confirmed:", {
        bookingId,
        paymentId,
        amount: data.amount_gross,
        status: "confirmed",
      })

      // For now, just log email sending instead of actually sending
      console.log("Would send confirmation email to:", bookingData.customerInfo?.email)
    } else {
      // Payment failed or cancelled
      console.log(`Payment failed for booking ${bookingId}: ${paymentStatus}`)
      console.log("Booking failed:", {
        bookingId,
        status: paymentStatus,
        reason: data.reason || "Unknown reason",
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("PayFast notification error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

async function verifyPayFastSignature(data: Record<string, string>, request: NextRequest): Promise<boolean> {
  try {
    // Remove signature from data for verification
    const { signature, ...verifyData } = data

    // Create parameter string
    const paramString = Object.keys(verifyData)
      .sort()
      .map((key) => `${key}=${encodeURIComponent(verifyData[key] || "")}`)
      .join("&")

    // Add passphrase if configured
    const passphrase = process.env.PAYFAST_PASSPHRASE
    const stringToHash = passphrase ? `${paramString}&passphrase=${passphrase}` : paramString

    // Generate MD5 hash
    const calculatedSignature = crypto.createHash("md5").update(stringToHash).digest("hex")

    // Verify signature matches
    const signatureMatch = calculatedSignature === signature

    // Additional security: verify the request comes from PayFast
    const validHosts = ["www.payfast.co.za", "sandbox.payfast.co.za", "w1w.payfast.co.za", "w2w.payfast.co.za"]

    // In production, you should verify the IP address
    // const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    // const isValidIP = await verifyPayFastIP(clientIP)

    return signatureMatch // && isValidIP
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

async function logPaymentEvent(bookingId: string, action: string, details: any) {
  try {
    await db.insert(bookingLogs).values({
      bookingId,
      action,
      details,
    })
  } catch (error) {
    console.error("Failed to log payment event:", error)
  }
}
