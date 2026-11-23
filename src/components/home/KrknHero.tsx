
"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import gsap from "gsap";
import { heroModels } from "@/data/heroModels";

export default function KrknHero() {
  const [active, setActive] = useState(1);

  const sceneRef = useRef<HTMLElement>(null);
  const modelRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const selected = heroModels[active];

  // Animación inicial de los modelos
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        modelRefs.current.filter(Boolean),
        {
          y: 90,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.15,
          stagger: 0.13,
          ease: "power3.out",
        }
      );
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  // Reorganización de modelos al seleccionar
  useEffect(() => {
    modelRefs.current.forEach((element, index) => {
      if (!element) return;

      const offset = index - active;

      gsap.to(element, {
        xPercent: offset * 67,
        scale: offset === 0 ? 1 : 0.78,
        opacity: Math.abs(offset) === 2 ? 0.48 : 1,
        zIndex: offset === 0 ? 30 : 10 - Math.abs(offset),
        duration: 0.85,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });

    if (infoRef.current) {
      gsap.fromTo(
        infoRef.current,
        {
          y: 14,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }
  }, [active]);

  // Navegación mediante gestos móviles
  function onTouchStart(event: TouchEvent<HTMLElement>) {
    startX.current = event.touches[0].clientX;
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    if (startX.current === null) return;

    const delta =
      event.changedTouches[0].clientX - startX.current;

    if (Math.abs(delta) > 45) {
      setActive((current) =>
        Math.max(
          0,
          Math.min(
            heroModels.length - 1,
            current + (delta < 0 ? 1 : -1)
          )
        )
      );
    }

    startX.current = null;
  }

  function previousModel() {
    setActive((current) => Math.max(0, current - 1));
  }

  function nextModel() {
    setActive((current) =>
      Math.min(heroModels.length - 1, current + 1)
    );
  }

  return (
    <section
      ref={sceneRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Colección destacada KRKN"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[var(--krkn-concrete)] text-[var(--krkn-ink)]"
    >
      {/* Iluminación editorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#e8e5de_0%,transparent_65%)]"
      />

      {/* Cabecera */}
      <header className="relative z-40 flex items-center justify-between px-6 pt-7 md:px-12">
        <span className="font-editorial text-4xl font-extrabold tracking-[-0.06em]">
          KRKN
        </span>

        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-5 md:gap-8"
        >
          <a
            href="/coleccion"
            className="text-xs font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-60 md:text-sm"
          >
            Colección
          </a>

          <a
            href="/tienda"
            className="text-xs font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-60 md:text-sm"
          >
            Tienda
          </a>
        </nav>
      </header>

      {/* Titular editorial detrás de los modelos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[16%] z-0 w-full -translate-x-1/2 px-4 text-center md:top-[14%]"
      >
        <span className="block font-editorial text-[clamp(4.2rem,12vw,12rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.055em] text-[#aaa79f]">
          TU PRÓXIMO
          <br />
          FIT.
        </span>
      </div>

      {/* Escena interactiva */}
      <div className="relative flex min-h-[66svh] flex-1 items-center justify-center md:min-h-0">
        <div className="relative h-[62svh] w-full max-w-[1500px] md:h-[76svh]">
          {heroModels.map((model, index) => (
            <button
              key={model.id}
              ref={(element) => {
                modelRefs.current[index] = element;
              }}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Seleccionar ${model.name}`}
              aria-pressed={active === index}
              className="absolute bottom-0 left-1/2 h-full w-[76%] -translate-x-1/2 cursor-pointer touch-pan-y outline-none focus-visible:outline-2 focus-visible:outline-offset-[-8px] focus-visible:outline-black md:w-[38%]"
            >
              <img
                src={model.image}
                alt={`Modelo vistiendo ${model.name}`}
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-contain object-bottom"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Información de la prenda seleccionada */}
      <div className="relative z-40 flex items-end justify-between gap-4 px-6 pb-8 md:px-12 md:pb-12">
        <div
          ref={infoRef}
          className="max-w-[70%]"
          aria-live="polite"
        >
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]">
            {selected.category} / {selected.id}
          </p>

          <h1
            key={selected.id}
            className="font-editorial text-[clamp(2.8rem,5vw,6rem)] font-bold leading-[0.85] tracking-[-0.035em]"
          >
            {selected.name}
          </h1>

          <p className="mt-3 text-sm font-semibold">
            Q{selected.price.toFixed(2)}
          </p>
        </div>

        {/* Navegación de modelos */}
        <div className="flex items-center gap-3">
          <span className="mr-3 hidden text-[10px] font-semibold uppercase tracking-[0.16em] md:block">
            Explora los looks
          </span>

          <button
            type="button"
            onClick={previousModel}
            disabled={active === 0}
            aria-label="Modelo anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/30 text-xl transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
          >
            ←
          </button>

          <button
            type="button"
            onClick={nextModel}
            disabled={active === heroModels.length - 1}
            aria-label="Modelo siguiente"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-black/30 text-xl transition-colors hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
