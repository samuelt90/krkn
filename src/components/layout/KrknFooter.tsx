
"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navigation = [
  { label: "INICIO", href: "/" },
  { label: "TIENDA", href: "/tienda" },
  { label: "EL DROP", href: "/#el-drop" },
  { label: "WEAR IT", href: "/#wear-it" },
  { label: "THE DETAILS", href: "/#the-details" },
  { label: "IN MOTION", href: "/#krkn-in-motion" },
];

export default function KrknFooter() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const footer = footerRef.current;
    if (!footer) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".footer-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 85%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".footer-wordmark",
        { yPercent: 35, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".footer-brand",
            start: "top 90%",
            once: true,
          },
        }
      );
    }, footer);

    return () => context.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#e9e6df] text-[#191919]"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-14 md:px-10 lg:px-16 lg:pt-20">
        <div className="grid gap-14 border-t border-black/30 pt-7 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="footer-reveal lg:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
              KRKN / GUATEMALA
            </p>

            <h2 className="font-editorial mt-6 max-w-[420px] text-[clamp(3.5rem,6vw,7rem)] uppercase leading-[0.85] tracking-[-0.025em]">
              STREETWEAR
              <br />
              CULTURE.
            </h2>
          </div>

          <nav
            aria-label="Navegación del pie de página"
            className="footer-reveal lg:col-span-4"
          >
            <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-black/50">
              EXPLORAR
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="w-fit text-xs font-medium uppercase tracking-[0.09em] transition-opacity hover:opacity-45"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="footer-reveal lg:col-span-3">
            <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-black/50">
              CONTACTO
            </p>

            <p className="text-sm">Guatemala</p>

            <p className="mt-4 max-w-[230px] text-xs leading-relaxed text-black/55">
              Para consultas sobre prendas, pedidos y colaboraciones.
            </p>
          </div>
        </div>

        <div className="footer-brand mt-24 overflow-hidden border-b border-black/30 pb-2 lg:mt-36">
          <div
            aria-label="KRKN"
            className="footer-wordmark font-editorial text-[clamp(9rem,28vw,34rem)] uppercase leading-[0.68] tracking-[-0.075em]"
          >
            KRKN
          </div>
        </div>

        <div className="flex flex-col gap-5 py-6 text-[10px] uppercase tracking-[0.12em] text-black/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} KRKN</span>

          <span>GUATEMALA / STREETWEAR</span>

          <Link
            href="/"
            className="w-fit text-black transition-opacity hover:opacity-50"
          >
            VOLVER AL INICIO ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
