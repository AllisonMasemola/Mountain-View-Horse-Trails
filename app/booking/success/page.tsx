"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BookingDetails {
  id: string
  trailName: string
  date: string
  time: string
  riders: number
  totalPrice: number
  status: string
  paymentId?: string
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const [bookingStatus, setBookingStatus] = useState<"loading" | "success" | "error">("loading")
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)

  useEffect(() => {
    async function fetchBookingDetails() {
      try {
        // Get payment reference from PayFast
        const paymentId = searchParams.get("pf_payment_id")
        const paymentStatus = searchParams.get("payment_status")
        const bookingId = searchParams.get("custom_str2") || localStorage.getItem("lastBookingId")

        if (!bookingId) {
          setBookingStatus("error")
          return
        }

        // If payment was successful
        if (paymentStatus === "COMPLETE") {
          // Create mock booking details
          setBookingDetails({
            id: bookingId,
            trailName: "Mountain Vista",
            date: new Date().toISOString().split("T")[0],
            time: "10:00 AM",
            riders: 2,
            totalPrice: 150,
            status: "confirmed",
            paymentId: paymentId || "PF_12345",
          })
          setBookingStatus("success")
        } else {
          // Try to fetch from API as fallback
          try {
            const response = await fetch(`/api/bookings?id=${bookingId}`)
            if (response.ok) {
              const data = await response.json()
              if (data.success && data.booking) {
                setBookingDetails(data.booking)
                setBookingStatus("success")
              } else {
                setBookingStatus("error")
              }
            } else {
              setBookingStatus("error")
            }
          } catch (apiError) {
            console.error("API error:", apiError)
            setBookingStatus("error")
          }
        }
      } catch (error) {
        console.error("Error fetching booking details:", error)
        setBookingStatus("error")
      }
    }

    fetchBookingDetails()
  }, [searchParams])

  if (bookingStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-700 mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-amber-900 mb-4">Processing Your Booking...</h1>
              <p className="text-amber-700">Please wait while we confirm your payment and reservation.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (bookingStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-red-900 mb-4">Payment Verification Failed</h1>
              <p className="text-lg text-red-700 mb-6">
                We couldn't verify your payment status. If you've completed payment, please contact us with your
                reference number.
              </p>
              <div className="space-y-3">
                <Link href="/booking">
                  <Button className="w-full bg-amber-700 hover:bg-amber-800">Try Again</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Format date for display
  const formattedDate = bookingDetails?.date
    ? new Date(bookingDetails.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : ""

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-amber-700 mb-6">
              Thank you for choosing Mountain View Horse Trails. Your adventure is booked!
            </p>

            <div className="bg-amber-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-amber-900 mb-4">Confirmation Details</h3>
              <div className="text-left space-y-2">
                <p>
                  <strong>Confirmation Number:</strong> {bookingDetails?.id}
                </p>
                <p>
                  <strong>Trail:</strong> {bookingDetails?.trailName}
                </p>
                <p>
                  <strong>Date:</strong> {formattedDate}
                </p>
                <p>
                  <strong>Time:</strong> {bookingDetails?.time}
                </p>
                <p>
                  <strong>Riders:</strong> {bookingDetails?.riders}
                </p>
                <p>
                  <strong>Total Paid:</strong> R
                  {(Number.parseFloat(bookingDetails?.totalPrice?.toString() || "0") * 18.5).toFixed(2)}
                </p>
                <p>
                  <strong>Payment ID:</strong> {bookingDetails?.paymentId || "N/A"}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-blue-600 inline mr-2" />
              <p className="text-blue-800 text-sm">
                A confirmation email has been sent with detailed instructions and what to bring. We'll also contact you
                24 hours before your ride with final details.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <Button className="w-full bg-amber-700 hover:bg-amber-800">Return to Home</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => window.print()}>
                Print Confirmation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
