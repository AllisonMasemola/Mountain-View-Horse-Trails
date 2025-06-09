import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendConfirmationEmail(customer: any, booking: any) {
  try {
    // Format date for display
    const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Calculate price in ZAR (South African Rand)
    const priceZAR = (Number.parseFloat(booking.totalPrice) * 18.5).toFixed(2)

    // Create email content
    const mailOptions = {
      from: `"Mountain View Horse Trails" <${process.env.SMTP_FROM || "info@mountainviewhorsetrails.com"}>`,
      to: customer.email,
      subject: "Your Trail Ride Booking is Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; padding: 20px 0; background-color: #8B4513; color: white; border-radius: 5px 5px 0 0;">
            <h1 style="margin: 0;">Booking Confirmation</h1>
          </div>
          
          <div style="padding: 20px; background-color: #FFF8E1;">
            <p style="font-size: 16px;">Dear ${customer.name},</p>
            <p style="font-size: 16px;">Thank you for booking with Mountain View Horse Trails! Your reservation has been confirmed and paid.</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #8B4513; margin-top: 0;">Booking Details</h2>
              <p><strong>Confirmation Number:</strong> ${booking.id}</p>
              <p><strong>Trail:</strong> ${booking.trailName}</p>
              <p><strong>Date:</strong> ${formattedDate}</p>
              <p><strong>Time:</strong> ${booking.time}</p>
              <p><strong>Number of Riders:</strong> ${booking.riders}</p>
              <p><strong>Total Paid:</strong> R${priceZAR}</p>
            </div>
            
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h2 style="color: #8B4513; margin-top: 0;">What to Bring</h2>
              <ul>
                <li>Closed-toe shoes (required)</li>
                <li>Comfortable clothing appropriate for the weather</li>
                <li>Sunscreen and hat</li>
                <li>Water bottle</li>
                <li>Camera (optional)</li>
              </ul>
            </div>
            
            <p style="font-size: 16px;">We'll contact you 24 hours before your ride with final details and weather updates.</p>
            
            <p style="font-size: 16px;">If you have any questions or need to make changes to your booking, please contact us at (970) 555-TRAIL (8724) or reply to this email.</p>
          </div>
          
          <div style="text-align: center; padding: 20px; background-color: #8B4513; color: white; border-radius: 0 0 5px 5px;">
            <p style="margin: 0;">Mountain View Horse Trails</p>
            <p style="margin: 5px 0;">1247 Mountain Trail Road, Estes Park, CO 80517</p>
            <p style="margin: 5px 0;">(970) 555-TRAIL (8724)</p>
          </div>
        </div>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Confirmation email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
    return false
  }
}

export async function sendAdminNotification(booking: any) {
  try {
    const mailOptions = {
      from: `"Mountain View Horse Trails" <${process.env.SMTP_FROM || "info@mountainviewhorsetrails.com"}>`,
      to: process.env.ADMIN_EMAIL || "admin@mountainviewhorsetrails.com",
      subject: `New Booking: ${booking.id}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h1>New Booking Received</h1>
          <p>A new booking has been confirmed and paid.</p>
          
          <h2>Booking Details</h2>
          <p><strong>ID:</strong> ${booking.id}</p>
          <p><strong>Trail:</strong> ${booking.trailName}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Riders:</strong> ${booking.riders}</p>
          <p><strong>Total:</strong> $${booking.totalPrice}</p>
          
          <p>Please log in to the admin dashboard to view full details.</p>
        </div>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("Admin notification sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Failed to send admin notification:", error)
    return false
  }
}
