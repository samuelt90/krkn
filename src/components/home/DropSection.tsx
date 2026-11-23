
"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { TouchEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  dropProducts,
} from "@/data/dropProducts";

gsap.registerPlugin(ScrollTrigger);

type Pose = {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
};

const desktopLayout = [
  { x: 0.12, y: 0.32, scale: 0.83, rotation: -8 },
  { x: 0.29, y: 0.68, scale: 0.77, rotation: 5 },
  { x: 0.45, y: 0.27, scale: 0.83, rotation: -4 },
  { x: 0.59, y: 0.66, scale: 0.91, rotation: 5 },
  { x: 0.77, y: 0.29, scale: 0.79, rotation: -5 },
  { x: 0.89, y: 0.68, scale: 0.83, rotation: 7 },
];

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export default function DropSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartRef = useRef<number | null>(null);

  const selectedRef = useRef<number | null>(null);
  const activeRef = useRef(0);
  const progressRef = useRef(0);

  const [selected, setSelected] = useState<number | null>(null);
  const [active, setActive] = useState(0);
  const [mobile, setMobile] = useState(false);

  const selectedProduct =
    selected === null ? null : dropProducts[selected];

  const getPose = useCallback(
    (
      index: number,
      width: number,
      height: number,
      isMobile: boolean
    ): Pose => {
      const chosen = selectedRef.current;

      if (isMobile) {
        const relative = index - activeRef.current;

        if (chosen !== null) {
          return {
            x: index === chosen
              ? width * 0.5
              : width * (index < chosen ? -0.5 : 1.5),
            y: height * 0.43,
            scale: index === chosen ? 1.12 : 0.65,
            rotation: 0,
            opacity: index === chosen ? 1 : 0,
            zIndex: index === chosen ? 30 : 1,
          };
        }

        return {
          x: width * 0.5 + relative * width * 0.65,
          y: height * 0.45 + Math.abs(relative) * 12,
          scale: relative === 0 ? 1 : 0.7,
          rotation: clamp(relative * 6, -12, 12),
          opacity: Math.abs(relative) > 1 ? 0 : 0.65,
          zIndex: 20 - Math.abs(relative),
        };
      }

      if (chosen !== null) {
        if (index === chosen) {
          return {
            x: width * 0.36,
            y: height * 0.49,
            scale: 1.28,
            rotation: 0,
            opacity: 1,
            zIndex: 30,
          };
        }

        const base = desktopLayout[index];

        return {
          x: width * (base.x < 0.5 ? 0.06 : 0.94),
          y: height * base.y,
          scale: 0.54,
          rotation: base.rotation,
          opacity: 0.13,
          zIndex: 1,
        };
      }

      const base = desktopLayout[index];
      const travel = progressRef.current - 0.5;

      return {
        x: width * base.x,
        y:
          height * base.y +
          travel * height * (index % 2 === 0 ? -0.09 : 0.09),
        scale: base.scale + travel * 0.035,
        rotation: base.rotation + travel * 5,
        opacity: 1,
        zIndex: 10 + index,
      };
    },
    []
  );

  const renderScene = useCallback(
    (duration = 0.8) => {
      const stage = stageRef.current;
      if (!stage) return;

      const width = stage.clientWidth;
      const height = stage.clientHeight;
      const isMobile = width < 768;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;

        const pose = getPose(
          index,
          width,
          height,
          isMobile
        );

        gsap.to(element, {
          x: pose.x,
          y: pose.y,
          xPercent: -50,
          yPercent: -50,
          scale: pose.scale,
          rotation: pose.rotation,
          opacity: pose.opacity,
          zIndex: pose.zIndex,
          duration,
          ease: "power3.inOut",
          overwrite: "auto",
        });
      });
    },
    [getPose]
  );

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const update = () => {
      const isMobile = stage.clientWidth < 768;
      setMobile(isMobile);
      renderScene(0);
    };

    const observer = new ResizeObserver(update);
    observer.observe(stage);
    update();

    return () => {
      observer.disconnect();
      gsap.killTweensOf(itemRefs.current.filter(Boolean));
    };
  }, [renderScene]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        progressRef.current = self.progress;

        if (
          selectedRef.current === null &&
          stageRef.current &&
          stageRef.current.clientWidth >= 768
        ) {
          renderScene(0.25);
        }
      },
    });

    return () => trigger.kill();
  }, [renderScene]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        selectedRef.current !== null
      ) {
        selectedRef.current = null;
        setSelected(null);
        renderScene();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () =>
      window.removeEventListener("keydown", onKeyDown);
  }, [renderScene]);

  function choose(index: number) {
    if (selectedRef.current === index) {
      close();
      return;
    }

    selectedRef.current = index;
    activeRef.current = index;

    setSelected(index);
    setActive(index);

    renderScene();
  }

  function close() {
    selectedRef.current = null;
    setSelected(null);
    renderScene();
  }

  function change(direction: number) {
    if (selectedRef.current !== null) return;

    const next = clamp(
      activeRef.current + direction,
      0,
      dropProducts.length - 1
    );

    activeRef.current = next;
    setActive(next);
    renderScene(0.65);
  }

  function touchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartRef.current = event.touches[0].clientX;
  }

  function touchEnd(event: TouchEvent<HTMLDivElement>) {
    if (touchStartRef.current === null) return;

    const delta =
      event.changedTouches[0].clientX -
      touchStartRef.current;

    touchStartRef.current = null;

    if (
      Math.abs(delta) > 45 &&
      selectedRef.current === null &&
      stageRef.current &&
      stageRef.current.clientWidth < 768
    ) {
      change(delta < 0 ? 1 : -1);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="drop"
      aria-label="Colección KRKN"
      className="relative isolate overflow-hidden bg-[var(--krkn-paper)] text-[var(--krkn-ink)]"
    >
      <div className="mx-auto max-w-[1600px] px-5 pt-12 md:px-12 md:pt-16">
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--krkn-muted)]">
              Colección / 001
            </p>

            <h2 className="font-editorial text-[clamp(4rem,8vw,9rem)] font-extrabold uppercase leading-[0.82] tracking-[-0.055em]">
              EL DROP
            </h2>
          </div>

          <span className="hidden text-xs font-semibold tracking-[0.15em] md:block">
            01 — 06
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px]">
        <div
          ref={stageRef}
          onTouchStart={touchStart}
          onTouchEnd={touchEnd}
          className="relative mt-3 h-[390px] w-full overflow-hidden touch-pan-y sm:h-[480px] md:mt-0 md:h-[clamp(440px,58vw,680px)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <span className="font-editorial text-[clamp(10rem,25vw,25rem)] font-extrabold leading-none tracking-[-0.08em] text-[#e1ded7]">
              001
            </span>
          </div>

          {dropProducts.map((product, index) => (
            <button
              key={product.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              type="button"
              onClick={() => choose(index)}
              aria-label={`Seleccionar ${product.name}`}
              aria-pressed={selected === index}
              tabIndex={
                mobile &&
                selected === null &&
                active !== index
                  ? -1
                  : selected !== null && selected !== index
                    ? -1
                    : 0
              }
              className="absolute left-0 top-0 h-[290px] w-[250px] cursor-pointer opacity-0 outline-none focus-visible:outline-2 focus-visible:outline-black sm:h-[350px] sm:w-[300px] md:h-[clamp(210px,29vw,380px)] md:w-[clamp(180px,23vw,330px)]"
              style={{
                transformOrigin: "center center",
                willChange: "transform, opacity",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                draggable={false}
                className="pointer-events-none h-full w-full select-none object-contain drop-shadow-[0_16px_16px_rgba(0,0,0,0.08)]"
              />
            </button>
          ))}

          {selectedProduct && (
            <div
              key={selectedProduct.id}
              className="pointer-events-none absolute inset-x-5 bottom-2 z-40 md:inset-x-auto md:bottom-auto md:right-[5%] md:top-1/2 md:w-[29%] md:-translate-y-1/2"
            >
              <div className="bg-[var(--krkn-paper)]/95 px-2 py-3 md:bg-transparent md:px-0">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--krkn-muted)]">
                  DROP 001 / {selectedProduct.id}
                </p>

                <h3 className="font-editorial text-[clamp(2.3rem,4.2vw,4.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em]">
                  {selectedProduct.name}
                </h3>

                <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[var(--krkn-muted)]">
                  {selectedProduct.category}
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Q{selectedProduct.price.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="relative z-40 mx-auto flex max-w-[1500px] items-center justify-between px-6 pb-10 pt-2 md:px-12 md:pb-14">
          {selected === null ? (
            <>
              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] md:block">
                Selecciona una prenda
              </span>

              <div className="flex w-full items-center justify-between md:w-auto md:gap-6">
                <button
                  type="button"
                  onClick={() => change(-1)}
                  disabled={active === 0}
                  aria-label="Prenda anterior"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/25 text-xl disabled:opacity-25 md:hidden"
                >
                  ←
                </button>

                <span className="text-xs font-semibold tabular-nums tracking-[0.18em]">
                  {String(active + 1).padStart(2, "0")} / 06
                </span>

                <button
                  type="button"
                  onClick={() => change(1)}
                  disabled={active === dropProducts.length - 1}
                  aria-label="Prenda siguiente"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/25 text-xl disabled:opacity-25 md:hidden"
                >
                  →
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={close}
              className="ml-auto border-b border-black pb-2 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-60"
            >
              ← Volver a explorar
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
