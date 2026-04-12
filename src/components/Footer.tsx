'use client';

import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

const footerNav = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/#shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = [
  { icon: Instagram, color: "#E1306C", label: "Instagram" },
  { icon: Facebook, color: "#1877F2", label: "Facebook" },
];

const contactInfo = [
  { icon: MapPin, text: "3455 S Durango Dr, Las Vegas NV" },
  { icon: Phone, text: "+1 (702) 555-0123" },
  { icon: Mail, text: "hello@heranmart.com" },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        background: "#0D0D0D",
        borderColor: "rgba(193,163,106,0.12)",
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 h-px w-[600px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(193,163,106,0.4), transparent)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <span
                className="font-[family-name:var(--font-playfair)] text-2xl font-bold tracking-wider"
                style={{
                  color: "#C1A36A",
                  textShadow: "0 0 20px rgba(193,163,106,0.4)",
                }}
              >
                HERAN
              </span>
              <span
                className="text-xs font-light uppercase tracking-[0.25em]"
                style={{ color: "rgba(193,163,106,0.5)" }}
              >
                Mart
              </span>
            </Link>
            <p
              className="mb-6 max-w-xs text-sm font-light leading-relaxed"
              style={{ color: "rgba(245,245,245,0.45)" }}
            >
              Your neighborhood market — elevated. Fresh essentials, polite service,
              and everyday convenience in Las Vegas.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, color, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[rgba(193,163,106,0.12)] bg-[rgba(255,255,255,0.04)] text-[rgba(245,245,245,0.5)] transition-all duration-200"
                  style={{ '--social-color': color } as React.CSSProperties}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${color}20`;
                    e.currentTarget.style.borderColor = `${color}40`;
                    e.currentTarget.style.color = color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(193,163,106,0.12)";
                    e.currentTarget.style.color = "rgba(245,245,245,0.5)";
                  }}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="mb-5 text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: "rgba(193,163,106,0.6)" }}
            >
              Navigate
            </h4>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-[rgba(245,245,245,0.45)] transition-colors duration-200 hover:text-[#C1A36A]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4
              className="mb-5 text-xs font-medium uppercase tracking-[0.3em]"
              style={{ color: "rgba(193,163,106,0.6)" }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2">
                  <Icon size={13} className="mt-0.5 shrink-0" style={{ color: "rgba(193,163,106,0.5)" }} />
                  <span className="text-sm font-light" style={{ color: "rgba(245,245,245,0.45)" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[rgba(193,163,106,0.08)] pt-6 sm:flex-row"
        >
          <p className="text-xs font-light" style={{ color: "rgba(245,245,245,0.25)" }}>
            © {new Date().getFullYear()} HERAN Mart. All rights reserved.
          </p>
          <p className="text-xs font-light" style={{ color: "rgba(245,245,245,0.2)" }}>
            Las Vegas, Nevada
          </p>
        </div>
      </div>
    </footer>
  );
}
