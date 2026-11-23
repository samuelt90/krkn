
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Detail = {
  id: string;
  image: string;
  title: string;
  description: string;
};

type Chapter = {
  number: string;
  title: string;
  details: [Detail, Detail];
};

const chapters: Chapter[] = [
  {
    number: "01",
    title: "SUPERFICIE",
    details: [
      {
        id: "01",
        image: "/images/details/detail-01.png",
        title: "WASHED COTTON",
        description: "Textura de algodón negro lavado.",
      },
      {
        id: "02",
        image: "/images/details/detail-02.png",
        title: "GRAPHIC PRINT",
        description: "Estampado sobre tejido de algodón.",
      },
    ],
  },
  {
    number: "02",
    title: "ESTRUCTURA",
    details: [
      {
        id: "03",
        image: "/images/details/detail-03.png",
        title: "CARGO POCKET",
        description: "Bolsillo exterior y costuras.",
      },
      {
        id: "04",
        image: "/images/details/detail-04.png",
        title: "BAGGY FIT",
        description: "Volumen y caída del pantalón.",
      },
    ],
  },
  {
    number: "03",
    title: "ACABADOS",
    details: [
      {
        id: "05",
        image: "/images/details/detail-05.png",
        title: "ZIP DETAIL",
        description: "Cierre metálico de la bomber.",
      },
      {
        id: "06",
        image: "/images/details/detail-06.png",
        title: "RIBBED CUFF",
        description: "Puño acanalado y terminaciones.",
      },
    ],
  },
];

const allDetails = chapters.flatMap((chapter) => chapter.details);

