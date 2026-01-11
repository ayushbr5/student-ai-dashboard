import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EduFlux - Your Learning Partner',
  description: 'AI-powered tools for students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full">
        <body className={`${inter.className} antialiased h-full bg-white`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}