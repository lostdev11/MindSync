import Link from "next/link"
import { Github, Twitter } from "lucide-react"

const footerLinks = {
  product: [
    { href: "#features", label: "Features" },
    { href: "#recall", label: "AI Recall" },
    { href: "#offline", label: "Offline-First" },
    { href: "#demo", label: "Demo" },
  ],
  resources: [
    { href: "#", label: "Documentation" },
    { href: "#", label: "API Reference" },
    { href: "#", label: "Changelog" },
    { href: "#", label: "Status" },
  ],
}

export function Footer() {
  return (
    <footer className="relative border-t border-border/30 bg-card/20">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.01)_1px,transparent_1px)] bg-[size:48px_48px]" />
      
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Logo and tagline */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center">
                <div className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/10" />
                <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10" />
                <div className="relative h-3.5 w-3.5 rounded-full bg-primary shadow-[0_0_12px_rgba(124,58,237,0.6)]" />
                <div className="absolute -right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              </div>
              <span className="text-lg font-bold text-foreground">MindSync</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Your offline-first AI second brain. Capture ideas, organize knowledge, and recall anything with the power of AI.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-muted/30 text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MindSync. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link href="#" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="#" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="#" className="transition-colors hover:text-foreground">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
