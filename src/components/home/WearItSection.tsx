
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type Tee = "black" | "archive";

const LOOKS: Record<Tee, Record<"on" | "off", string>> = {
  black: {
    off: "/images/wear-it/look-black.png",
    on: "/images/wear-it/look-black-bomber.png",
  },
  archive: {
    off: "/images/wear-it/look-archive.png",
    on: "/images/wear-it/look-archive-bomber.png",
  },
};

export default function WearItSection() {
  const [tee, setTee] = useState<Tee>("black");
  const [bomber, setBomber] = useState(false);
  const [editorial, setEditorial] = useState(false);
  const [visibleLook, setVisibleLook] = useState(LOOKS.black.off);

  const imageRef = useRef<HTMLImageElement>(null);
  const requestRef = useRef(0);

  const selectedLook = LOOKS[tee][bomber ? "on" : "off"];

  useEffect(() => {
    if (selectedLook === visibleLook) return;

    const request = ++requestRef.current;
    const preload = new Image();
    preload.src = selectedLook;

    preload.onload = () => {
      if (request !== requestRef.current) return;

      const image = imageRef.current;
      if (!image) return;

      gsap.killTweensOf(image);

      gsap.to(image, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          if (request !== requestRef.current) return;
          setVisibleLook(selectedLook);

          requestAnimationFrame(() => {
            const current = imageRef.current;
            if (!current) return;

            gsap.fromTo(
              current,
              { opacity: 0, y: 8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.45,
                ease: "power3.out",
              }
            );
          });
        },
      });
    };

    return () => {
      preload.onload = null;
    };
  }, [selectedLook, visibleLook]);

  return (
    <section
      id="wear-it"
      aria-labelledby="wear-it-title"
      className="relative overflow-hidden bg-[#d6d3cb] text-[#1a1a1a]"
    >
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 lg:px-16 lg:py-20">
        <header className="relative z-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-black/55">
            03 / KRKN
          </p>

          <h2
            id="wear-it-title"
            className="font-editorial mt-3 text-[clamp(5rem,12vw,11rem)] uppercase leading-[0.78]"
          >
            WEAR IT
          </h2>
        </header>

        <div className="relative mt-8 grid items-center gap-8 lg:mt-0 lg:min-h-[690px] lg:grid-cols-[minmax(220px,1fr)_minmax(350px,1.65fr)_minmax(200px,1fr)] lg:gap-4">
          <div
            className={[
              "order-2 relative z-20 lg:order-1",
              "transition-all duration-500",
              editorial
                ? "pointer-events-none opacity-0 lg:-translate-x-5"
                : "opacity-100",
            ].join(" ")}
            aria-hidden={editorial}
          >
            <div className="max-w-[340px]">
              <div className="border-t border-black/25 pt-5">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Camiseta
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={editorial}
                    onClick={() => setTee("black")}
                    aria-pressed={tee === "black"}
                    className={[
                      "min-h-14 border px-3 text-left text-sm transition-colors",
                      tee === "black"
                        ? "border-black bg-[#1a1a1a] text-white"
                        : "border-black/25 hover:border-black",
                    ].join(" ")}
                  >
                    Washed Black
                  </button>

                  <button
                    type="button"
                    disabled={editorial}
                    onClick={() => setTee("archive")}
                    aria-pressed={tee === "archive"}
                    className={[
                      "min-h-14 border px-3 text-left text-sm transition-colors",
                      tee === "archive"
                        ? "border-black bg-[#1a1a1a] text-white"
                        : "border-black/25 hover:border-black",
                    ].join(" ")}
                  >
                    Archive
                  </button>
                </div>
              </div>

              <div className="mt-8 border-t border-black/25 pt-5">
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  Capa exterior
                </p>

                <button
                  type="button"
                  disabled={editorial}
                  onClick={() => setBomber((value) => !value)}
                  aria-pressed={bomber}
                  className={[
                    "flex min-h-14 w-full items-center justify-between border px-4 text-left text-sm transition-colors",
                    bomber
                      ? "border-black bg-[#1a1a1a] text-white"
                      : "border-black/25 hover:border-black",
                  ].join(" ")}
                >
                  <span>Black Bomber</span>
                  <span className="text-xl" aria-hidden="true">
                    {bomber ? "−" : "+"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="order-1 relative flex h-[440px] items-end justify-center sm:h-[570px] lg:order-2 lg:h-[690px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[5%] left-1/2 h-[65%] w-[80%] -translate-x-1/2 rounded-full bg-white/20 blur-[65px]"
            />

            <img
              ref={imageRef}
              src={visibleLook}
              alt={`Modelo KRKN con camiseta ${
                tee === "black" ? "negra" : "crema"
              }${bomber ? " y bomber negra" : ""}, pantalón cargo oliva`}
              draggable={false}
              className={[
                "relative z-10 h-full w-full object-contain object-bottom",
                "transition-transform duration-700",
                editorial ? "scale-[1.045]" : "scale-100",
              ].join(" ")}
            />
          </div>

          <div className="order-3 relative z-20 flex flex-col items-start justify-end gap-6 lg:items-end lg:text-right">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-black/50">
                LOOK 01
              </p>

              <p className="font-editorial mt-3 max-w-[270px] text-[clamp(2.5rem,4vw,5rem)] uppercase leading-[0.9]">
                {tee === "black" ? "WASHED BLACK" : "ARCHIVE"}
                {bomber ? " / BOMBER" : ""}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEditorial((value) => !value)}
              aria-pressed={editorial}
              className="min-h-12 border border-[#1a1a1a] bg-[#1a1a1a] px-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-transparent hover:text-[#1a1a1a]"
            >
              {editorial ? "EDITAR LOOK" : "VER LOOK"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
