"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative border-t"
      style={{
        background: "#0D0D0D",
        borderColor: "rgba(212,175,55,0.12)",
      }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span
                className="font-[family-name:var(--font-playfair)] font-bold text-2xl tracking-wider"
                style={{
                  color: "#D4AF37",
                  textShadow: "0 0 20px rgba(212,175,55,0.4)",
                }}
              >
                HERAN
              </span>
              <span
                className="text-xs tracking-[0.25em] uppercase font-light"
                style={{ color: "rgba(212,175,55,0.5)" }}
              >
                Mart
              </span>
            </Link>
            <p
              className="text-sm font-light leading-relaxed max-w-xs mb-6"
              style={{ color: "rgba(245,245,245,0.45)" }}
            >
              Your neighborhood market — elevated. Fresh essentials, polite service,
              and everyday convenience in Las Vegas.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, color: "#E1306C", label: "Instagram" },
                { icon: Facebook, color: "#1877F2", label: "Facebook" },
              ].map(({ icon: Icon, color, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(212,175,55,0.12)",
                    color: "rgba(245,245,245,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${color}20`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
                    (e.currentTarget as HTMLElement).style.color = color;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.12)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(245,245,245,0.5)";
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
              className="text-xs tracking-[0.3em] uppercase font-medium mb-5"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              Navigate
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Shop", href: "/#shop" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light transition-colors duration-200"
                    style={{ color: "rgba(245,245,245,0.45)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.color = "#D4AF37")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.color =
                        "rgba(245,245,245,0.45)")
                    }
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
              className="text-xs tracking-[0.3em] uppercase font-medium mb-5"
              style={{ color: "rgba(212,175,55,0.6)" }}
            >
              Contact
            </h4>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "3455 S Durango Dr, Las Vegas NV" },
                { icon: Phone, text: "+1 (702) 555-0123" },
                { icon: Mail, text: "hello@heranmart.com" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-2 items-start">
                  <Icon size={13} className="mt-0.5 shrink-0" style={{ color: "rgba(212,175,55,0.5)" }} />
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
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
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
