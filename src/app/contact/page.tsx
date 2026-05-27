'use client';

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Send, CheckCircle, Youtube } from "lucide-react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Store hours logic
const openingHours = [
  { dayIndex: 1, dayName: "Monday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 2, dayName: "Tuesday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 3, dayName: "Wednesday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 4, dayName: "Thursday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 5, dayName: "Friday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 6, dayName: "Saturday", time: "10:00 AM – 9:00 PM", openHour: 10, closeHour: 21 },
  { dayIndex: 0, dayName: "Sunday", time: "10:00 AM – 8:00 PM", openHour: 10, closeHour: 20 },
];

function useStoreOpen() {
  const [isOpen, setIsOpen] = useState(false);
  const [closesAt, setClosesAt] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/Los_Angeles",
          hour: "numeric",
          minute: "numeric",
          weekday: "long",
          hour12: false
        });

        const parts = formatter.formatToParts(now);
        const partMap = Object.fromEntries(parts.map(p => [p.type, p.value]));

        const dayName = partMap.weekday;
        const hour = parseInt(partMap.hour, 10);
        const minute = parseInt(partMap.minute, 10);
        const timeInHours = hour + minute / 60;

        const dayIndexMap: { [key: string]: number } = {
          Sunday: 0,
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6
        };
        const day = dayIndexMap[dayName];

        const schedule = openingHours.find(h => h.dayIndex === day);
        if (schedule) {
          const open = timeInHours >= schedule.openHour && timeInHours < schedule.closeHour;
          setIsOpen(open);
          
          // Format closing time
          const closesAtHour12 = schedule.closeHour > 12 ? schedule.closeHour - 12 : schedule.closeHour;
          setClosesAt(`${closesAtHour12}:00 PM`);
        }
        setCurrentDayIndex(day);
      } catch (err) {
        console.error("Error calculating timezone-aware store status:", err);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return { isOpen, closesAt, currentDayIndex };
}

const socialLinks = [
    { icon: Instagram, label: "@heranmart", sub: "Follow on Instagram", color: "#E1306C", href: "#" },
    { icon: Facebook, label: "HERAN Mart", sub: "Like on Facebook", color: "#1877F2", href: "#" },
    { icon: Youtube, label: "@heran.mart3", sub: "Watch on TikTok", color: "#000000", href: "https://www.tiktok.com/@heran.mart3/video/7593497112403397902" },
];

