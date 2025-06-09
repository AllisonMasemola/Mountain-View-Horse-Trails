import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mountain View Horse Trails',
  description: 'Offering horse trail rides near Cape Town. Other activities includes wine tasting, archery, a petting zoo and pony rides.',
  // generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) { 
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
