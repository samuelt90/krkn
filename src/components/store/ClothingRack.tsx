
"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import gsap from "gsap";
import type { StoreProduct } from "@/lib/store-products";
import RackGarment from "./RackGarment";

type Props = {
  products: StoreProduct[];
  selectedId: string | null;
  onSelect: (product: StoreProduct) => void;
  onOpen: (product: StoreProduct, source: DOMRect) => void;
};

type Slot = {
  key: string;
  index: number;
  product: StoreProduct;
};

const clamp = (n: number, a: number, b: number) =>
  Math.max(a, Math.min(b, n));

const IMAGE_RATIO = 1402 / 1122;

export default function ClothingRack({
  products,
  selectedId,
  onSelect,
  onOpen,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const latestRef = useRef<string | null>(null);
  const ignoreClickRef = useRef(false);

  const pointerRef = useRef({
    active: false,
    dragged: false,
    startX: 0,
    startValue: 0,
    lastValue: 0,
    lastTime: 0,
    velocity: 0,
  });

  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const metalId = useId().replace(/:/g, "");

  const loop = products.length > 2;
  const quantity = loop ? 5 : 1;

  const slots = useMemo<Slot[]>(
    () =>
      Array.from(
        { length: products.length * quantity },
        (_, i) => ({
          key: `${Math.floor(i / products.length)}-${
            products[i % products.length].id
          }`,
          index: i,
          product: products[i % products.length],
        })
      ),
    [products, quantity]
  );

  const metrics = useCallback(() => {
    const view = viewportRef.current?.clientWidth ?? 0;
    const small = view < 768;

    const garment = small
      ? clamp(view * 0.49, 155, 205)
      : clamp(view * 0.15, 128, 176);

    return {
      view,
      small,
      garment,
      gap: garment * (small ? 1.08 : 1.16),
      edge: small ? 54 : 63,
      sag: small ? 32 : 41,
    };
  }, []);

  const bounds = useCallback((): [number, number] => {
    if (!products.length) return [0, 0];

    return loop
      ? [products.length, products.length * 4 - 1]
      : [0, products.length - 1];
  }, [products.length, loop]);

  const renderPosition = useCallback(
    (raw: number) => {
      const { view, garment, gap, edge, sag } = metrics();
      if (!view || !products.length) return;

      const [min, max] = bounds();
      const position = clamp(raw, min, max);
      cursorRef.current = position;

      for (const slot of slots) {
        const element = slotRefs.current[slot.index];
        if (!element) continue;

        const distance = slot.index - position;
        const centerX = view / 2 + distance * gap;

        const visible =
          centerX > -garment &&
          centerX < view + garment;

        if (!visible) {
          element.style.visibility = "hidden";
          element.style.pointerEvents = "none";
          continue;
        }

        const t = clamp(centerX / view, 0, 1);

        const tubeY =
          edge + 4 * sag * t * (1 - t);

        const scale =
          Math.abs(distance) < 0.48 ? 1.035 : 1;

        element.style.visibility = "visible";
        element.style.pointerEvents = "auto";

        element.style.width = `${garment}px`;
        element.style.height = `${
          garment * IMAGE_RATIO
        }px`;

        element.style.zIndex = `${
          10 - Math.min(9, Math.round(Math.abs(distance)))
        }`;

        element.style.transformOrigin = "50% 0%";

        element.style.transform = `
          translate3d(
            ${centerX - garment / 2}px,
            ${tubeY - 12}px,
            0
          )
          scale(${scale})
        `;
      }

      const closest =
        slots[
          clamp(
            Math.round(position),
            0,
            slots.length - 1
          )
        ];

      if (!closest) return;

      const actual = products.findIndex(
        (item) => item.id === closest.product.id
      );

      setIndex((prev) =>
        prev === actual ? prev : actual
      );

      if (latestRef.current !== closest.product.id) {
        latestRef.current = closest.product.id;
        onSelect(closest.product);
      }
    },
    [bounds, metrics, onSelect, products, slots]
  );

  const moveTo = useCallback(
    (target: number, finished?: () => void) => {
      if (!products.length) return;

      tweenRef.current?.kill();

      const [min, max] = bounds();
      const end = clamp(Math.round(target), min, max);

      const state = { value: cursorRef.current };

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      tweenRef.current = gsap.to(state, {
        value: end,
        duration: reduced
          ? 0
          : clamp(
              Math.abs(end - state.value) * 0.2,
              0.45,
              0.9
            ),
        ease: "power3.out",

        onUpdate: () => renderPosition(state.value),

        onComplete: () => {
          renderPosition(end);
          finished?.();

          if (loop) {
            const normalized =
              ((end % products.length) +
                products.length) %
              products.length;

            renderPosition(
              products.length * 2 + normalized
            );
          }
        },
      });
    },
    [bounds, loop, products.length, renderPosition]
  );

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const resize = new ResizeObserver(() => {
      setWidth(node.clientWidth);
      renderPosition(cursorRef.current);
    });

    resize.observe(node);

    return () => resize.disconnect();
  }, [renderPosition]);

  useEffect(() => {
    tweenRef.current?.kill();
    latestRef.current = null;

    const start = loop ? products.length * 2 : 0;
    cursorRef.current = start;

    const frame = requestAnimationFrame(() =>
      renderPosition(start)
    );

    return () => {
      cancelAnimationFrame(frame);
      tweenRef.current?.kill();
    };
  }, [loop, products, renderPosition]);

  useEffect(() => {
    const node = viewportRef.current;
    if (!node || products.length < 2) return;

    let settle: number | undefined;

    const onWheel = (event: WheelEvent) => {
      if (
        !event.shiftKey &&
        Math.abs(event.deltaX) <= Math.abs(event.deltaY)
      ) {
        return;
      }

      event.preventDefault();
      tweenRef.current?.kill();

      const delta = event.shiftKey
        ? event.deltaY
        : event.deltaX;

      renderPosition(
        cursorRef.current + delta / metrics().gap
      );

      window.clearTimeout(settle);

      settle = window.setTimeout(() => {
        moveTo(cursorRef.current);
      }, 100);
    };

    node.addEventListener("wheel", onWheel, {
      passive: false,
    });

    return () => {
      node.removeEventListener("wheel", onWheel);
      window.clearTimeout(settle);
    };
  }, [metrics, moveTo, products.length, renderPosition]);

  const onPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      event.pointerType === "mouse" &&
      event.button !== 0
    ) {
      return;
    }

    tweenRef.current?.kill();

    pointerRef.current = {
      active: true,
      dragged: false,
      startX: event.clientX,
      startValue: cursorRef.current,
      lastValue: cursorRef.current,
      lastTime: performance.now(),
      velocity: 0,
    };
  };

  const onPointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const pointer = pointerRef.current;
    if (!pointer.active) return;

    const dx = event.clientX - pointer.startX;

    if (!pointer.dragged && Math.abs(dx) < 8) {
      return;
    }

    if (!pointer.dragged) {
      pointer.dragged = true;
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    }

    const now = performance.now();

    const next =
      pointer.startValue - dx / metrics().gap;

    const [min, max] = bounds();
    const constrained = clamp(next, min, max);

    pointer.velocity =
      (constrained - pointer.lastValue) /
      Math.max(1, now - pointer.lastTime);

    pointer.lastValue = constrained;
    pointer.lastTime = now;

    renderPosition(constrained);
  };

  const onPointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const pointer = pointerRef.current;
    if (!pointer.active) return;

    pointer.active = false;

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    if (!pointer.dragged) return;

    ignoreClickRef.current = true;

    window.setTimeout(() => {
      ignoreClickRef.current = false;
    }, 150);

    moveTo(
      cursorRef.current +
        clamp(pointer.velocity * 125, -1.25, 1.25)
    );
  };

  const openSlot = (slot: Slot) => {
    if (ignoreClickRef.current) return;

    const open = () => {
      const target =
        slotRefs.current[slot.index]?.querySelector(
          "button"
        );

      if (target) {
        onOpen(
          slot.product,
          target.getBoundingClientRect()
        );
      }
    };

    if (
      Math.abs(cursorRef.current - slot.index) > 0.1
    ) {
      moveTo(slot.index, open);
    } else {
      open();
    }
  };

  const go = (offset: number) =>
    moveTo(cursorRef.current + offset);

  const currentMetrics =
    width < 768
      ? { edge: 54, sag: 32 }
      : { edge: 63, sag: 41 };

  const path = `
    M 0 ${currentMetrics.edge}
    Q ${width / 2}
      ${currentMetrics.edge + 2 * currentMetrics.sag}
      ${width}
      ${currentMetrics.edge}
  `;

  const highlight = `
    M 0 ${currentMetrics.edge - 2.5}
    Q ${width / 2}
      ${
        currentMetrics.edge +
        2 * currentMetrics.sag -
        2.5
      }
      ${width}
      ${currentMetrics.edge - 2.5}
  `;

  if (!products.length) {
    return (
      <section className="flex h-[350px] items-center justify-center">
        <p className="font-editorial text-5xl">
          PRÓXIMAMENTE.
        </p>
      </section>
    );
  }

  return (
    <section className="relative isolate z-0 w-full overflow-hidden">
      <div
        ref={viewportRef}
        role="region"
        aria-label="Perchero KRKN: usa las flechas para cambiar de prenda y Enter para abrirla"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          }

          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }

          if (event.key === "Enter") {
            const slot =
              slots[Math.round(cursorRef.current)];

            if (slot) openSlot(slot);
          }
        }}
        className="relative h-[390px] w-full cursor-grab overflow-hidden select-none outline-none active:cursor-grabbing md:h-[430px]"
        style={{ touchAction: "pan-y" }}
      >
        {slots.map((slot) => (
          <div
            key={slot.key}
            ref={(node) => {
              slotRefs.current[slot.index] = node;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ visibility: "hidden" }}
          >
            <RackGarment
              product={slot.product}
              active={selectedId === slot.product.id}
              onSelect={() => openSlot(slot)}
            />
          </div>
        ))}

        {width > 0 && (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 w-full"
            height={
              currentMetrics.edge +
              currentMetrics.sag +
              20
            }
            viewBox={`0 0 ${width} ${
              currentMetrics.edge +
              currentMetrics.sag +
              20
            }`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id={metalId}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0"
                  stopColor="#b8b8b5"
                />
                <stop
                  offset="0.34"
                  stopColor="#666660"
                />
                <stop
                  offset="0.66"
                  stopColor="#343432"
                />
                <stop
                  offset="1"
                  stopColor="#8a8a86"
                />
              </linearGradient>
            </defs>

            <path
              d={path}
              transform="translate(0 3.5)"
              fill="none"
              stroke="#131310"
              strokeOpacity="0.16"
              strokeWidth="12"
            />

            <path
              d={path}
              fill="none"
              stroke="#292925"
              strokeWidth="10"
            />

            <path
              d={path}
              fill="none"
              stroke={`url(#${metalId})`}
              strokeWidth="7.2"
            />

            <path
              d={highlight}
              fill="none"
              stroke="#fafaf9"
              strokeOpacity="0.65"
              strokeWidth="1.15"
            />
          </svg>
        )}
      </div>

      <div className="mx-auto flex max-w-[620px] items-center justify-between border-t border-black/15 px-5 py-4">
        <button
          type="button"
          aria-label="Prenda anterior"
          disabled={!loop && index === 0}
          onClick={() => go(-1)}
          className="text-2xl disabled:opacity-25"
        >
          ←
        </button>

        <div className="text-center">
          <span className="text-[11px] font-semibold tracking-[0.16em]">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-2 text-black/35">
              {" "}
              /{" "}
            </span>
            {String(products.length).padStart(2, "0")}
          </span>

          <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-black/50 md:hidden">
            DESLIZA PARA EXPLORAR
          </p>

          <p className="mt-1 hidden text-[9px] uppercase tracking-[0.14em] text-black/50 md:block">
            ARRASTRA PARA EXPLORAR
          </p>
        </div>

        <button
          type="button"
          aria-label="Prenda siguiente"
          disabled={
            !loop && index === products.length - 1
          }
          onClick={() => go(1)}
          className="text-2xl disabled:opacity-25"
        >
          →
        </button>
      </div>
    </section>
  );
}
