"use client"

import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BookingCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Booking Cancelled</h1>
            <p className="text-lg text-amber-700 mb-6">Your booking was cancelled and no payment was processed.</p>

            <div className="bg-amber-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-amber-900 mb-3">What happened?</h3>
              <p className="text-amber-700 text-sm">
                You cancelled the payment process or closed the PayFast payment window. No charges were made to your
                account.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/booking">
                <Button className="w-full bg-amber-700 hover:bg-amber-800">Try Booking Again</Button>
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
