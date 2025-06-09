"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, X } from "lucide-react"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  trailId?: string
}

const trails = [
  {
    id: "beginner",
    name: "Beginner Trail",
    duration: "1 Hour",
    price: 45,
    difficulty: "Easy",
  },
  {
    id: "vista",
    name: "Mountain Vista",
    duration: "2 Hours",
    price: 75,
    difficulty: "Moderate",
  },
  {
    id: "advanced",
    name: "Advanced Ridge",
    duration: "3 Hours",
    price: 95,
    difficulty: "Challenging",
  },
]

export default function BookingModal({ isOpen, onClose, trailId }: BookingModalProps) {
  const [selectedTrail, setSelectedTrail] = useState(trailId || "beginner")
  const [selectedDate, setSelectedDate] = useState("")
  const [numRiders, setNumRiders] = useState(1)

  if (!isOpen) return null

  const trail = trails.find((t) => t.id === selectedTrail)
  const totalPrice = trail ? trail.price * numRiders : 0

  const handleQuickBook = () => {
    // Redirect to full booking page with pre-selected options
    const params = new URLSearchParams({
      trail: selectedTrail,
      date: selectedDate,
      riders: numRiders.toString(),
    })
    window.location.href = `/booking?${params.toString()}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-amber-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-amber-900">Quick Booking</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-amber-700 mb-2 font-medium">Select Trail</label>
            <select
              value={selectedTrail}
              onChange={(e) => setSelectedTrail(e.target.value)}
              className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {trails.map((trail) => (
                <option key={trail.id} value={trail.id}>
                  {trail.name} - ${trail.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-amber-700 mb-2 font-medium">Preferred Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="border-amber-200 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-amber-700 mb-2 font-medium">Number of Riders</label>
            <select
              value={numRiders}
              onChange={(e) => setNumRiders(Number(e.target.value))}
              className="w-full p-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Rider" : "Riders"}
                </option>
              ))}
            </select>
          </div>

          {trail && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-amber-900">{trail.name}</span>
                <Badge
                  className={
                    trail.difficulty === "Easy"
                      ? "bg-green-100 text-green-800"
                      : trail.difficulty === "Moderate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {trail.difficulty}
                </Badge>
              </div>
              <div className="flex items-center text-amber-700 text-sm mb-2">
                <Clock className="w-4 h-4 mr-1" />
                <span>{trail.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-700">Total:</span>
                <span className="text-xl font-bold text-amber-900">${totalPrice}</span>
              </div>
            </div>
          )}

          <Button onClick={handleQuickBook} disabled={!selectedDate} className="w-full bg-amber-700 hover:bg-amber-800">
            Continue to Full Booking
          </Button>

          <p className="text-xs text-amber-600 text-center">
            This will take you to our secure booking system to complete your reservation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
