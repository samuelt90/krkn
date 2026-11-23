
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import {
  getCategoryProducts,
  type StoreCategory,
  type StoreProduct,
} from "@/lib/store-products";
import CategorySelector from "./CategorySelector";
import ClothingRack from "./ClothingRack";
import ProductInfo from "./ProductInfo";
import CartDrawer, { type CartItem } from "./CartDrawer";

export default function KrknStore() {
  const [category, setCategory] =
    useState<StoreCategory>("drop");
  const [selectedId, setSelectedId] = useState("store-01");
  const [detailProduct, setDetailProduct] =
    useState<StoreProduct | null>(null);

  const [size, setSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const originRef = useRef<DOMRect | null>(null);
  const detailSurfaceRef = useRef<HTMLDivElement>(null);
  const detailImageRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const products = useMemo(
    () => getCategoryProducts(category),
    [category]
  );

  const selected = useMemo(
    () =>
      products.find((product) => product.id === selectedId) ??
      products[0] ??
      null,
    [products, selectedId]
  );

  const selectProduct = useCallback(
    (product: StoreProduct) => {
      setSelectedId(product.id);
    },
    []
  );

  const changeCategory = (next: StoreCategory) => {
    const nextProducts = getCategoryProducts(next);
    setCategory(next);
    setSelectedId(nextProducts[0]?.id ?? "");
    setSize(null);
    setQuantity(1);
  };

  const openProduct = useCallback(
    (product: StoreProduct, source: DOMRect) => {
      originRef.current = source;
      setDetailProduct(product);
      setSelectedId(product.id);
      setSize(null);
      setQuantity(1);
    },
    []
  );

  useEffect(() => {
    if (!detailProduct) return;

    const surface = detailSurfaceRef.current;
    const image = detailImageRef.current;
    const panel = detailPanelRef.current;
    const source = originRef.current;

    if (!surface || !image || !panel) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const target = image.getBoundingClientRect();

    const x = source
      ? source.left +
        source.width / 2 -
        (target.left + target.width / 2)
      : 0;

    const y = source
      ? source.top +
        source.height / 2 -
        (target.top + target.height / 2)
      : 0;

    const timeline = gsap.timeline();

    gsap.set(surface, { opacity: 1 });

    if (!reduced) {
      timeline.fromTo(
        image,
        {
          x,
          y,
          scaleX: source
            ? source.width / target.width
            : 0.8,
          scaleY: source
            ? source.height / target.height
            : 0.8,
          transformOrigin: "center center",
        },
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.75,
          ease: "power3.inOut",
        }
      );

      timeline.fromTo(
        panel,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.32"
      );
    } else {
      gsap.set([image, panel], {
        opacity: 1,
        clearProps: "transform",
      });
    }

    return () => {
      timeline.kill();
      document.body.style.overflow = previousOverflow;
    };
  }, [detailProduct]);

  const closeProduct = useCallback(() => {
    if (!detailProduct) return;

    const surface = detailSurfaceRef.current;
    const image = detailImageRef.current;
    const panel = detailPanelRef.current;
    const source = originRef.current;

    if (!surface || !image) {
      setDetailProduct(null);
      return;
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || !source) {
      setDetailProduct(null);
      return;
    }

    gsap.killTweensOf([surface, image, panel]);

    const current = image.getBoundingClientRect();

    const x =
      source.left +
      source.width / 2 -
      (current.left + current.width / 2);

    const y =
      source.top +
      source.height / 2 -
      (current.top + current.height / 2);

    gsap.to(panel, {
      opacity: 0,
      y: 15,
      duration: 0.22,
    });

    gsap.to(image, {
      x,
      y,
      scaleX: source.width / current.width,
      scaleY: source.height / current.height,
      duration: 0.58,
      ease: "power3.inOut",
    });

    gsap.to(surface, {
      opacity: 0,
      delay: 0.36,
      duration: 0.25,
      onComplete: () => {
        setDetailProduct(null);
      },
    });
  }, [detailProduct]);

  useEffect(() => {
    if (!detailProduct || cartOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProduct();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [detailProduct, cartOpen, closeProduct]);

  const addToCart = () => {
    if (
      !detailProduct ||
      !size ||
      detailProduct.price === null
    ) {
      return;
    }

    const product = detailProduct;
    const selectedSize = size;

    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.product.id === product.id &&
          item.size === selectedSize
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id &&
          item.size === selectedSize
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...current,
        { product, size: selectedSize, quantity },
      ];
    });

    setCartOpen(true);
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-[#f4f3ef] text-[#191919]">
      <header className="mx-auto flex max-w-[1600px] items-center justify-between border-b border-black/15 px-5 py-5 md:px-10 lg:px-16">
        <Link
          href="/"
          className="font-editorial text-3xl tracking-[-0.04em]"
        >
          KRKN
        </Link>

        <span className="hidden text-[10px] uppercase tracking-[0.2em] text-black/45 md:block">
          STREETWEAR / GUATEMALA
        </span>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="text-[11px] font-semibold tracking-[0.1em]"
        >
          CARRITO ({cartCount})
        </button>
      </header>

      <section className="mx-auto max-w-[1600px] px-5 pt-12 md:px-10 md:pt-14 lg:px-16">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-[10px] uppercase tracking-[0.24em] text-black/45">
            KRKN / THE COLLECTION
          </p>

          <h1 className="font-editorial mt-4 text-[clamp(4rem,8vw,8.5rem)] uppercase leading-[0.85] tracking-[-0.04em]">
            LA TIENDA.
          </h1>
        </div>

        <CategorySelector
          active={category}
          onChange={changeCategory}
        />
      </section>

      <div className="mt-9 md:mt-12">
        <ClothingRack
          products={products}
          selectedId={selected?.id ?? null}
          onSelect={selectProduct}
          onOpen={openProduct}
        />
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 border-t border-black/15 px-5 pb-24 pt-6 md:flex-row md:items-end md:justify-between md:px-10 lg:px-16">
        <div>
          <p className="text-[10px] uppercase tracking-[0.15em] text-black/45">
            PIEZA ACTUAL
          </p>

          <p className="font-editorial mt-2 text-3xl uppercase md:text-4xl">
            {selected?.name ?? "KRKN"}
          </p>
        </div>

        <p className="max-w-[260px] text-xs leading-relaxed text-black/50">
          Explora las prendas y selecciona una para ver sus detalles.
        </p>
      </div>

      {detailProduct && (
        <div
          ref={detailSurfaceRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${detailProduct.name}`}
          className="fixed inset-0 z-[1000] overflow-y-auto bg-[#f4f3ef]"
          style={{ opacity: 0 }}
        >
          <div className="mx-auto min-h-dvh max-w-[1600px] px-5 pb-14 md:px-10 lg:px-16">
            <div className="flex items-center justify-between border-b border-black/15 py-5">
              <span className="font-editorial text-3xl">
                KRKN
              </span>

              <button
                type="button"
                onClick={closeProduct}
                className="text-[11px] font-semibold uppercase tracking-[0.12em]"
              >
                CERRAR ×
              </button>
            </div>

            <div className="grid min-h-[calc(100dvh-85px)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,430px)] lg:gap-16">
              <div className="relative flex min-h-[43dvh] items-center justify-center md:min-h-[65dvh]">
                <div
                  ref={detailImageRef}
                  className="relative h-[43dvh] w-full max-w-[540px] md:h-[72dvh]"
                >
                  <Image
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    fill
                    sizes="(max-width: 1023px) 90vw, 540px"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div
                ref={detailPanelRef}
                className="pb-10 lg:pb-0"
              >
                <ProductInfo
                  product={detailProduct}
                  size={size}
                  quantity={quantity}
                  onSizeChange={setSize}
                  onQuantityChange={setQuantity}
                  onAdd={addToCart}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onRemove={(id, selectedSize) => {
          setCart((current) =>
            current.filter(
              (item) =>
                !(
                  item.product.id === id &&
                  item.size === selectedSize
                )
            )
          );
        }}
      />
    </main>
  );
}
