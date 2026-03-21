"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/sections/Hero"
import { Features } from "@/components/sections/Features"
import { HowItWorks } from "@/components/sections/HowItWorks"
import { About } from "@/components/sections/About"
import { Contact } from "@/components/sections/Contact"
import { Footer } from "@/components/sections/Footer"
import FAQPage from "@/components/sections/Faqs"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <About />
        <HowItWorks />
        <FAQPage />
        <Contact />
      </main>
      
      <Footer />
    </div>
  )
}
