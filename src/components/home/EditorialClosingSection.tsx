
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function EditorialClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        ".closing-line",
        {
          yPercent: 110,
        },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.14,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".closing-meta",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".closing-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 58%",
            once: true,
          },
        }
      );
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explorar-krkn"
      aria-labelledby="closing-title"
      className="relative isolate flex min-h-[85svh] flex-col justify-between overflow-hidden bg-[#191919] text-[#f0eee8] lg:min-h-screen"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-[1600px] items-center justify-between px-5 pt-8 md:px-10 lg:px-16 lg:pt-12">
        <span className="closing-meta text-[11px] uppercase tracking-[0.22em] text-white/45">
          06 / KRKN
        </span>
        <span className="closing-meta text-[11px] uppercase tracking-[0.22em] text-white/45">
          END OF CAMPAIGN
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-5 py-20 md:px-10 lg:px-16">
        <h2
          id="closing-title"
          className="font-editorial text-[clamp(5.5rem,16vw,18rem)] uppercase leading-[0.76] tracking-[-0.035em]"
        >
          <span className="block overflow-hidden pb-[0.1em]">
            <span className="closing-line block">EL DROP</span>
          </span>

          <span className="block overflow-hidden pb-[0.1em]">
            <span className="closing-line block">TE ESPERA.</span>
          </span>
        </h2>

        <p className="closing-meta mt-8 max-w-sm text-sm text-white/55 md:mt-12 md:text-base">
          Explora las piezas de KRKN.
        </p>
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-5 pb-8 md:px-10 lg:px-16 lg:pb-12">
        <div className="closing-rule h-px origin-left bg-white/35" />

        <Link
          href="/tienda"
          className="group flex min-h-24 items-center justify-between gap-6 py-6 outline-offset-4 lg:min-h-32"
        >
          <span className="font-editorial text-[clamp(2rem,4.5vw,5rem)] uppercase leading-none transition-transform duration-500 ease-out group-hover:translate-x-2">
            EXPLORAR LA TIENDA
          </span>

          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 group-hover:bg-white group-hover:text-[#191919] md:h-20 md:w-20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-7 w-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:h-9 md:w-9"
              aria-hidden="true"
            >
              <path d="M5 19 19 5M7 5h12v12" />
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
