import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Static trail data for now
    const trails = [
      {
        id: "beginner",
        name: "Beginner Trail",
        duration: "1 Hour",
        distance: "2 Miles",
        difficulty: "Easy",
        price: 45,
        description: "Perfect for first-time riders and families. Gentle terrain with beautiful meadow views.",
        maxRiders: 8,
      },
      {
        id: "vista",
        name: "Mountain Vista",
        duration: "2 Hours",
        distance: "4 Miles",
        difficulty: "Moderate",
        price: 75,
        description: "Our most popular trail featuring stunning mountain vistas and diverse wildlife.",
        maxRiders: 6,
      },
      {
        id: "advanced",
        name: "Advanced Ridge",
        duration: "3 Hours",
        distance: "6 Miles",
        difficulty: "Challenging",
        price: 95,
        description: "For experienced riders seeking adventure on challenging mountain terrain.",
        maxRiders: 4,
      },
    ]

    return NextResponse.json({
      success: true,
      trails,
    })
  } catch (error) {
    console.error("Trails API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch trails" }, { status: 500 })
  }
}
