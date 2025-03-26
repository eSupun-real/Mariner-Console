import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mariner Console',
  description: 'A comprehensive marine weather monitoring dashboard',
  generator: 'Supun with help from v0 and Cursor',
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
