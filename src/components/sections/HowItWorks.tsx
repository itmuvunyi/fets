import { PackageSearch, Clock, TrendingUp } from "lucide-react";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 bg-[#f4f5f7]"
      style={{
        backgroundImage: `radial-gradient(circle, #c8cdd6 1px, transparent 1px)`,
        backgroundSize: `28px 28px`,
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            Simple 3-Step Inventory Control
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
          <div className="flex flex-col items-center text-center w-full max-w-xs md:w-48">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border/40 flex items-center justify-center mb-4">
              <PackageSearch className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              1. Log Your Products
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your new stock as it arrives at your shop or market stall.
            </p>
          </div>

          <div className="hidden md:block w-24 lg:w-32 border-t-2 border-dashed border-muted-foreground/30 shrink-0 mt-[-48px]" />
          <div className="md:hidden h-8 border-l-2 border-dashed border-muted-foreground/30" />

          <div className="flex flex-col items-center text-center w-full max-w-xs md:w-48">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg border border-border/40 flex items-center justify-center mb-4 md:-mt-2">
              <Clock className="w-9 h-9 text-chart-3" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              2. Set Your Reminders
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Customize when you want to be alerted — 7 days or 48 hours before
              expiry.
            </p>
          </div>

          <div className="hidden md:block w-24 lg:w-32 border-t-2 border-dashed border-muted-foreground/30 shrink-0 mt-[-48px]" />
          <div className="md:hidden h-8 border-l-2 border-dashed border-muted-foreground/30" />

          <div className="flex flex-col items-center text-center w-full max-w-xs md:w-48">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border/40 flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              3. Sell Before Expiry
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get notified on your device and move stock while it's still fresh
              and profitable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
