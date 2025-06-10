"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, DollarSign, CheckCircle, AlertCircle, ArrowLeft, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { generateSignature } from "../util/helper"

interface Trail {
  id: string
  name: string
  duration: string
  distance: string
  difficulty: "Easy" | "Moderate" | "Challenging"
  price: number
  description: string
  maxRiders: number
}

interface TimeSlot {
  time: string
  available: boolean
  spotsLeft: number
}

interface BookingData {
  trail: string
  date: string
  time: string
  riders: number
  customerInfo: {
    name: string
    email: string
    phone: string
    emergencyContact: string
    emergencyPhone: string
  }
  riderDetails: Array<{
    name: string
    age: number
    weight: number
    experience: string
  }>
  specialRequests: string
  totalPrice: number
}

export default function BookingPage() {
  const [trails, setTrails] = useState<Trail[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [numRiders, setNumRiders] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    trail: "",
    date: "",
    time: "",
    riders: 1,
    customerInfo: {
      name: "",
      email: "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
    },
    riderDetails: [{ name: "", age: 0, weight: 0, experience: "" }],
    specialRequests: "",
    totalPrice: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [confirmationNumber, setConfirmationNumber] = useState("")
  const [error, setError] = useState<string | null>(null)

  // Fetch trails and time slots from the database
  useEffect(() => {
    // Use static data instead of API calls for now
    setTrails([
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
    ])

    setTimeSlots([ // pull the data from the database
      { time: "8:00 AM", available: true, spotsLeft: 6 },
      { time: "10:00 AM", available: true, spotsLeft: 3 },
      { time: "12:00 PM", available: true, spotsLeft: 8 },
      { time: "2:00 PM", available: false, spotsLeft: 0 },
      { time: "4:00 PM", available: true, spotsLeft: 5 },
    ])

    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (selectedTrail && numRiders) {
      const groupDiscount = numRiders >= 6 ? 0.1 : numRiders >= 4 ? 0.05 : 0
      const subtotal = selectedTrail.price * numRiders
      const discount = subtotal * groupDiscount
      const total = subtotal - discount

      setBookingData((prev) => ({
        ...prev,
        totalPrice: total,
      }))
    }
  }, [selectedTrail, numRiders])

  const handleTrailSelect = (trail: Trail) => {
    setSelectedTrail(trail)
    setBookingData((prev) => ({
      ...prev,
      trail: trail.id,
    }))
    setStep(2)
  }

  const handleDateTimeSelect = () => {
    if (!selectedDate || !selectedTime) return

    setBookingData((prev) => ({
      ...prev,
      date: selectedDate,
      time: selectedTime,
      riders: numRiders,
    }))
    setStep(3)
  }

  const handleCustomerInfo = (field: string, value: string) => {
    setBookingData((prev) => ({
      ...prev,
      customerInfo: {
        ...prev.customerInfo,
        [field]: value,
      },
    }))
  }

  const handleRiderDetail = (index: number, field: string, value: string | number) => {
    const updatedRiders = [...bookingData.riderDetails]
    updatedRiders[index] = { ...updatedRiders[index], [field]: value }
    setBookingData((prev) => ({
      ...prev,
      riderDetails: updatedRiders,
    }))
  }

  const addRider = () => {
    if (bookingData.riderDetails.length < numRiders) {
      setBookingData((prev) => ({
        ...prev,
        riderDetails: [...prev.riderDetails, { name: "", age: 0, weight: 0, experience: "" }],
      }))
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Submit booking data to your backend first
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          trail: selectedTrail?.id,
          status: "pending",
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking")
      }

      const booking = await bookingResponse.json()

      // Save booking ID to localStorage for retrieval after payment 
      localStorage.setItem("lastBookingId", booking.id)

      // Create PayFast payment data with all required fields
      const paymentData: Record<string, string> = {
        // Required fields
        merchant_id: '10000100',
        merchant_key: '46f0cd694581a',
        return_url: `${window.location.origin}/booking/success`,
        cancel_url: `${window.location.origin}/booking/cancel`,
        notify_url: `${window.location.origin}/api/payfast/notify`,
        
        // Customer information
        name_first: (bookingData.customerInfo.name.split(" ")[0] || '').substring(0, 100),
        name_last: (bookingData.customerInfo.name.split(" ").slice(1).join(" ") || '').substring(0, 100),
        email_address: (bookingData.customerInfo.email || '').substring(0, 100),
        cell_number: (bookingData.customerInfo.phone || '').substring(0, 20),
        
        // Payment details
        amount: parseFloat(bookingData.totalPrice.toFixed(2)).toFixed(2),
        item_name: `${selectedTrail?.name} - ${numRiders} rider(s)`.substring(0, 100),
        item_description: `Trail ride on ${new Date(selectedDate).toLocaleDateString()} at ${selectedTime}`.substring(0, 255),
        
        // Custom data
        custom_str1: `booking_ref:${booking.id}`,
        custom_str2: booking.id,
        
        // Payment method (optional)
        payment_method: 'cc',
        
        // Additional recommended fields
        m_payment_id: booking.id,
        email_confirmation: '1',
        confirmation_address: 'allison@mountainviewhorsetrails.co.za',
        
        // Set to 1 for testing in sandbox
        testmode: process.env.NODE_ENV === 'production' ? '0' : '1'
      };
      
      // Remove any empty values as they can cause signature issues
      Object.keys(paymentData).forEach(key => {
        if (paymentData[key] === undefined || paymentData[key] === '') {
          delete paymentData[key];
        }
      });

      // Log payment data for debugging
      console.log('Payment data being sent for signature:', JSON.stringify(paymentData, null, 2));
      
      // Generate signature using server-side API
      const signatureResponse = await fetch("/api/payfast/generate-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      if (!signatureResponse.ok) {
        throw new Error("Failed to generate payment signature")
      }

      const signatureData = await signatureResponse.json()
      const signature = signatureData.signature
      
      // Log the generated signature
      console.log('Generated signature:', signature);
      
      // Log the data that will be sent to PayFast
      const formData = {
        ...paymentData,
        signature: signature
      };
      console.log('Complete form data being sent to PayFast:', JSON.stringify(formData, null, 2));

      // Create PayFast form and submit
      const form = document.createElement("form")
      form.method = "POST"
      form.action =
        process.env.NODE_ENV === "production"
          ? "https://www.payfast.co.za/eng/process"
          : "https://sandbox.payfast.co.za/eng/process"

      // Add all payment data as hidden inputs
      Object.entries(paymentData).forEach(([key, value]) => {
        if (value) {
          const input = document.createElement("input")
          input.type = "hidden"
          input.name = key
          input.value = value.toString()
          form.appendChild(input)
        }
      })

      // Add signature input using the server-generated signature
      const signatureInput = document.createElement("input")
      signatureInput.type = "hidden"
      signatureInput.name = "signature"
      signatureInput.value = signature
      form.appendChild(signatureInput)

      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Payment error:", error)
      setError("Payment processing failed. Please try again.")
      setIsProcessing(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "Challenging":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex flex-col">
        {/* Header */}
        <header className="bg-black text-stone-100 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <Link href="/">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Mountain View Horse Trails Logo"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Mountain View Horse Trails</h1>
                  <p className="text-stone-400 hidden sm:block">Experience the Beauty of Nature on Horseback</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="py-12 flex items-center justify-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[rgb(120,53,15)] mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-stone-900">Loading booking system...</h2>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-black text-stone-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Mountain View Horse Trails Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-bold">Mountain View Horse Trails</h5>
                  <p className="text-stone-400 text-sm">Creating memories one trail at a time</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-stone-400 text-sm">© 2024 Mountain View Horse Trails. All rights reserved.</p>
                <p className="text-stone-400 text-sm">Licensed & Insured | Follow us on social media</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex flex-col">
        {/* Header */}
        <header className="bg-black text-stone-100 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <Link href="/">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Mountain View Horse Trails Logo"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Mountain View Horse Trails</h1>
                  <p className="text-stone-400 hidden sm:block">Experience the Beauty of Nature on Horseback</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/#home" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Home
                </Link>
                <Link href="/#trails" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Trails
                </Link>
                <Link href="/#gallery" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Gallery
                </Link>
                <Link href="/#services" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Services
                </Link>
                <Link href="/#about" className="hover:text-[rgb(120,53,15)] transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-red-900 mb-4">Something Went Wrong</h1>
              <p className="text-lg text-red-700 mb-6">{error}</p>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">
                  Try Again
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full border-[rgb(120,53,15)] text-[rgb(120,53,15)] hover:bg-[rgb(120,53,15)] hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-black text-stone-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Mountain View Horse Trails Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-bold">Mountain View Horse Trails</h5>
                  <p className="text-stone-400 text-sm">Creating memories one trail at a time</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-stone-400 text-sm">© 2024 Mountain View Horse Trails. All rights reserved.</p>
                <p className="text-stone-400 text-sm">Licensed & Insured | Follow us on social media</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex flex-col">
        {/* Header */}
        <header className="bg-black text-stone-100 shadow-lg sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Logo */}
                <Link href="/">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=64&width=64"
                      alt="Mountain View Horse Trails Logo"
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Mountain View Horse Trails</h1>
                  <p className="text-stone-400 hidden sm:block">Experience the Beauty of Nature on Horseback</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/#home" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Home
                </Link>
                <Link href="/#trails" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Trails
                </Link>
                <Link href="/#gallery" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Gallery
                </Link>
                <Link href="/#services" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Services
                </Link>
                <Link href="/#about" className="hover:text-[rgb(120,53,15)] transition-colors">
                  About
                </Link>
                <Link href="/#contact" className="hover:text-[rgb(120,53,15)] transition-colors">
                  Contact
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12 flex-grow">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-stone-900 mb-4">Booking Confirmed!</h1>
              <p className="text-lg text-stone-700 mb-6">
                Thank you for choosing Mountain View Horse Trails. Your adventure is booked!
              </p>

              <div className="bg-stone-100 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-stone-900 mb-4">Booking Details</h3>
                <div className="text-left space-y-2">
                  <p>
                    <strong>Confirmation #:</strong> {confirmationNumber}
                  </p>
                  <p>
                    <strong>Trail:</strong> {selectedTrail?.name}
                  </p>
                  <p>
                    <strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong>Riders:</strong> {numRiders}
                  </p>
                  <p>
                    <strong>Total Paid:</strong> R{bookingData.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <AlertCircle className="w-5 h-5 text-blue-600 inline mr-2" />
                <p className="text-blue-800 text-sm">
                  A confirmation email has been sent to {bookingData.customerInfo.email} with detailed instructions and
                  what to bring.
                </p>
              </div>

              <div className="space-y-3">
                <Link href="/">
                  <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">Return to Home</Button>
                </Link>
                <Button variant="outline" className="w-full border-[rgb(120,53,15)] text-[rgb(120,53,15)] hover:bg-[rgb(120,53,15)] hover:text-white" onClick={() => window.print()}>
                  Print Confirmation
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-black text-stone-100 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="Mountain View Horse Trails Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-bold">Mountain View Horse Trails</h5>
                  <p className="text-stone-400 text-sm">Creating memories one trail at a time</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-stone-400 text-sm">© 2024 Mountain View Horse Trails. All rights reserved.</p>
                <p className="text-stone-400 text-sm">Licensed & Insured | Follow us on social media</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200 flex flex-col">
      {/* Header */}
      <header className="bg-black text-stone-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo - Replace this Image component with your actual logo */}
              <Link href="/">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=64&width=64"
                    alt="Mountain View Horse Trails Logo"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Mountain View Horse Trails</h1>
                <p className="text-stone-400 hidden sm:block">Experience the Beauty of Nature on Horseback</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="/#home" className="hover:text-[rgb(120,53,15)] transition-colors">
                Home
              </Link>
              <Link href="/#trails" className="hover:text-[rgb(120,53,15)] transition-colors">
                Trails
              </Link>
              <Link href="/#gallery" className="hover:text-[rgb(120,53,15)] transition-colors">
                Gallery
              </Link>
              <Link href="/#services" className="hover:text-[rgb(120,53,15)] transition-colors">
                Services
              </Link>
              <Link href="/#about" className="hover:text-[rgb(120,53,15)] transition-colors">
                About
              </Link>
              <Link href="/#contact" className="hover:text-[rgb(120,53,15)] transition-colors">
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-stone-700 pt-4">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/#home"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/#trails"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trails
                </Link>
                <Link
                  href="/#gallery"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  href="/#services"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/#about"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/#contact"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Book Your Trail Ride</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? "bg-[rgb(120,53,15)] text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && <div className={`w-12 h-1 ${step > stepNum ? "bg-[rgb(120,53,15)]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Select Trail */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">Choose Your Trail</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {trails.map((trail) => (
                  <Card
                    key={trail.id}
                    className="border-stone-300 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleTrailSelect(trail)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-stone-900">{trail.name}</h3>
                        <Badge className={getDifficultyColor(trail.difficulty)}>{trail.difficulty}</Badge>
                      </div>
                      <div className="space-y-2 text-stone-700 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[rgb(120,53,15)]" />
                          <span>{trail.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2 text-[rgb(120,53,15)]" />
                          <span>Max {trail.maxRiders} riders</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-[rgb(120,53,15)]" />
                          <span>R{trail.price} per person</span>
                        </div>
                      </div>
                      <p className="text-stone-700 mb-4 text-sm">{trail.description}</p>
                      <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">Select This Trail</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedTrail && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">Select Date & Time</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-stone-300">
                  <CardHeader>
                    <CardTitle className="text-stone-900">Choose Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                    />
                  </CardContent>
                </Card>

                <Card className="border-stone-300">
                  <CardHeader>
                    <CardTitle className="text-stone-900">Number of Riders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={numRiders}
                      onChange={(e) => setNumRiders(Number(e.target.value))}
                      className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[rgb(120,53,15)]"
                    >
                      {Array.from({ length: selectedTrail.maxRiders }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Rider" : "Riders"}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>
              </div>

              {selectedDate && (
                <Card className="border-stone-300 mt-6">
                  <CardHeader>
                    <CardTitle className="text-stone-900">Available Times</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available || slot.spotsLeft < numRiders}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`p-3 ${
                            selectedTime === slot.time
                              ? "bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)]"
                              : "border-stone-300 text-[rgb(120,53,15)] hover:bg-stone-100"
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium">{slot.time}</div>
                            <div className="text-xs">{slot.available ? `${slot.spotsLeft} spots` : "Full"}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {selectedDate && selectedTime && (
                <div className="mt-6 text-center">
                  <Button onClick={handleDateTimeSelect} className="bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100 px-8 py-3">
                    Continue to Details
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Customer & Rider Information */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">Rider Information</h2>

              {/* Customer Information */}
              <Card className="border-stone-300 mb-6">
                <CardHeader>
                  <CardTitle className="text-stone-900">Primary Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">Full Name *</label>
                      <Input
                        value={bookingData.customerInfo.name}
                        onChange={(e) => handleCustomerInfo("name", e.target.value)}
                        className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">Email Address *</label>
                      <Input
                        type="email"
                        value={bookingData.customerInfo.email}
                        onChange={(e) => handleCustomerInfo("email", e.target.value)}
                        className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">Phone Number *</label>
                      <Input
                        type="tel"
                        value={bookingData.customerInfo.phone}
                        onChange={(e) => handleCustomerInfo("phone", e.target.value)}
                        className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                        placeholder="(970) 555-0123"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-2 font-medium">Emergency Contact *</label>
                      <Input
                        value={bookingData.customerInfo.emergencyContact}
                        onChange={(e) => handleCustomerInfo("emergencyContact", e.target.value)}
                        className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                        placeholder="Emergency contact name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-700 mb-2 font-medium">Emergency Phone *</label>
                    <Input
                      type="tel"
                      value={bookingData.customerInfo.emergencyPhone}
                      onChange={(e) => handleCustomerInfo("emergencyPhone", e.target.value)}
                      className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Rider Details */}
              <Card className="border-stone-300 mb-6">
                <CardHeader>
                  <CardTitle className="text-stone-900">Rider Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {bookingData.riderDetails.map((rider, index) => (
                    <div key={index} className="mb-6 p-4 border border-stone-200 rounded-lg">
                      <h4 className="font-medium text-stone-900 mb-3">Rider {index + 1}</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-stone-700 mb-2">Name *</label>
                          <Input
                            value={rider.name}
                            onChange={(e) => handleRiderDetail(index, "name", e.target.value)}
                            className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                            placeholder="Rider name"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-2">Age *</label>
                          <Input
                            type="number"
                            value={rider.age || ""}
                            onChange={(e) => handleRiderDetail(index, "age", Number(e.target.value))}
                            className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                            placeholder="Age"
                            min="6"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-stone-700 mb-2">Weight (lbs) *</label>
                          <Input
                            type="number"
                            value={rider.weight || ""}
                            onChange={(e) => handleRiderDetail(index, "weight", Number(e.target.value))}
                            className="border-stone-300 focus:ring-[rgb(120,53,15)]"
                            placeholder="Weight in pounds"
                            max="250"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-700 mb-2">Riding Experience *</label>
                          <select
                            value={rider.experience}
                            onChange={(e) => handleRiderDetail(index, "experience", e.target.value)}
                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[rgb(120,53,15)]"
                          >
                            <option value="">Select experience</option>
                            <option value="never">Never ridden</option>
                            <option value="beginner">Beginner (1-5 times)</option>
                            <option value="intermediate">Intermediate (comfortable)</option>
                            <option value="advanced">Advanced (very experienced)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}

                  {bookingData.riderDetails.length < numRiders && (
                    <Button onClick={addRider} className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">
                      Add Another Rider
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Continue Button */}
              <div className="mt-6 text-center">
                <Button onClick={() => setStep(4)} className="bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100 px-8 py-3">
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6 text-center">Payment</h2>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-left space-y-2 text-stone-700">
                  <p>
                    <strong className="text-stone-900">Trail:</strong> {selectedTrail?.name}
                  </p>
                  <p>
                    <strong className="text-stone-900">Date:</strong> {new Date(selectedDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong className="text-stone-900">Time:</strong> {selectedTime}
                  </p>
                  <p>
                    <strong className="text-stone-900">Riders:</strong> {numRiders}
                  </p>
                  <p>
                    <strong className="text-stone-900">Total Price:</strong> R{bookingData.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div className="mt-6 text-center">
                  <Button onClick={processPayment} className="bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100 px-8 py-3">
                    {isProcessing ? "Processing..." : "Pay Now"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-black text-stone-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/placeholder.svg?height=48&width=48"
                  alt="Mountain View Horse Trails Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h5 className="font-bold">Mountain View Horse Trails</h5>
                <p className="text-stone-400 text-sm">Creating memories one trail at a time</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-stone-400 text-sm">© 2024 Mountain View Horse Trails. All rights reserved.</p>
              <p className="text-stone-400 text-sm">Licensed & Insured | Follow us on social media</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
