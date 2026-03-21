"use client";

import { useEffect, useRef, useState } from "react";
import {
  Info,
  Database,
  FileText,
  Shield,
  Share2,
  Cookie,
  UserCheck,
  Clock,
  Link2,
  RefreshCw,
  Mail,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

const sections = [
  { id: "introduction", label: "Introduction", icon: Info },
  {
    id: "information-we-collect",
    label: "Information We Collect",
    icon: Database,
  },
  { id: "how-we-use", label: "How We Use Your Information", icon: FileText },
  { id: "data-storage", label: "Data Storage and Security", icon: Shield },
  { id: "data-sharing", label: "Data Sharing", icon: Share2 },
  { id: "cookies", label: "Cookies and Tracking", icon: Cookie },
  { id: "your-rights", label: "Your Rights", icon: UserCheck },
  { id: "data-retention", label: "Data Retention", icon: Clock },
  { id: "third-party", label: "Third-Party Services", icon: Link2 },
  { id: "changes", label: "Changes to This Policy", icon: RefreshCw },
  { id: "contact", label: "Contact Us", icon: Mail },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [tocOpen, setTocOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.current?.observe(el);
    });
    return () => observer.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setTocOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const activeLabel =
    sections.find((s) => s.id === activeSection)?.label ?? "Introduction";

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans">
      <Navbar defaultLinkColor="dark" />

      <div className="relative w-full h-48 sm:h-56 md:h-72 mt-16 md:mt-20 overflow-hidden">
        <img
          src="/hero-bg.png"
          alt="Privacy Policy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Welcome to our privacy policy!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/60">
            Last Updated: 21.03.2026
          </p>
        </div>
      </div>

      <div className="lg:hidden border-b border-[#E8E6E0] bg-white px-4 py-3 sticky top-0 z-50">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between text-sm font-semibold text-[#1A1814]"
        >
          <span className="text-[#A0998A] uppercase tracking-widest text-xs font-bold">
            {activeLabel}
          </span>
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 text-[#A0998A] ${tocOpen ? "rotate-180" : ""}`}
          />
        </button>

        {tocOpen && (
          <nav className="mt-3 space-y-1 pb-2">
            {sections.map(({ id, label, icon: Icon }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-secondary text-white font-semibold"
                      : "text-[#6B6560] hover:bg-[#F3F1ED] hover:text-[#1A1814]"
                  }`}
                >
                  <Icon size={14} className="shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-[#E8E6E0] bg-white px-4 py-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#A0998A] mb-5 px-2">
            Table of contents
          </p>
          <nav className="space-y-1">
            {sections.map(({ id, label, icon: Icon }, index) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  style={{ animationDelay: `${index * 60}ms` }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm
                    animate-[fadeSlideIn_0.4s_ease_both]
                    transition-all duration-200 ${
                      isActive
                        ? "bg-secondary text-white font-semibold shadow-sm scale-[1.02]"
                        : "text-[#6B6560] hover:bg-[#F3F1ED] hover:text-[#1A1814] hover:translate-x-1"
                    }`}
                >
                  <Icon
                    size={14}
                    className={`shrink-0 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
                  />
                  <span className="leading-snug">{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-12 py-8 sm:py-12 space-y-10 sm:space-y-14">
          <Section id="introduction" title="1. Introduction">
            <p>
              The Food Expire Tracker System (FETS) values your privacy. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our application.
            </p>
            <p className="mt-3">
              By using FETS, you agree to the collection and use of information
              in accordance with this policy.
            </p>
          </Section>

          <Section
            id="information-we-collect"
            title="2. Information We Collect"
          >
            <p>We may collect the following types of information:</p>
            <SubSection label="a. Personal Information">
              <BulletList
                items={[
                  "Name",
                  "Email address",
                  "Phone number (if provided)",
                  "Business type",
                ]}
              />
            </SubSection>
            <SubSection label="b. Usage Data">
              <BulletList
                items={[
                  "Products you add (e.g., names, categories, expiry dates)",
                  "App usage activity",
                  "Device and browser information",
                ]}
              />
            </SubSection>
          </Section>

          <Section id="how-we-use" title="3. How We Use Your Information">
            <p>We use your information to:</p>
            <BulletList
              items={[
                "Provide and maintain the service",
                "Track and manage your inventory",
                "Send expiry alerts and notifications",
                "Improve system performance and user experience",
                "Communicate updates or support responses",
              ]}
            />
          </Section>

          <Section id="data-storage" title="4. Data Storage and Security">
            <p>
              We take appropriate measures to protect your data from
              unauthorized access, alteration, or disclosure. Your information
              is stored securely and only accessible to authorized users.
            </p>
          </Section>

          <Section id="data-sharing" title="5. Data Sharing">
            <p>We do not sell or rent your personal data.</p>
            <p className="mt-3">We may share data only:</p>
            <BulletList
              items={[
                "When required by law",
                "To protect system security and integrity",
                "With trusted service providers (if any) who help operate the system",
              ]}
            />
          </Section>

          <Section id="cookies" title="6. Cookies and Tracking">
            <p>
              FETS may use cookies or similar technologies to improve user
              experience, remember preferences, and analyze system performance.
            </p>
          </Section>

          <Section id="your-rights" title="7. Your Rights">
            <p>You have the right to:</p>
            <BulletList
              items={[
                "Access your data",
                "Update or correct your information",
                "Request deletion of your account and data",
              ]}
            />
          </Section>

          <Section id="data-retention" title="8. Data Retention">
            <p>
              We retain your data only as long as necessary to provide our
              services or comply with legal obligations.
            </p>
          </Section>

          <Section id="third-party" title="9. Third-Party Services">
            <p>
              FETS may integrate with third-party tools (e.g., analytics,
              hosting). These services have their own privacy policies, and we
              encourage you to review them.
            </p>
          </Section>

          <Section id="changes" title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </Section>

          <Section id="contact" title="11. Contact Us">
            <p>
              If you have any questions about this Privacy Policy, you can
              contact us at:
            </p>
            <BulletList
              items={[
                "Email: fetssupport@gmail.com",
                "Phone: +250 798 636 824",
              ]}
            />
          </Section>
        </main>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-lg sm:text-xl font-bold text-[#1A1814] mb-4">
        {title}
      </h2>
      <div className="text-[#4A4742] text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </section>
  );
}

function SubSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <p className="font-semibold text-[#1A1814] mb-2">{label}</p>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
