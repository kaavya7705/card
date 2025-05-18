import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DuelForge",
  description: "A strategic card battle game with elemental types and special abilities",
  icons: {
    icon: "https://th.bing.com/th/id/OIP.41Y3AfSLktCO2NcBW1geGAHaHa?w=167&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3",
    shortcut: "https://th.bing.com/th/id/OIP.41Y3AfSLktCO2NcBW1geGAHaHa?w=167&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3",
    apple: "https://th.bing.com/th/id/OIP.41Y3AfSLktCO2NcBW1geGAHaHa?w=167&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.3&pid=1.7&rm=3",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          {children}
          <Toaster />
        </body>
      </html>
    </ThemeProvider>
  )
}
