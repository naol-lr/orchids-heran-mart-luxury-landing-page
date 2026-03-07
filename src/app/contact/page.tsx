"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, CheckCircle } from "lucide-react";

// Store hours — simple hardcoded logic for demo
function useStoreOpen() {
  const now = new Date();
  const hour = now.getHours();
  // Open 7:00 AM – 11:00 PM every day
  const isOpen = hour >= 7 && hour < 23;
  return { isOpen, closesAt: "11:00 PM" };
}

const hours = [
  { day: "Monday – Friday", time: "7:00 AM – 11:00 PM" },
  { day: "Saturday", time: "8:00 AM – 11:00 PM" },
  { day: "Sunday", time: "9:00 AM – 10:00 PM" },
];

export default function ContactPage() {
  const { isOpen, closesAt } = useStoreOpen();
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });
  const infoRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh" }}>
      <Navbar />

      {/* Page header */}
      <div className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span
            className="text-xs tracking-[0.4em] uppercase font-light mb-4 block"
            style={{ color: "rgba(212,175,55,0.6)" }}
          >
            Reach Us
          </span>
          <h1
            className="font-[family-name:var(--font-playfair)] font-bold"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#F5F5F5" }}
          >
            Contact &amp; Location
          </h1>
          <p
            className="mt-4 text-base font-light max-w-lg mx-auto"
            style={{ color: "rgba(245,245,245,0.45)" }}
          >
            We&apos;re always happy to hear from you. Visit us, call us, or send a message.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* Top row: Store Info + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Store status card */}
          <motion.div
            ref={infoRef}
            initial={{ opacity: 0, x: -40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-8"
            style={{
              background: "rgba(26,26,26,0.7)",
              border: isOpen
                ? "1px solid rgba(74,222,128,0.3)"
                : "1px solid rgba(212,175,55,0.15)",
              boxShadow: isOpen
                ? "0 0 40px rgba(74,222,128,0.08), 0 8px 32px rgba(0,0,0,0.4)"
                : "0 8px 32px rgba(0,0,0,0.4)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Open / Closed badge */}
            <div className="flex items-center gap-3 mb-8">
              <div
                className="relative flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  background: isOpen
                    ? "rgba(74,222,128,0.1)"
                    : "rgba(239,68,68,0.1)",
                  border: `1px solid ${isOpen ? "rgba(74,222,128,0.4)" : "rgba(239,68,68,0.3)"}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: isOpen ? "#4ade80" : "#ef4444",
                    boxShadow: isOpen
                      ? "0 0 8px rgba(74,222,128,0.8)"
                      : "0 0 8px rgba(239,68,68,0.8)",
                    animation: isOpen ? "pulse-glow 2s ease-in-out infinite" : "none",
                  }}
                />
                <span
                  className="text-sm font-semibold tracking-wider"
                  style={{ color: isOpen ? "#4ade80" : "#ef4444" }}
                >
                  {isOpen ? "OPEN NOW" : "CLOSED"}
                </span>
              </div>
              {isOpen && (
                <span className="text-xs" style={{ color: "rgba(245,245,245,0.4)" }}>
                  Closes at {closesAt}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <MapPin size={16} style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>
                  Store Address
                </p>
                <p className="text-sm font-light" style={{ color: "rgba(245,245,245,0.5)" }}>
                  3455 S Durango Dr, Suite 110<br />Las Vegas, NV 89117
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <Phone size={16} style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>Phone</p>
                <a
                  href="tel:+17025550123"
                  className="text-sm font-light transition-colors duration-200"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D4AF37")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)")}
                >
                  +1 (702) 555-0123
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}
              >
                <Mail size={16} style={{ color: "#D4AF37" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>Email</p>
                <a
                  href="mailto:hello@heranmart.com"
                  className="text-sm font-light transition-colors duration-200"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#D4AF37")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)")}
                >
                  hello@heranmart.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} style={{ color: "rgba(212,175,55,0.6)" }} />
                <span
                  className="text-xs tracking-[0.25em] uppercase font-light"
                  style={{ color: "rgba(212,175,55,0.6)" }}
                >
                  Opening Hours
                </span>
              </div>
              <div className="space-y-2">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center py-2"
                    style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}>
                    <span className="text-sm font-light" style={{ color: "rgba(245,245,245,0.5)" }}>{h.day}</span>
                    <span className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl overflow-hidden relative"
            style={{
              border: "1px solid rgba(212,175,55,0.15)",
              minHeight: 400,
              background: "rgba(26,26,26,0.7)",
            }}
          >
            <iframe
              title="HERAN Mart Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3224.123456789!2d-115.2804!3d36.1217!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c8c43bc1a40b15%3A0x9b7a7a7a7a7a7a7a!2sLas+Vegas%2C+NV!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(92%) hue-rotate(180deg) saturate(0.6) brightness(0.85)",
                minHeight: 400,
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Gold overlay frame */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ border: "1px solid rgba(212,175,55,0.15)" }}
            />
          </motion.div>
        </div>

        {/* Bottom row: Contact form + Social */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Form */}
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-8"
            style={{
              background: "rgba(26,26,26,0.7)",
              border: "1px solid rgba(212,175,55,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <h3
              className="font-[family-name:var(--font-playfair)] font-semibold text-2xl mb-6"
              style={{ color: "#F5F5F5" }}
            >
              Send a Message
            </h3>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-12"
              >
                <CheckCircle size={48} style={{ color: "#4ade80" }} />
                <p className="text-lg font-medium" style={{ color: "#F5F5F5" }}>Message sent!</p>
                <p className="text-sm font-light" style={{ color: "rgba(245,245,245,0.5)" }}>We&apos;ll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {[
                  { id: "name", label: "Your Name", type: "text", placeholder: "John Doe" },
                  { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="block text-xs tracking-[0.2em] uppercase mb-2 font-light"
                      style={{ color: "rgba(212,175,55,0.6)" }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      value={form[field.id as "name" | "email"]}
                      onChange={(e) => setForm((f) => ({ ...f, [field.id]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)";
                        (e.target as HTMLElement).style.boxShadow = "0 0 15px rgba(212,175,55,0.1)";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.15)";
                        (e.target as HTMLElement).style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-[0.2em] uppercase mb-2 font-light"
                    style={{ color: "rgba(212,175,55,0.6)" }}
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(212,175,55,0.15)",
                      color: "#F5F5F5",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.5)";
                      (e.target as HTMLElement).style.boxShadow = "0 0 15px rgba(212,175,55,0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = "rgba(212,175,55,0.15)";
                      (e.target as HTMLElement).style.boxShadow = "none";
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all duration-300"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)",
                    color: "#0D0D0D",
                    boxShadow: "0 4px 20px rgba(212,175,55,0.3)",
                  }}
                >
                  <Send size={15} />
                  Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* Social & quick info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="rounded-3xl p-8 flex flex-col justify-between"
            style={{
              background: "rgba(26,26,26,0.7)",
              border: "1px solid rgba(212,175,55,0.15)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div>
              <h3
                className="font-[family-name:var(--font-playfair)] font-semibold text-2xl mb-2"
                style={{ color: "#F5F5F5" }}
              >
                Stay Connected
              </h3>
              <p
                className="text-sm font-light mb-8"
                style={{ color: "rgba(245,245,245,0.45)" }}
              >
                Follow us for daily deals, fresh arrivals, and community news.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Instagram, label: "@heranmart", sub: "Follow on Instagram", color: "#E1306C" },
                  { icon: Facebook, label: "HERAN Mart", sub: "Like on Facebook", color: "#1877F2" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(212,175,55,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.3)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.1)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}
                      >
                        <Icon size={18} style={{ color: s.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#F5F5F5" }}>{s.label}</p>
                        <p className="text-xs font-light" style={{ color: "rgba(245,245,245,0.4)" }}>{s.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gold divider */}
            <div
              className="my-8 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)" }}
            />

            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(135deg, rgba(27,48,34,0.5) 0%, rgba(27,48,34,0.2) 100%)",
                border: "1px solid rgba(74,222,128,0.2)",
              }}
            >
              <p
                className="text-xs tracking-[0.25em] uppercase font-light mb-1"
                style={{ color: "rgba(74,222,128,0.6)" }}
              >
                Quick Tip
              </p>
              <p className="text-sm font-light" style={{ color: "rgba(245,245,245,0.65)" }}>
                For fastest service, call us directly during store hours or visit in person. We love seeing our customers!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
