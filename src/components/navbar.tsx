"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname() || "/"
  const publicPaths = ["/", "/signin", "/signup"]
  const isPublic = publicPaths.includes(pathname)

  const [storedTin, setStoredTin] = useState<string | null>(null)

  useEffect(() => {
    const tin = localStorage.getItem("reach_tin")
    setStoredTin(tin)
  }, [])

  const links = [
    { href: storedTin ? `/dashboard?tin=${storedTin}` : "/dashboard", label: "Dashboard" },
    { href: "/tracker", label: "Application Tracker" },
    { href: "/application-form", label: "Narrative Form" },
    { href: "/loan-purpose", label: "Loan Purpose" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-2xl font-bold text-brand-blue tracking-tight">
          REACH
        </Link>

        {isPublic ? (
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="ghost" className="text-brand-blue hover:bg-brand-lightblue/50">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-brand-blue text-white hover:bg-brand-darkblue">
                Sign Up
              </Button>
            </Link>
            <Link href="/signin?redirect=/dashboard" className="hidden md:inline-flex">
              <Button variant="outline" className="text-brand-blue border-brand-blue hover:bg-brand-lightblue/70">
                Apply
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand-blue ${
                    pathname === link.href ? "text-brand-blue" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link href="/">
              <Button variant="ghost" className="text-slate-700 hover:bg-brand-lightblue/50">
                Sign Out
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
