
"use client";

import { useEffect } from "react";
import Image from "next/image";
import { StoreProduct, formatPrice } from "@/lib/store-products";

export type CartItem = {
  product: StoreProduct;
  size: string;
  quantity: number;
};

type Props = {
  open: boolean;
  items: CartItem[];
  onClose: () => void;
  onRemove: (id: string, size: string) => void;
};

export default function CartDrawer({
  open,
  items,
  onClose,
  onRemove,
}: Props) {
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const total = items.reduce(
    (sum, item) =>
      sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-[100] transition-visibility duration-300 ${
        open ? "visible" : "invisible"
      }`}
    >
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className={`absolute inset-0 bg-black/55 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compra"
        className={`absolute bottom-0 right-0 flex h-[90dvh] w-full flex-col bg-[#e9e6df] transition-transform duration-500 ease-out md:bottom-0 md:top-0 md:h-full md:max-w-[480px] ${
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"
        }`}
      >
        <div className="flex items-center justify-between border-b border-black/20 px-6 py-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-black/50">
              KRKN
            </p>
            <h2 className="font-editorial mt-1 text-4xl">
              TU CARRITO
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="text-sm text-black/50">
              Todavía no has agregado prendas.
            </p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="flex gap-5 border-b border-black/15 pb-6"
                >
                  <div className="relative h-32 w-28 shrink-0 bg-black/5">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="font-editorial text-2xl">
                      {item.product.name}
                    </h3>

                    <p className="mt-2 text-xs text-black/55">
                      TALLA {item.size} · CANT. {item.quantity}
                    </p>

                    <p className="mt-3 text-sm font-semibold">
                      {formatPrice(
                        (item.product.price ?? 0) * item.quantity
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        onRemove(item.product.id, item.size)
                      }
                      className="mt-auto w-fit pt-3 text-[10px] uppercase tracking-[0.1em] underline underline-offset-4"
                    >
                      ELIMINAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-black/20 p-6">
          <div className="mb-5 flex justify-between text-sm font-semibold">
            <span>SUBTOTAL</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            type="button"
            disabled
            className="flex h-14 w-full items-center justify-center bg-[#191919] text-xs font-semibold tracking-[0.12em] text-white disabled:opacity-35"
          >
            FINALIZAR COMPRA
          </button>

          <p className="mt-3 text-center text-[11px] text-black/45">
            La finalización de compra se conectará en la siguiente fase.
          </p>
        </div>
      </aside>
    </div>
  );
}
