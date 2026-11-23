
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const motionImages = {
  street: "/images/motion/motion-01.png",
  posters: "/images/motion/motion-02.png",
  identity: "/images/motion/motion-03.png",
  collective: "/images/motion/motion-04.png",
};

export default function KrknInMotionSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      const mm = gsap.matchMedia();

      gsap.fromTo(
        ".motion-intro-line",
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.15,
          stagger: 0.13,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".motion-intro",
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".motion-street-image",
        { clipPath: "inset(0 100% 0 0)", scale: 1.12 },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.5,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".motion-street",
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".motion-street-caption",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".motion-street",
            start: "top 65%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".motion-poster",
        {
          y: (index) => (index === 0 ? 100 : -70),
          rotation: (index) => (index === 0 ? -6 : 5),
          opacity: 0,
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".motion-art",
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".motion-identity-copy > *",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.13,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".motion-identity",
            start: "top 72%",
            once: true,
          },
        }
      );

      gsap.fromTo(
        ".motion-identity-image",
        { clipPath: "inset(12% 0 12% 0)", scale: 1.12 },
        {
          clipPath: "inset(0% 0 0% 0)",
          scale: 1,
          duration: 1.25,
          ease: "power3.inOut",
          scrollTrigger: {
            trigger: ".motion-identity",
            start: "top 75%",
            once: true,
          },
        }
      );

      mm.add("(min-width: 1024px)", () => {
        gsap.to(".motion-street-photo", {
          yPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".motion-street",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.to(".motion-art-backdrop", {
          xPercent: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".motion-art",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        gsap.fromTo(
          ".motion-collective-frame",
          {
            clipPath: "inset(12% 15% 12% 15%)",
            scale: 1.06,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".motion-collective",
              start: "top 85%",
              end: "top 10%",
              scrub: 1,
            },
          }
        );
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          ".motion-collective-frame",
          { clipPath: "inset(8% 5% 8% 5%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: ".motion-collective",
              start: "top 90%",
              end: "top 35%",
              scrub: 1,
            },
          }
        );
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="krkn-in-motion"
      aria-labelledby="motion-title"
      className="relative overflow-hidden bg-[#e9e6df] text-[#171717]"
    >
      {/* INTRO */}
      <div className="motion-intro relative mx-auto max-w-[1600px] px-5 pb-16 pt-24 md:px-10 lg:px-16 lg:pb-24 lg:pt-32">
        <div className="flex items-center justify-between border-t border-black/30 pt-4">
          <span className="text-[11px] uppercase tracking-[0.22em]">
            05 / KRKN
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            STREET CULTURE
          </span>
        </div>

        <h2
          id="motion-title"
          className="font-editorial mt-12 text-[clamp(5.4rem,15vw,16rem)] uppercase leading-[0.75] tracking-[-0.035em]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="motion-intro-line block">KRKN IN</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="motion-intro-line block">MOTION</span>
          </span>
        </h2>
      </div>

      {/* ESCENA 01: LA CALLE */}
      <div className="motion-street relative mx-auto max-w-[1600px] px-5 pb-24 md:px-10 lg:px-16 lg:pb-40">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.4fr)] lg:items-end lg:gap-10">
          <div className="motion-street-image relative aspect-[4/5] overflow-hidden bg-[#d1cec6] sm:aspect-[5/4] lg:aspect-[16/11]">
            <img
              src={motionImages.street}
              alt="Modelo con camiseta gráfica y pantalón cargo caminando junto a un mural urbano."
              className="motion-street-photo absolute -inset-y-[12%] inset-x-0 h-[124%] w-full object-cover"
              draggable={false}
            />
            <span className="absolute left-4 top-4 text-[10px] uppercase tracking-[0.2em] text-white mix-blend-difference md:left-6 md:top-6">
              01 / LA CALLE
            </span>
          </div>

          <div className="motion-street-caption border-t border-black/35 pt-4 lg:mb-5">
            <span className="text-[10px] uppercase tracking-[0.22em] text-black/50">
              URBAN ENVIRONMENT
            </span>
            <p className="font-editorial mt-5 max-w-[350px] text-[clamp(2.6rem,4vw,5rem)] uppercase leading-[0.91]">
              LA CALLE
              <br />
              TAMBIÉN
              <br />
              VISTE.
            </p>
          </div>
        </div>
      </div>

      {/* ESCENA 02: ARTE URBANO */}
      <div className="motion-art relative isolate overflow-hidden bg-[#b8b2a6] py-24 lg:py-40">
        <div
          aria-hidden="true"
          className="motion-art-backdrop pointer-events-none absolute -left-[10%] top-1/2 w-[125%] -translate-y-1/2 select-none whitespace-nowrap font-editorial text-[clamp(13rem,35vw,40rem)] uppercase leading-none tracking-[-0.05em] text-black/[0.065]"
        >
          STREET / STREET
        </div>

        <div className="relative mx-auto grid max-w-[1500px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-8 lg:px-16">
          <div className="lg:col-span-5">
            <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-black/60">
              02 / ARTE URBANO
            </p>
            <h3 className="font-editorial text-[clamp(4.5rem,9vw,10rem)] uppercase leading-[0.78] tracking-[-0.03em]">
              CAPAS
              <br />
              DE
              <br />
              CALLE.
            </h3>
            <p className="mt-7 max-w-xs text-sm leading-relaxed text-black/65">
              Pintura, carteles, concreto y prendas que conviven
              con el paisaje urbano.
            </p>
          </div>

          <div className="relative min-h-[480px] sm:min-h-[650px] lg:col-span-7 lg:min-h-[750px]">
            <div className="motion-poster absolute left-[3%] top-[4%] w-[76%] -rotate-[4deg] bg-[#ece9e1] p-2 shadow-[0_25px_65px_rgba(0,0,0,0.18)] sm:w-[67%] lg:left-[5%] lg:w-[65%]">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={motionImages.posters}
                  alt="Modelo con prendas oversized junto a una pared cubierta de carteles urbanos."
                  className="h-full w-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>

            <div className="motion-poster absolute bottom-[3%] right-[1%] w-[48%] rotate-[5deg] bg-[#242424] p-2 shadow-[0_25px_65px_rgba(0,0,0,0.2)] sm:w-[43%] lg:w-[46%]">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={motionImages.street}
                  alt="Detalle de campaña streetwear junto a un mural."
                  className="h-full w-full object-cover object-[65%_center]"
                  loading="lazy"
                  draggable={false}
                />
              </div>
            </div>

            <span
              aria-hidden="true"
              className="absolute bottom-[10%] left-[2%] -rotate-6 border-2 border-[#b3382b] px-4 py-2 font-editorial text-4xl uppercase text-[#b3382b] sm:text-6xl"
            >
              KRKN / GT
            </span>
          </div>
        </div>
      </div>

      {/* ESCENA 03: IDENTIDAD */}
      <div className="motion-identity bg-[#1b1b1b] text-[#f0eee8]">
        <div className="mx-auto grid max-w-[1600px] lg:min-h-[850px] lg:grid-cols-2">
          <div className="motion-identity-image relative aspect-[4/5] overflow-hidden bg-[#303030] sm:aspect-[5/4] lg:order-2 lg:aspect-auto lg:min-h-[850px]">
            <img
              src={motionImages.identity}
              alt="Modelo con bomber negra y pantalón cargo sentado en escaleras urbanas."
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              draggable={false}
            />
          </div>

          <div className="motion-identity-copy flex flex-col justify-between px-5 py-12 md:px-10 lg:px-16 lg:py-20">
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">
              03 / KRKN — GUATEMALA
            </span>

            <div className="my-16 lg:my-0">
              <h3 className="font-editorial text-[clamp(4.5rem,8vw,9rem)] uppercase leading-[0.79] tracking-[-0.025em]">
                STREETWEAR
                <br />
                EN
                <br />
                MOVIMIENTO.
              </h3>

              <p className="mt-9 max-w-[430px] text-sm leading-[1.85] text-white/65 md:text-base">
                KRKN es una propuesta de streetwear que combina
                siluetas oversized, piezas gráficas y una estética
                influenciada por la cultura urbana. Ropa pensada
                para explorar distintas formas de vestir.
              </p>
            </div>

            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
              KRKN / STREET CULTURE
            </span>
          </div>
        </div>
      </div>

      {/* ESCENA 04: COLECTIVO */}
      <div className="motion-collective relative overflow-hidden bg-[#e9e6df] pt-24 lg:pt-36">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 lg:px-16">
          <div className="mb-10 flex items-center justify-between border-t border-black/30 pt-4">
            <span className="text-[11px] uppercase tracking-[0.2em]">
              04 / COLECTIVO
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-black/50">
              KRKN IN MOTION
            </span>
          </div>

          <h3 className="font-editorial mb-12 text-[clamp(4rem,10vw,11rem)] uppercase leading-[0.82] tracking-[-0.03em]">
            LA CULTURA
            <br />
            NO SE DETIENE.
          </h3>
        </div>

        <div className="motion-collective-frame relative aspect-[4/5] w-full overflow-hidden bg-[#bcb8b0] sm:aspect-[16/10] lg:aspect-[16/8]">
          <img
            src={motionImages.collective}
            alt="Cuatro modelos con prendas streetwear en una cancha urbana rodeada de grafitis."
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            draggable={false}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />

          <span className="absolute bottom-5 left-5 font-editorial text-[clamp(3rem,8vw,9rem)] uppercase leading-none text-white md:bottom-10 md:left-10">
            KRKN / GT
          </span>
        </div>
      </div>
    </section>
  );
}
