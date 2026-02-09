"use client";

import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  PhoneCall,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const BUSINESS = {
  phone: "+447350167537",
  phoneDisplay: "+44 7350 167537",
  email: "layohair5@gmail.com",
  whatsapp: "447350167537",
  location: "Lincoln, LN1 1RP, UK",
  instagram: "https://www.instagram.com/layo_hair5",
  hours: "Daily: 9:00 AM – 7:00 PM",
  defaultMessage: "Hi! I'd like to book an appointment at LAYO HAIR.",
};

function PhonePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-white/60 hover:text-[#FFD700] transition-colors cursor-pointer"
      >
        {BUSINESS.phoneDisplay}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-zinc-900 border border-[#FFD700]/20 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors"
            onClick={() => setOpen(false)}
          >
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <PhoneCall className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Call</span>
          </a>
          <a
            href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(BUSINESS.defaultMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors border-t border-white/5"
            onClick={() => setOpen(false)}
          >
            <div className="w-8 h-8 bg-[#25D366] rounded-lg flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-sm font-medium">WhatsApp</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Get In <span className="text-[#FFD700]">Touch</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto">
              Have a question or ready to book? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-10">
          <div className="container mx-auto px-4 max-w-2xl">
            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Location</h3>
                  <p className="text-white/60 text-sm">{BUSINESS.location}</p>
                </div>
              </div>

              {/* Phone - with popover */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Phone</h3>
                  <PhonePopover />
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Email</h3>
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="text-white/60 text-sm hover:text-[#FFD700] transition-colors"
                  >
                    {BUSINESS.email}
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">Hours</h3>
                  <p className="text-white/60 text-sm">{BUSINESS.hours}</p>
                </div>
              </div>

              {/* Follow Us - inline */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-[#FFD700]" />
                </div>
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold text-sm">Follow Us</h3>
                  <a
                    href={BUSINESS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-900 border border-[#FFD700]/20 rounded-lg flex items-center justify-center hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all"
                  >
                    <Instagram className="w-4 h-4 text-[#FFD700]" />
                  </a>
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(BUSINESS.defaultMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-zinc-900 border border-[#FFD700]/20 rounded-lg flex items-center justify-center hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FFD700]" />
                  </a>
                </div>
              </div>
            </div>

            {/* Collapsible Contact Form */}
            <div className="bg-zinc-900 rounded-2xl border border-[#FFD700]/10 overflow-hidden">
              <button
                onClick={() => {
                  setFormOpen(!formOpen);
                  if (submitted) setSubmitted(false);
                }}
                className="w-full flex items-center justify-between p-5 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Send className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-white font-semibold text-lg">Send a Message</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-white/40 transition-transform duration-300 ${
                    formOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  formOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-5 border-t border-white/5">
                  {submitted ? (
                    <div className="text-center py-8">
                      <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="w-7 h-7 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">
                        Message Sent!
                      </h3>
                      <p className="text-white/60 text-sm mb-4">
                        We&apos;ll get back to you within 24 hours.
                      </p>
                      <Button
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        size="sm"
                        className="border-[#FFD700]/50 text-[#FFD700] hover:bg-[#FFD700]/10"
                      >
                        Send Another
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                      {error && (
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          {error}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/70 text-xs mb-1.5 block">
                            Name *
                          </label>
                          <Input
                            required
                            placeholder="Your name"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                          />
                        </div>
                        <div>
                          <label className="text-white/70 text-xs mb-1.5 block">
                            Email *
                          </label>
                          <Input
                            required
                            type="email"
                            placeholder="Your email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/70 text-xs mb-1.5 block">
                          Phone
                        </label>
                        <Input
                          placeholder="Your phone (optional)"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="bg-zinc-800 border-zinc-700 text-white placeholder:text-white/30"
                        />
                      </div>

                      <div>
                        <label className="text-white/70 text-xs mb-1.5 block">
                          Message *
                        </label>
                        <textarea
                          required
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          rows={4}
                          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-3 placeholder:text-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700]/50 transition-all text-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
