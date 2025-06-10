import { NextResponse } from "next/server"

export const dynamic = "force-static"

export async function GET() {
  try {
    // Static time slot data for now
    const timeSlots = [
      { time: "8:00 AM", available: true, spotsLeft: 6 },
      { time: "10:00 AM", available: true, spotsLeft: 3 },
      { time: "12:00 PM", available: true, spotsLeft: 8 },
      { time: "2:00 PM", available: false, spotsLeft: 0 },
      { time: "4:00 PM", available: true, spotsLeft: 5 },
    ]

    return NextResponse.json({
      success: true,
      timeSlots,
    })
  } catch (error) {
    console.error("Time slots API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch time slots" }, { status: 500 })
  }
}
