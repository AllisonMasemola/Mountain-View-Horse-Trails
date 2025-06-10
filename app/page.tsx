"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, MapPin, Clock, Star, Users, Mountain, TreePine, Menu, X, Calendar } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    trail: "beginner",
    date: "",
    riders: "1",
    message: "",
  })

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your actual booking system
    alert("Booking request submitted! We will contact you within 24 hours to confirm your reservation.")
    setBookingForm({
      name: "",
      email: "",
      phone: "",
      trail: "beginner",
      date: "",
      riders: "1",
      message: "",
    })
  }

  const galleryImages = [
    {
      src: "https://images.pexels.com/photos/1203309/pexels-photo-1203309.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Mountain trail with horses",
      caption: "Meet Horse 1",
    },
    { src: "https://images.pexels.com/photos/459124/pexels-photo-459124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      alt: "Meet Horse 2", caption: "Meet Horse 2" },
    {
      src: "https://images.pexels.com/photos/1996332/pexels-photo-1996332.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      alt: "Beautiful landscape view",
      caption: "Meet Horse 3",
    },
    { src: "https://images.pexels.com/photos/48785/horse-portrait-head-halter-48785.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      alt: "Horse close-up", caption: "Meet Horse 4" },
    { src: "https://images.pexels.com/photos/235894/pexels-photo-235894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      alt: "Group of riders", caption: "Meet Horse 5" },
    { src: "https://images.pexels.com/photos/793235/pexels-photo-793235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", 
      alt: "Sunset trail ride", caption: "Meet Horse 6" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-100 to-stone-200">
      {/* Header */}
      <header className="bg-black text-stone-100 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Logo - Replace this Image component with your actual logo */}
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt="Mountain View Horse Trails Logo"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mountain View Horse Trails</h1>
                <p className="text-stone-400 hidden sm:block">Experience the Beauty of Nature on Horseback</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link href="#home" className="hover:text-[rgb(120,53,15)] transition-colors">
                Home
              </Link>
              <Link href="#trails" className="hover:text-[rgb(120,53,15)] transition-colors">
                Trails
              </Link>
              <Link href="#gallery" className="hover:text-[rgb(120,53,15)] transition-colors">
                Gallery
              </Link>
              <Link href="#services" className="hover:text-[rgb(120,53,15)] transition-colors">
                Services
              </Link>
              <Link href="#about" className="hover:text-[rgb(120,53,15)] transition-colors">
                About
              </Link>
              <Link href="#contact" className="hover:text-[rgb(120,53,15)] transition-colors">
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
                  href="#home"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="#trails"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trails
                </Link>
                <Link
                  href="#gallery"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </Link>
                <Link
                  href="#services"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="#about"
                  className="hover:text-[rgb(120,53,15)] transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="#contact"
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

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center bg-gradient-to-r from-stone-800 to-black" style={{ 
        backgroundImage: "url('https://cdn.pixabay.com/photo/2020/06/02/06/17/arabian-horse-5249583_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "soft-light",
        paddingTop: "50px",
         }}>
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-bold text-stone-100 mb-6">
              Discover the Magic of Mountain Trail Riding
            </h2>
            <p className="text-lg sm:text-xl text-stone-300 mb-8 leading-relaxed">
              Join us for unforgettable horseback adventures through scenic mountain trails. Perfect for riders of all
              experience levels, from beginners to seasoned equestrians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking">
              <Button 
                size="lg" 
                className="bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100 px-8 py-3">
                  Book Your Trail Ride
              </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-[rgb(120,53,15)] text-[rgb(120,53,15)] hover:bg-[rgb(120,53,15)] hover:text-white px-8 py-3"
              >
                View Our Trails
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-200 to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-stone-900 mb-4">Why Choose Mountain View Horse Trails?</h3>
            <p className="text-stone-700 max-w-2xl mx-auto">
              We offer the perfect combination of adventure, safety, and natural beauty for an unforgettable experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mountain className="w-8 h-8 text-[rgb(120,53,15)]" />
                </div>
                <h4 className="text-xl font-semibold text-stone-900 mb-3">Scenic Mountain Views</h4>
                <p className="text-stone-700">
                  Breathtaking panoramic views of the surrounding mountains and valleys that will leave you speechless.
                </p>
              </CardContent>
            </Card>
            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[rgb(120,53,15)]" />
                </div>
                <h4 className="text-xl font-semibold text-stone-900 mb-3">Expert Guides</h4>
                <p className="text-stone-700">
                  Our experienced guides ensure your safety while sharing their knowledge of local wildlife and history.
                </p>
              </CardContent>
            </Card>
            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="w-8 h-8 text-[rgb(120,53,15)]" />
                </div>
                <h4 className="text-xl font-semibold text-stone-900 mb-3">Well-Maintained Trails</h4>
                <p className="text-stone-700">
                  Our trails are carefully maintained and suitable for riders of all skill levels, from beginners to
                  advanced.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trail Options */}
      <section id="trails" className="py-16 bg-gradient-to-b from-stone-200 to-stone-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-stone-900 mb-4">Our Trail Options</h3>
            <p className="text-stone-700 max-w-2xl mx-auto">
              Choose from a variety of trail experiences designed to match your skill level and time preferences.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-stone-900">Beginner Trail</h4>
                  <Badge className="bg-green-100 text-green-800">Easy</Badge>
                </div>
                <div className="space-y-2 text-stone-700 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>1 Hour</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>2 Miles</span>
                  </div>
                </div>
                <p className="text-stone-700 mb-4">
                  Perfect for first-time riders and families. Gentle terrain with beautiful meadow views.
                </p>
                <Link href="/booking">
                  <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">Book Now - R450.00</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-stone-900">Mountain Vista</h4>
                  <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                </div>
                <div className="space-y-2 text-stone-700 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>2 Hours</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>4 Miles</span>
                  </div>
                </div>
                <p className="text-stone-700 mb-4">
                  Our most popular trail featuring stunning mountain vistas and diverse wildlife.
                </p>
                <Link href="/booking">
                  <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">Book Now - R75</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-stone-300 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-stone-900">Advanced Ridge</h4>
                  <Badge className="bg-red-100 text-red-800">Challenging</Badge>
                </div>
                <div className="space-y-2 text-stone-700 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>3 Hours</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>6 Miles</span>
                  </div>
                </div>
                <p className="text-stone-700 mb-4">
                  For experienced riders seeking adventure on challenging mountain terrain.
                </p>
                <Link href="/booking">
                  <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] text-stone-100">Book Now - R95</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-amber-900 mb-4">Experience the Adventure</h3>
            <p className="text-amber-700 max-w-2xl mx-auto">
              Take a look at the breathtaking scenery and memorable moments from our trail rides.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <Card key={index} className="border-amber-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <p className="text-amber-900 font-medium text-center">{image.caption}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gradient-to-b from-stone-200 to-stone-300" style={{ 
        backgroundImage: "url('https://cdn.pixabay.com/photo/2018/05/11/11/11/horse-3390256_1280.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "soft-light",
        paddingTop: "50px",
         }}>
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-12">
            <h3 className="text-3xl text-white font-bold text-stone-900 mb-4">Additional Services</h3>
            <p className="text-stone-700 text-white max-w-2xl mx-auto">
              We offer more than just trail rides to make your experience complete.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-stone-300 text-center">
              <CardContent className="p-6">
                <Calendar className="w-12 h-12 text-[rgb(120,53,15)] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-900 mb-2">Private Tours</h4>
                <p className="text-stone-700 text-sm">Customized private trail experiences for special occasions</p>
              </CardContent>
            </Card>
            <Card className="border-stone-300 text-center">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-[rgb(120,53,15)] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-900 mb-2">Group Events</h4>
                <p className="text-stone-700 text-sm">
                  Perfect for corporate retreats, birthday parties, and team building
                </p>
              </CardContent>
            </Card>
            <Card className="border-stone-300 text-center">
              <CardContent className="p-6">
                <Star className="w-12 h-12 text-[rgb(120,53,15)] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-900 mb-2">Riding Lessons</h4>
                <p className="text-stone-700 text-sm">Learn proper riding techniques from our certified instructors</p>
              </CardContent>
            </Card>
            <Card className="border-stone-300 text-center">
              <CardContent className="p-6">
                <Mountain className="w-12 h-12 text-[rgb(120,53,15)] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-stone-900 mb-2">Photography Tours</h4>
                <p className="text-stone-700 text-sm">Capture stunning photos with our scenic photography packages</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-stone-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-stone-900 mb-6">About Mountain View Horse Trails</h3>
            <p className="text-lg text-stone-700 mb-8 leading-relaxed">
              For over 20 years, Mountain View Horse Trails has been providing unforgettable horseback riding
              experiences in the heart of Colorado's most beautiful mountain terrain. Our family-owned business is
              dedicated to sharing our love of horses and the great outdoors with visitors from around the world.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-[rgb(120,53,15)] mb-2">20+</div>
                <p className="text-stone-700">Years of Experience</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[rgb(120,53,15)] mb-2">15</div>
                <p className="text-stone-700">Well-Trained Horses</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-[rgb(120,53,15)] mb-2">5000+</div>
                <p className="text-stone-700">Happy Riders</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-stone-900 mb-4">What Our Riders Say</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-stone-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[rgb(120,53,15)] text-[rgb(120,53,15)]" />
                  ))}
                </div>
                <p className="text-stone-700 mb-4">
                  "Amazing experience! The guides were knowledgeable and the horses were well-trained. The mountain
                  views were absolutely breathtaking."
                </p>
                <p className="font-semibold text-stone-900">- Sarah Johnson</p>
              </CardContent>
            </Card>

            <Card className="border-stone-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[rgb(120,53,15)] text-[rgb(120,53,15)]" />
                  ))}
                </div>
                <p className="text-stone-700 mb-4">
                  "Perfect for our family vacation. Even our 8-year-old felt comfortable and safe. We'll definitely be
                  back!"
                </p>
                <p className="font-semibold text-stone-900">- Mike Chen</p>
              </CardContent>
            </Card>

            <Card className="border-stone-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[rgb(120,53,15)] text-[rgb(120,53,15)]" />
                  ))}
                </div>
                <p className="text-stone-700 mb-4">
                  "The advanced trail was challenging and rewarding. Great horses, beautiful scenery, and professional
                  staff."
                </p>
                <p className="font-semibold text-stone-900">- Emily Rodriguez</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Booking Section */}
      <section id="contact" className="py-16 bg-stone-100" style={{ 
        backgroundImage: "url('https://cdn.pixabay.com/photo/2023/04/04/12/04/horse-7899209_960_720.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "soft-light",
        paddingTop: "50px",
         }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-stone-900 mb-4">Plan Your Adventure</h3>
            <p className="text-stone-700 max-w-2xl mx-auto">
              Ready to experience the beauty of mountain trail riding? Contact us to book your adventure today!
            </p>
          </div>


          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Information - Column 1 */}
            <div>
              <h4 className="text-xl font-semibold text-stone-900 mb-6">Contact Information</h4>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[rgb(120,53,15)] mr-3" />
                  <span className="text-stone-700">(+27) 83 727 0256 </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[rgb(120,53,15)] mr-3" />
                  <span className="text-stone-700">(+27) 83 727 0256 </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-[rgb(120,53,15)] mr-3" />
                  <span className="text-stone-700">info@mountainviewhorsetrails.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-[rgb(120,53,15)] mr-3" />
                  <span className="text-stone-700">Van Schoorsdrif Rd, Cape Farms, Cape Town </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-[rgb(120,53,15)] mr-3" />
                  <span className="text-stone-700">Daily 8:00 AM - 6:00 PM (Seasonal)</span>
                </div>
              </div>
            </div>

            {/* Important Information - Column 2 */}
            <div>
              <div className="bg-stone-200 p-6 rounded-lg h-full">
                <h5 className="font-semibold text-stone-900 mb-3">Important Information</h5>
                <ul className="text-stone-700 text-sm space-y-2">
                  <li>• Reservations required - walk-ins subject to availability</li>
                  <li>• Minimum age: 6 years old</li>
                  <li>• Weight limit: 250 lbs</li>
                  <li>• Closed-toe shoes required</li>
                  <li>• Weather-dependent - we'll contact you if conditions are unsafe</li>
                  <li>• 24-hour cancellation policy</li>
                </ul>
              </div>
            </div>

            {/* Booking CTA - Column 3 */}
            <div>
              <div className="bg-stone-200 p-6 rounded-lg h-full">
                <h5 className="font-semibold text-stone-900 mb-3">Ready to Book?</h5>
                <p className="text-stone-700 mb-4">
                  Use our online booking system to check availability, select your preferred time, and secure your
                  reservation with instant confirmation.
                </p>
                <Link href="/booking">
                  <Button className="w-full bg-[rgb(120,53,15)] hover:bg-[rgb(100,43,12)] py-3 text-lg text-stone-100">
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="map mt-3 w-full aspect-video">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3317.426518782745!2d18.5568953!3d-33.7496426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dccf657bdb2a663%3A0xe3ac79a529d6601!2sMountain%20View%20Horse%20Trails!5e0!3m2!1sen!2sza!4v1749143643813!5m2!1sen!2sza"
          className="w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
</div>

      </section>

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
