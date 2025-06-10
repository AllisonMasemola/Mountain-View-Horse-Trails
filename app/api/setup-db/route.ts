import { NextResponse } from "next/server"
import { db, trails, timeSlots } from "@/lib/db"
import { sql } from "drizzle-orm"

export const dynamic = "force-static"

export async function GET() {
  try {
    // Create tables if they don't exist
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS bookings (
        id TEXT PRIMARY KEY,
        trail_id TEXT NOT NULL,
        trail_name TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        riders INTEGER NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_id TEXT,
        payment_method TEXT,
        special_requests TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        paid_at TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        booking_id TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        emergency_contact TEXT NOT NULL,
        emergency_phone TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS riders (
        id SERIAL PRIMARY KEY,
        booking_id TEXT NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        weight INTEGER NOT NULL,
        experience TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS trails (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        duration TEXT NOT NULL,
        distance TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT NOT NULL,
        max_riders INTEGER NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS time_slots (
        id SERIAL PRIMARY KEY,
        time TEXT NOT NULL,
        max_capacity INTEGER NOT NULL,
        active BOOLEAN DEFAULT TRUE
      );
      
      CREATE TABLE IF NOT EXISTS booking_logs (
        id SERIAL PRIMARY KEY,
        booking_id TEXT NOT NULL,
        action TEXT NOT NULL,
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Check if trails table is empty
    const existingTrails = await db.select().from(trails).limit(1)

    // If empty, seed with initial data
    if (existingTrails.length === 0) {
      interface TrailData {
        id: string;
        name: string;
        duration: string;
        distance: string;
        difficulty: string;
        price: string;
        description: string;
        maxRiders: number;
        image: string;
        highlights: string[];
        requirements: string[];
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
      }

      const trailValues: TrailData[] = [
        {
          id: "beginner",
          name: "Beginner Trail",
          duration: "1 Hour",
          distance: "2 Miles",
          difficulty: "Easy",
          price: '45.00',
          description: "Perfect for first-time riders and families. Gentle terrain with beautiful meadow views.",
          maxRiders: 8,
          image: "/images/trails/beginner.jpg",
          highlights: ["Easy terrain", "Family friendly", "Scenic views"],
          requirements: ["No experience needed", "Minimum age: 8 years"],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "vista",
          name: "Mountain Vista",
          duration: "2 Hours",
          distance: "4 Miles",
          difficulty: "Moderate",
          price: '75.00',
          description: "Our most popular trail featuring stunning mountain vistas and diverse wildlife.",
          maxRiders: 6,
          image: "/images/trails/vista.jpg",
          highlights: ["Mountain views", "Wildlife spotting", "Varied terrain"],
          requirements: ["Basic riding experience", "Minimum age: 12 years"],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "advanced",
          name: "Advanced Ridge",
          duration: "3 Hours",
          distance: "6 Miles",
          difficulty: "Challenging",
          price: '95.00',
          description: "For experienced riders seeking adventure on challenging mountain terrain.",
          maxRiders: 4,
          image: "/images/trails/advanced.jpg",
          highlights: ["Challenging terrain", "Advanced trails", "Panoramic views"],
          requirements: ["Experienced riders only", "Minimum age: 16 years"],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      for (const trail of trailValues) {
        await db.insert(trails).values(trail);
      }
    }

    // Check if time slots table is empty
    const existingTimeSlots = await db.select().from(timeSlots).limit(1)

    // If empty, seed with initial data
    if (existingTimeSlots.length === 0) {
      interface TimeSlotData {
        time: string;
        maxCapacity: number;
        trailId: string;
        active: boolean;
      }

      const timeSlotValues: TimeSlotData[] = [
        { time: "8:00 AM", maxCapacity: 8, trailId: "beginner", active: true },
        { time: "10:00 AM", maxCapacity: 8, trailId: "beginner", active: true },
        { time: "12:00 PM", maxCapacity: 8, trailId: "vista", active: true },
        { time: "2:00 PM", maxCapacity: 8, trailId: "vista", active: true },
        { time: "4:00 PM", maxCapacity: 8, trailId: "advanced", active: true },
      ];
      
      for (const slot of timeSlotValues) {
        await db.insert(timeSlots).values({
          time: slot.time,
          maxCapacity: slot.maxCapacity,
          trailId: slot.trailId,
          active: slot.active
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database setup completed successfully",
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database setup failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
