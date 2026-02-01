"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, Send, Instagram, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-zinc-900 to-black">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In <span className="text-[#FFD700]">Touch</span>
            </h1>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Have a question or ready to book? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Location</h3>
                      <p className="text-white/60">123 Hair Street, Lekki Phase 1</p>
                      <p className="text-white/60">Lagos, Nigeria</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Phone</h3>
                      <p className="text-white/60">+234 801 234 5678</p>
                      <p className="text-white/60">+234 802 345 6789</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Email</h3>
                      <p className="text-white/60">hello@layohair.com</p>
                      <p className="text-white/60">bookings@layohair.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FFD700]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Working Hours</h3>
                      <p className="text-white/60">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-white/60">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-white/60">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-10">
                  <h3 className="text-white font-semibold mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com/layohair"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-zinc-900 border border-[#FFD700]/20 rounded-xl flex items-center justify-center hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all"
                    >
                      <Instagram className="w-5 h-5 text-[#FFD700]" />
                    </a>
                    <a
                      href="https://wa.me/2348012345678"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-zinc-900 border border-[#FFD700]/20 rounded-xl flex items-center justify-center hover:bg-[#FFD700]/10 hover:border-[#FFD700]/50 transition-all"
                    >
                      <MessageCircle className="w-5 h-5 text-[#FFD700]" />
                    </a>
                  </div>
                </div>

                {/* Quick Book CTA */}
                <div className="mt-10 p-6 bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                  <h3 className="text-white font-semibold mb-2">Ready to Book?</h3>
                  <p className="text-white/60 text-sm mb-4">
                    Skip the wait and book your appointment online instantly.
                  </p>
                  <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
                    <Link href="/book">Book Appointment</Link>
                  </Button>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-zinc-900 rounded-2xl border border-[#FFD700]/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/60 mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline" className="border-[#FFD700]/50 text-[#FFD700]">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Full Name</label>
                      <Input
                        required
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Email Address</label>
                      <Input
                        required
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Phone Number</label>
                      <Input
                        placeholder="Enter your phone (optional)"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-white/70 text-sm mb-2 block">Message</label>
                      <textarea
                        required
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-md p-3 placeholder:text-white/40 resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