export default function ContactPage() {
  const { isOpen, closesAt, currentDayIndex } = useStoreOpen();
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });
  const infoRef = useRef(null);
  const infoInView = useInView(infoRef, { once: true, margin: "-60px" });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let success = false;
      if (db) {
        try {
          await addDoc(collection(db, 'messages'), {
            name: form.name,
            email: form.email,
            message: form.message,
            createdAt: serverTimestamp(),
          });
          success = true;
        } catch (err) {
          console.warn("Client DB write failed, trying API:", err);
        }
      }

      if (!success) {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
        
        if (!res.ok) {
          throw new Error('Failed to send message');
        }
      }

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
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
            style={{ color: "rgba(193,163,106,0.6)" }}
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
            We're always happy to hear from you. Visit us, call us, or send a message.
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
            animate={infoInView ? { 
              opacity: 1, 
              x: 0,
              borderColor: isOpen ? "rgba(74, 222, 128, 0.5)" : "rgba(239, 68, 68, 0.45)",
              boxShadow: isOpen 
                ? "0 0 50px rgba(74, 222, 128, 0.15), 0 0 100px rgba(74, 222, 128, 0.05), 0 8px 32px rgba(0, 0, 0, 0.5)" 
                : "0 0 50px rgba(239, 68, 68, 0.12), 0 0 100px rgba(239, 68, 68, 0.04), 0 8px 32px rgba(0, 0, 0, 0.5)"
            } : {}}
            transition={{ duration: 0.7 }}
            className="rounded-3xl p-8"
            style={{
              background: "rgba(26,26,26,0.7)",
              border: "1px solid",
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
                style={{ background: "rgba(193,163,106,0.1)", border: "1px solid rgba(193,163,106,0.2)" }}
              >
                <MapPin size={16} style={{ color: "#C1A36A" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>
                  Store Address
                </p>
                <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,245,245,0.5)" }}>
                7835 S Rainbow Blvd ste 26,<br />Las Vegas, NV 89139, United States
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(193,163,106,0.1)", border: "1px solid rgba(193,163,106,0.2)" }}
              >
                <Phone size={16} style={{ color: "#C1A36A" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>Phone</p>
                <a
                  href="tel:+17024789397"
                  className="text-sm font-light transition-colors duration-200"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C1A36A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)")}
                >
                  +1 (702) 478-9397
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(193,163,106,0.1)", border: "1px solid rgba(193,163,106,0.2)" }}
              >
                <Mail size={16} style={{ color: "#C1A36A" }} />
              </div>
              <div>
                <p className="text-sm font-medium mb-0.5" style={{ color: "#F5F5F5" }}>Email</p>
                <a
                  href="mailto:hello@heranmart.com"
                  className="text-sm font-light transition-colors duration-200"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#C1A36A")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)")}
                >
                  hello@heranmart.com
                </a>
              </div>
            </div>

            {/* Hours */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} style={{ color: "rgba(193,163,106,0.6)" }} />
                <span
                  className="text-xs tracking-[0.25em] uppercase font-light"
                  style={{ color: "rgba(193,163,106,0.6)" }}
                >
                  Opening Hours
                </span>
              </div>
              <div className="space-y-2.5">
                {openingHours.map((h) => {
                  const isToday = h.dayIndex === currentDayIndex;
                  return (
                    <div 
                      key={h.dayName} 
                      className="flex justify-between items-center py-2 px-3 rounded-xl transition-all duration-300"
                      style={{ 
                        background: isToday ? "rgba(193,163,106,0.06)" : "transparent",
                        border: isToday ? "1px solid rgba(193,163,106,0.15)" : "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-sm font-light" 
                          style={{ color: isToday ? "#C1A36A" : "rgba(245,245,245,0.5)" }}
                        >
                          {h.dayName}
                        </span>
                        {isToday && (
                          <span 
                            className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                            style={{ 
                              background: isOpen ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)",
                              color: isOpen ? "#4ade80" : "#ef4444",
                              border: `1px solid ${isOpen ? "rgba(74,222,128,0.2)" : "rgba(239,68,68,0.2)"}`
                            }}
                          >
                            Today
                          </span>
                        )}
                      </div>
                      <span 
                        className="text-sm font-medium" 
                        style={{ color: isToday ? "#F5F5F5" : "rgba(245,245,245,0.8)" }}
                      >
                        {h.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Map embed */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={infoInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="rounded-3xl overflow-hidden relative min-h-[280px] sm:min-h-[400px]"
            style={{
              border: "1px solid rgba(193,163,106,0.15)",
              background: "rgba(26,26,26,0.7)",
            }}
          >
            <iframe
              src="https://maps.google.com/maps?q=7835%20S%20Rainbow%20Blvd%20ste%2026,%20Las%20Vegas,%20NV%2089139&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(92%) hue-rotate(180deg) saturate(0.6) brightness(0.85)",
              }}
              className="min-h-[280px] sm:min-h-[400px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            {/* Gold overlay frame */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{ border: "1px solid rgba(193,163,106,0.15)" }}
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
              border: "1px solid rgba(193,163,106,0.15)",
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
                <p className="text-sm font-light" style={{ color: "rgba(245,245,245,0.5)" }}>We'll get back to you soon.</p>
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
                      style={{ color: "rgba(193,163,106,0.6)" }}
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
                        border: "1px solid rgba(193,163,106,0.15)",
                        color: "#F5F5F5",
                      }}
                      onFocus={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(193,163,106,0.5)";
                        (e.target as HTMLElement).style.boxShadow = "0 0 15px rgba(193,163,106,0.1)";
                      }}
                      onBlur={(e) => {
                        (e.target as HTMLElement).style.borderColor = "rgba(193,163,106,0.15)";
                        (e.target as HTMLElement).style.boxShadow = "none";
                      }}
                    />
                  </div>
                ))}

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs tracking-[0.2em] uppercase mb-2 font-light"
                    style={{ color: "rgba(193,163,106,0.6)" }}
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
                      border: "1px solid rgba(193,163,106,0.15)",
                      color: "#F5F5F5",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = "rgba(193,163,106,0.5)";
                      (e.target as HTMLElement).style.boxShadow = "0 0 15px rgba(193,163,106,0.1)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = "rgba(193,163,106,0.15)";
                      (e.target as HTMLElement).style.boxShadow = "none";
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #C1A36A 0%, #8E7A53 100%)",
                    color: "#0D0D0D",
                    boxShadow: "0 4px 20px rgba(193,163,106,0.3)",
                  }}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-[#0D0D0D]/30 border-t-[#0D0D0D] rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
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
              border: "1px solid rgba(193,163,106,0.15)",
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
                {socialLinks.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 group"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(193,163,106,0.1)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(193,163,106,0.3)";
                        (e.currentTarget as HTMLElement).style.background = "rgba(193,163,106,0.05)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(193,163,106,0.1)";
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
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Gold divider */}
            <div
              className="my-8 h-px"
              style={{ background: "linear-gradient(to right, transparent, rgba(193,163,106,0.3), transparent)" }}
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