export default function TheDetailsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState<Detail | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        ".details-heading",
        { yPercent: 24, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        }
      );

      gsap.utils
        .toArray<HTMLElement>(".details-chapter")
        .forEach((chapter) => {
          const images = chapter.querySelectorAll(".details-photo");
          const copy = chapter.querySelector(".details-chapter-heading");

          gsap.fromTo(
            images,
            { y: 75, opacity: 0, scale: 1.055 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.1,
              stagger: 0.16,
              ease: "power3.out",
              scrollTrigger: {
                trigger: chapter,
                start: "top 82%",
                once: true,
              },
            }
          );

          if (copy) {
            gsap.fromTo(
              copy,
              { y: 32, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: chapter,
                  start: "top 80%",
                  once: true,
                },
              }
            );
          }

          if (window.innerWidth >= 1024) {
            const photos = chapter.querySelectorAll<HTMLElement>(
              ".details-parallax"
            );

            photos.forEach((photo, index) => {
              gsap.fromTo(
                photo,
                { yPercent: index === 0 ? -5 : 5 },
                {
                  yPercent: index === 0 ? 5 : -5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: chapter,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                  },
                }
              );
            });
          }
        });
    }, section);

    return () => context.revert();
  }, []);

  useEffect(() => {
    if (!selected) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);

      if (event.key === "ArrowRight") {
        const index = allDetails.findIndex(
          (detail) => detail.id === selected.id
        );
        setSelected(allDetails[(index + 1) % allDetails.length]);
      }

      if (event.key === "ArrowLeft") {
        const index = allDetails.findIndex(
          (detail) => detail.id === selected.id
        );
        setSelected(
          allDetails[
            (index - 1 + allDetails.length) % allDetails.length
          ]
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selected]);

  const changeDetail = (direction: -1 | 1) => {
    if (!selected) return;

    const index = allDetails.findIndex(
      (detail) => detail.id === selected.id
    );

    setSelected(
      allDetails[
        (index + direction + allDetails.length) % allDetails.length
      ]
    );
  };

  return (
    <section
      ref={sectionRef}
      id="the-details"
      aria-labelledby="details-title"
      className="relative overflow-hidden bg-[#191919] text-[#f1efea]"
    >
      <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-20 md:px-10 lg:px-16 lg:pb-36 lg:pt-28">
        <header className="details-heading mb-16 lg:mb-28">
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
            04 / KRKN
          </p>

          <h2
            id="details-title"
            className="font-editorial mt-4 text-[clamp(5rem,13vw,13rem)] uppercase leading-[0.8] tracking-[-0.025em]"
          >
            THE
            <br />
            DETAILS
          </h2>
        </header>

        <div className="space-y-24 md:space-y-32 lg:space-y-44">
          {chapters.map((chapter, chapterIndex) => (
            <article
              key={chapter.number}
              className="details-chapter relative"
            >
              <div className="details-chapter-heading mb-7 flex items-end justify-between border-t border-white/25 pt-5 lg:mb-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-editorial text-3xl text-white/45">
                    {chapter.number}
                  </span>

                  <h3 className="font-editorial text-[clamp(2.5rem,5vw,5.5rem)] uppercase leading-none">
                    {chapter.title}
                  </h3>
                </div>

                <span className="hidden text-[10px] uppercase tracking-[0.18em] text-white/40 sm:block">
                  KRKN / DETAILS
                </span>
              </div>

              <div
                className={[
                  "grid items-start gap-5 md:gap-8 lg:gap-10",
                  "lg:grid-cols-12",
                ].join(" ")}
              >
                {chapter.details.map((detail, index) => {
                  const isPrimary = index === 0;

                  const layout =
                    chapterIndex === 1
                      ? isPrimary
                        ? "lg:col-span-5 lg:mt-28"
                        : "lg:col-span-7"
                      : isPrimary
                        ? "lg:col-span-7"
                        : "lg:col-span-5 lg:mt-24";

                  return (
                    <button
                      key={detail.id}
                      type="button"
                      onClick={() => setSelected(detail)}
                      aria-label={`Ampliar ${detail.title}`}
                      className={[
                        "details-photo group min-w-0 text-left",
                        layout,
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "relative overflow-hidden bg-[#272727]",
                          isPrimary
                            ? "aspect-[4/5] sm:aspect-[5/4]"
                            : "aspect-[4/5]",
                        ].join(" ")}
                      >
                        <div className="details-parallax absolute -inset-y-[8%] inset-x-0">
                          <img
                            src={detail.image}
                            alt={detail.description}
                            loading="lazy"
                            draggable={false}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                          />
                        </div>

                        <span
                          aria-hidden="true"
                          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center border border-white/50 bg-black/20 text-2xl backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-black"
                        >
                          +
                        </span>
                      </div>

                      <div className="mt-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="font-editorial text-2xl uppercase leading-none md:text-3xl">
                            {detail.title}
                          </p>
                          <p className="mt-2 text-xs text-white/50">
                            {detail.description}
                          </p>
                        </div>

                        <span className="text-[11px] text-white/40">
                          {detail.id} / 06
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle ampliado: ${selected.title}`}
          className="fixed inset-0 z-[100] flex flex-col bg-[#101010] text-white"
        >
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4 md:px-10">
            <span className="text-[11px] uppercase tracking-[0.2em]">
              KRKN / {selected.id} — 06
            </span>

            <button
              ref={closeRef}
              type="button"
              onClick={() => setSelected(null)}
              className="min-h-11 border border-white/35 px-5 text-[11px] uppercase tracking-[0.14em] transition-colors hover:bg-white hover:text-black"
            >
              CERRAR
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4 py-6 md:px-20">
            <img
              key={selected.id}
              src={selected.image}
              alt={selected.description}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="flex items-end justify-between gap-4 border-t border-white/15 px-5 py-5 md:px-10">
            <div>
              <p className="font-editorial text-3xl uppercase leading-none md:text-5xl">
                {selected.title}
              </p>
              <p className="mt-2 text-xs text-white/55">
                {selected.description}
              </p>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => changeDetail(-1)}
                aria-label="Detalle anterior"
                className="flex h-12 w-12 items-center justify-center border border-white/35 text-xl transition-colors hover:bg-white hover:text-black"
              >
                ←
              </button>

              <button
                type="button"
                onClick={() => changeDetail(1)}
                aria-label="Detalle siguiente"
                className="flex h-12 w-12 items-center justify-center border border-white/35 text-xl transition-colors hover:bg-white hover:text-black"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
