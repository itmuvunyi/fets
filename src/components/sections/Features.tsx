import { Bell, BarChart3, PlusCircle, Wifi } from "lucide-react"

const features = [
  {
    name: "Smart Stock Entry",
    description:
      "Quickly register products by category (Grains, Perishables, Packaged Goods) with their specific expiry dates.",
    icon: PlusCircle,
    illustration: (Icon: React.ElementType) => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-xl bg-primary/10 rotate-12 translate-x-3 translate-y-1" />
        <div className="absolute w-12 h-12 rounded-xl bg-primary/10 -rotate-6 -translate-x-3 -translate-y-1" />
        <div className="relative z-10 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    ),
  },
  {
    name: "Automated Expiry Alerts",
    description:
      "Receive proactive notifications days or weeks before a product expires so you can prioritize sales.",
    icon: Bell,
    illustration: (Icon: React.ElementType) => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-20 h-20 rounded-full bg-primary/10" />
        <div className="absolute w-14 h-14 rounded-full bg-primary/15" />
        <div className="relative z-10 w-10 h-10 rounded-full bg-primary/25 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    ),
  },
  {
    name: "Business Analytics",
    description:
      "View detailed reports on waste patterns to help you make smarter buying decisions for your stock.",
    icon: BarChart3,
    illustration: (Icon: React.ElementType) => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-16 h-16 rounded-xl bg-primary/10 -rotate-12 -translate-x-3" />
        <div className="absolute w-12 h-12 rounded-xl bg-primary/10 rotate-6 translate-x-3 translate-y-1" />
        <div className="relative z-10 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    ),
  },
  {
    name: "Low-Bandwidth Optimization",
    description:
      "Designed to work reliably in market environments with limited internet connectivity.",
    icon: Wifi,
    illustration: (Icon: React.ElementType) => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute w-20 h-20 rounded-full bg-primary/10" />
        <div className="absolute w-14 h-14 rounded-full bg-primary/15" />
        <div className="relative z-10 w-10 h-10 rounded-full bg-primary/25 flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    ),
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="py-12 sm:py-16 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at top left, #f0a96e 0%, #f5c99a 25%, #f7dbb8 50%, #faecd8 75%, #fdf6ee 100%)`,
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: `40px 40px`,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="mt-2 text-2xl sm:text-3xl leading-8 font-bold tracking-tight text-foreground">
            Built for Business Growth
          </p>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground mx-auto">
            Everything you need to manage your business inventory and prevent losses from expired goods.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="flex flex-row sm:flex-col rounded-xl overflow-hidden border border-white/60 shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="w-24 shrink-0 sm:w-full h-auto sm:h-32 bg-white relative flex items-center justify-center">
                <div className="w-full h-24 sm:h-32 relative">
                  {feature.illustration(feature.icon)}
                </div>
              </div>

              <div className="flex-1 px-4 py-4 flex flex-col justify-center gap-1 bg-white">
                <h3 className="text-sm font-bold text-foreground">{feature.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}