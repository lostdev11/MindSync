"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Github, ArrowRight } from "lucide-react"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#recall", label: "AI Recall" },
  { href: "#offline", label: "Offline-First" },
  { href: "#demo", label: "Demo" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/10" />
            {/* Inner glow */}
            <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10" />
            {/* Core */}
            <div className="relative h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(124,58,237,0.6)]" />
            {/* Orbiting dot */}
            <div className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
          </div>
          <span className="text-lg font-bold text-foreground">MindSync</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href="/sign-in">
            <Button className="group h-10 rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.25)] transition-all hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]">
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted/50 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border/30 bg-background/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex h-12 items-center rounded-lg px-4 text-base text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-3 rounded-lg px-4 text-base text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-5 w-5" />
                <span>GitHub</span>
              </Link>
            </div>
            <div className="mt-4 border-t border-border/30 pt-4">
              <Link href="/sign-in">
                <Button className="w-full h-12 rounded-lg bg-primary font-semibold text-primary-foreground shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
