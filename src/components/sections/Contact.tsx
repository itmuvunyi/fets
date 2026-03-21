"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, CheckCircle, Mail, Phone } from "lucide-react";
import Image from "next/image";

function WorldMap() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src="/world-map.png"
        alt="World Map Background"
        fill
        className="object-cover opacity-20 blur-[2px]"
        priority
      />
    </div>
  );
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    contactInfo: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", businessType: "", contactInfo: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section
      id="contact"
      className="pt-10 pb-14 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-24 relative overflow-hidden bg-[#f0f2f5]"
    >
      {/* World map background */}
      <WorldMap />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* LEFT — Info */}
          <div className="order-2 lg:order-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              We're here to help you
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight mb-4 sm:mb-6">
              <span className="font-extrabold">Discuss</span> Your Inventory
              Needs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-sm">
              Have questions about integrating FETS into your business? Our team
              is ready to help you secure your inventory and reduce waste.
            </p>

            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-mail</p>
                  <p className="text-sm sm:text-base font-medium text-foreground">
                    fetssupport@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone number</p>
                  <p className="text-sm sm:text-base font-medium text-foreground">
                    +250 798 636 824
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Form card */}
          <div className="order-1 lg:order-2 bg-white rounded-2xl shadow-sm border border-border/40 p-6 sm:p-8">
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 sm:mb-5">
                  <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-muted-foreground px-4">
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="text-xs font-medium text-foreground"
                  >
                    Name
                  </Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Angel Ineza"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white rounded-lg border-0 h-10 sm:h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-business"
                    className="text-xs font-medium text-foreground"
                  >
                    Business Type
                  </Label>
                  <Input
                    id="contact-business"
                    required
                    placeholder="Market Vendor, Shop Owner"
                    value={formData.businessType}
                    onChange={(e) =>
                      setFormData({ ...formData, businessType: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white rounded-lg border-0 h-10 sm:h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-info"
                    className="text-xs font-medium text-foreground"
                  >
                    Email or Phone
                  </Label>
                  <Input
                    id="contact-info"
                    required
                    placeholder="angelineza@example.com"
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white rounded-lg border-0 h-10 sm:h-11 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-message"
                    className="text-xs font-medium text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="contact-message"
                    required
                    placeholder="Type your message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    disabled={isSubmitting}
                    className="bg-white rounded-lg border-0 text-sm resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 rounded-full text-sm font-semibold flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Send className="w-3 h-3" />
                  </div>
                  {isSubmitting ? "Sending..." : "Get a Solution"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
