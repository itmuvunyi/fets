"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Github, Loader2, CheckCircle2, XCircle } from "lucide-react";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
  </svg>
);

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "FAQ", href: "#faqs" },
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Contact", href: "#contact" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
    social: [
      { name: "Facebook", icon: Facebook, href: "#" },
      { name: "X", icon: XIcon, href: "#" },
      { name: "Instagram", icon: Instagram, href: "#" },
      { name: "GitHub", icon: Github, href: "#" },
    ],
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setStatus("success");
      setMessage(data.message || "You're subscribed! Check your inbox.");
      setEmail("");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">

        {/* Main grid:
            mobile:  2 cols (brand full-width, then product+company side by side, newsletter full-width)
            md+:     4 cols all in one row
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">

          {/* Brand — full width on mobile, 1 col on md+ */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="FETS Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg bg-white p-1 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Empowering market vendors, small business owners, and households
              to protect business profits and reduce waste through automated
              expiry tracking.
            </p>
            <div className="flex gap-4 mt-5">
              {footerLinks.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product — 1 col on mobile, 1 col on md+ */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
              Product
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — 1 col on mobile, 1 col on md+ */}
          <div className="col-span-1">
            <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter — full width on mobile, 1 col on md+ */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-bold tracking-wider text-foreground uppercase mb-4">
              Business Insights
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get tips on inventory management and food preservation to grow
              your business.
            </p>

            {status === "success" ? (
              <div className="flex items-start gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="w-full bg-white border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-primary text-white text-sm font-semibold rounded-lg px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </button>

                {status === "error" && (
                  <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-xs">{message}</p>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <p className="text-muted-foreground text-xs">
            &copy; {currentYear} Food Expire Tracker System (FETS). All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Built for a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
}