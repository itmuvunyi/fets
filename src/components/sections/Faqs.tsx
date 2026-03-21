"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = ["General", "Features", "Technical", "Pricing"];

const faqs = [
  {
    category: "General",
    question: "What is the Food Expire Tracker System (FETS)?",
    answer:
      "FETS is a smart inventory management system designed to help vendors, small businesses, and households track product expiry dates, reduce waste, and protect profits through timely alerts and insights.",
  },
  {
    category: "General",
    question: "Who can use FETS?",
    answer:
      "FETS is built for market vendors, shop owners, small businesses, and households. Anyone who manages food or perishable inventory can benefit from it.",
  },
  {
    category: "Features",
    question: "How does FETS help prevent losses?",
    answer:
      "FETS monitors your product expiry dates and sends alerts before items expire, allowing you to sell, use, or manage stock in time to avoid waste and financial loss.",
  },
  {
    category: "Features",
    question: "Can I customize expiry notifications?",
    answer:
      "Yes. You can set when you want to be notified — for example, 7 days, 3 days, or even hours before a product expires.",
  },
  {
    category: "Features",
    question: "Does FETS provide reports or analytics?",
    answer:
      "Yes. FETS provides insights into waste patterns and product performance, helping you make smarter purchasing and inventory decisions.",
  },
  {
    category: "Features",
    question: "How do I add products to the system?",
    answer:
      "You can easily log products by entering their name, category, purchase date, and expiry date. Barcode scanning can also be supported if enabled.",
  },
  {
    category: "Technical",
    question: "Does FETS work without strong internet?",
    answer:
      "Yes. FETS is optimized for low-bandwidth environments, making it reliable even in areas with limited internet connectivity.",
  },
  {
    category: "Technical",
    question: "Can I use FETS on my phone?",
    answer:
      "Yes. FETS is designed to be fully responsive, so you can use it on smartphones, tablets, and desktops.",
  },
  {
    category: "Technical",
    question: "Is my data secure?",
    answer:
      "Yes. FETS ensures that your inventory data is securely stored and accessible only to you.",
  },
  {
    category: "Pricing",
    question: "Is FETS free to use?",
    answer:
      "FETS may offer free and premium features depending on your needs. Contact the team for more details on pricing and plans.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("General");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter((f) => f.category === activeCategory);

  return (
    <main className="bg-[#F7F8FC] font-sans">
      {/* Header */}
      <section id="faqs" className="pt-12 pb-10 text-center px-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#12122A] leading-tight tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-3 text-[#7B7E9E] text-base md:text-md">
          Trusted by 100+ customers — find quick answers below.
        </p>

        {/* Category Tabs */}
        <div className="mt-10 inline-flex gap-2 bg-white border border-[#E4E5F0] rounded-full px-2 py-2 shadow-sm flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-secondary text-white "
                  : "text-[#7B7E9E] hover:text-[#12122A] hover:bg-[#F0F0FA]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* FAQ List */}
      <section className="max-w-2xl mx-auto px-4 pb-14 space-y-3">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isOpen
                  ? "bg-[#EEEEFF] border-[#C4C1F7]"
                  : "bg-white border-[#E4E5F0] hover:border-[#C4C1F7] hover:shadow-sm"
              }`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <div className="flex items-center justify-between px-6 py-5">
                <span
                  className={`text-base font-semibold leading-snug transition-colors duration-200 ${
                    isOpen ? "text-primary" : "text-[#12122A]"
                  }`}
                >
                  {faq.question}
                </span>
                <span
                  className={`ml-4 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-base transition-all duration-300 ${
                    isOpen
                      ? "bg-secondary text-white rotate-180"
                      : "bg-[#F0F0FA] text-[#7B7E9E]"
                  }`}
                >
                  <ChevronDown size={18} strokeWidth={2.5} />
                </span>
              </div>

              {/* Answer panel */}
              <div
                className={`px-6 transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
                } overflow-hidden`}
              >
                <p className="text-[#4A4D6E] text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Footer CTA */}
      <div className="text-center pb-8 sm:pb-8 px-4">
        <p className="text-[#7B7E9E] text-sm">
          Still have questions?{" "}
          <a
            href="mailto:support@fets.gmail"
            className="text-secondary font-semibold hover:underline"
          >
            Contact our support team →
          </a>
        </p>
      </div>
    </main>
  );
}
