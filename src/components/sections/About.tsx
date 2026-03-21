import { Leaf } from "lucide-react"

export function About() {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top left, #1a2a0a 0%, #1c2a10 40%, #111a08 70%, #0a0f05 100%)`,
      }}
    >
      {/* Sunrise glow — top left */}
      <div
        className="absolute -top-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, rgba(168,224,0,0.25) 0%, rgba(168,224,0,0.08) 40%, transparent 70%)`,
          filter: `blur(60px)`,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `40px 40px`,
        }}
      />

      {/* Squiggle + two drop lines SVG */}
      <div className="absolute top-0 left-0 w-full pointer-events-none" style={{ height: "340px" }}>
        <svg
          viewBox="0 0 800 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Original squiggle */}
          <path
            d="M-20 120 C80 20, 180 160, 280 80 C380 0, 480 140, 580 60 C680 -20, 760 100, 820 60"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />

          {/* Left drop line — toward Mission */}
          <path
            d="M280 80 L210 280"
            stroke="rgba(168,224,0,0.15)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M280 80 L210 280"
            stroke="rgba(168,224,0,0.6)"
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="210" cy="281" r="2.5" fill="#a8e000" opacity="0.9" />
          <circle cx="210" cy="281" r="7" fill="#a8e000" opacity="0.1" />

          {/* Right drop line — toward Vision */}
          <path
            d="M580 60 L620 280"
            stroke="rgba(168,224,0,0.15)"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M580 60 L620 280"
            stroke="rgba(168,224,0,0.6)"
            strokeWidth="1"
            strokeDasharray="4 3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="620" cy="281" r="2.5" fill="#a8e000" opacity="0.9" />
          <circle cx="620" cy="281" r="7" fill="#a8e000" opacity="0.1" />
        </svg>
      </div>

      {/* Leaf icon on squiggle */}
      <div className="absolute top-6 left-16 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg z-10">
        <Leaf className="w-8 h-8 text-[#a8e000]" />
      </div>

      {/* Second loop circle on squiggle */}
      <div className="absolute top-4 right-48 w-14 h-14 rounded-full border border-white/50 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-52 max-w-4xl mx-auto">

          {/* LEFT — Our Mission */}
          <div className="flex flex-col items-start">
            <span
              className="px-4 py-1 rounded-full border text-xs font-semibold mb-5 tracking-wide"
              style={{
                borderColor: `rgba(255,255,255,0.2)`,
                color: `#a8e000`,
                background: `rgba(255,255,255,0.04)`,
              }}
            >
              Our Mission
            </span>

            <h3 className="text-white text-xl font-bold mb-4 leading-snug">
              Empowering every vendor, every day.
            </h3>

            <p className="text-white/60 text-sm leading-relaxed mb-8">
              FETS was built to give vendors and shop owners professional-grade tools
              to reduce avoidable waste and enhance food security across African markets
              — transitioning from manual tracking to automated real-time stock monitoring.
            </p>

            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-extrabold text-white mb-0.5">100%</p>
                <p className="text-xs uppercase tracking-wider text-white/40">Reliable</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-extrabold text-white mb-0.5">0%</p>
                <p className="text-xs uppercase tracking-wider text-white/40">Waste</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Our Vision */}
          <div className="flex flex-col items-start">
            <span
              className="px-4 py-1 rounded-full border text-xs font-semibold mb-5 tracking-wide"
              style={{
                borderColor: `rgba(168,224,0,0.35)`,
                color: `#a8e000`,
                background: `rgba(168,224,0,0.07)`,
              }}
            >
              Our Vision
            </span>

            <h3 className="text-white text-xl font-bold mb-4 leading-snug">
              A zero-waste future for Africa.
            </h3>

            <p className="text-white/60 text-sm leading-relaxed mb-8">
              To become the leading inventory intelligence platform across Africa — where
              every vendor and household eliminates food waste, protects livelihoods, and
              builds a sustainable food economy for generations to come.
            </p>

            <div className="flex items-center gap-8">
              <div>
                <p className="text-2xl font-extrabold text-white mb-0.5">20+</p>
                <p className="text-xs uppercase tracking-wider text-white/40">Markets</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-extrabold text-white mb-0.5">2030</p>
                <p className="text-xs uppercase tracking-wider text-white/40">Goal</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}