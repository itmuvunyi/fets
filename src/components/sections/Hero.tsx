"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-36 md:pb-30 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg-v2.png"
          alt="Modern stock Background"
          fill
          priority
          className="object-cover"
        />
        {/* Left-to-right gradient overlay for darkening */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        {/* Left-to-right gradient blur effect */}
        <div className="absolute inset-0 backdrop-blur-[6px] [mask-image:linear-gradient(to_right,black_0%,transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left max-w-3xl flex flex-col justify-center items-start">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-4xl md:text-4xl mb-8 leading-tight">
            <span className="block font-sans mb-4 text-primary text-3xl sm:text-4xl">Stop Losing Money to</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500 pb-8">Expired Stock</span>
          </h1>
          
          <p className="max-w-xl text-lg text-gray-200 sm:text-xl md:text-base mb-14 drop-shadow-md leading-relaxed">
            The smartest inventory tracker for market vendors and shop owners to monitor expiry dates and protect business profits.
          </p>
          
          <div className="flex justify-start gap-4 flex-col sm:flex-row w-full max-w-sm sm:max-w-none">
            <Button size="lg" className="group rounded-full px-10 text-md h-14 bg-primary hover:bg-primary/90 text-white border-none shadow-2xl transition-all hover:scale-105 active:scale-95" asChild>
              <Link href="/auth">
                Start Tracking Now
                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
