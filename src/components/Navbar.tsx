"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  /** "dark" forces dark text/border before scroll (for light-bg pages like Privacy Policy) */
  defaultLinkColor?: "light" | "dark";
}

export function Navbar({ defaultLinkColor = "light" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    // Trigger once on mount so SSR->client state is correct immediately
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "FAQS", href: "#faqs" },
    { name: "Contact", href: "#contact" },
  ];

  const handleScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;

    // If the anchor exists on this page, smooth-scroll to it
    const element = document.querySelector(href);
    if (element) {
      e.preventDefault();
      setMobileMenuOpen(false);
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    } else {
      // Anchor not on this page — navigate to homepage with the hash
      e.preventDefault();
      setMobileMenuOpen(false);
      window.location.href = "/" + href;
    }
  };

  // Before scroll: dark mode uses white text (hero), dark mode uses dark text (light pages)
  const isDark = defaultLinkColor === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md border-b py-2"
          : isDark
            ? "bg-white/90 backdrop-blur-sm border-b border-[#E8E6E0] py-4"
            : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-10 h-10 md:w-14 md:h-14 rounded-lg shadow-sm bg-white p-0.5"
              />
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 lg:ml-10 flex items-center space-x-1 lg:space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`px-2 lg:px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm ${
                    isScrolled
                      ? "text-foreground hover:text-primary"
                      : isDark
                        ? "text-foreground hover:text-white hover:bg-secondary"
                        : "text-white hover:bg-primary"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div
                className={`flex items-center space-x-4 pl-4 border-l transition-colors duration-300 ${
                  isScrolled
                    ? "border-border"
                    : isDark
                      ? "border-[#E8E6E0]"
                      : "border-white/20"
                }`}
              >
                <Button
                  variant="ghost"
                  className={
                    isScrolled || isDark
                      ? "text-foreground hover:bg-foreground hover:text-background"
                      : "text-white hover:bg-white/10"
                  }
                  asChild
                >
                  <Link href="/auth">Login</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={
                isScrolled || isDark
                  ? "text-foreground"
                  : "text-white hover:bg-white/10"
              }
            >
              {mobileMenuOpen ? (
                <X className="h-7 w-7" strokeWidth={2.8} />
              ) : (
                <Menu className="h-7 w-7" strokeWidth={2.8} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b flex flex-col items-center">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col items-center w-full">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="block px-3 py-4 rounded-md text-base font-medium w-full text-center hover:bg-muted"
              >
                {link.name}
              </a>
            ))}
            <div className="w-full px-4 pt-4 border-t mt-2">
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90"
                asChild
              >
                <Link href="/auth">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
