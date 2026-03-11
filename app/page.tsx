import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { AIDemo } from "@/components/landing/ai-demo"
import { OfflineArchitecture } from "@/components/landing/offline-architecture"
import { MindMapPreview } from "@/components/landing/mind-map-preview"
import { FinalCTA } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"
import { AuthenticatedRedirect } from "@/components/auth/authenticated-redirect"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <AuthenticatedRedirect />
      <Header />
      <Hero />
      <Features />
      <AIDemo />
      <OfflineArchitecture />
      <MindMapPreview />
      <FinalCTA />
      <Footer />
    </main>
  )
}
