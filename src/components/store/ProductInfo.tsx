
import { StoreProduct, formatPrice } from "@/lib/store-products";

type Props = {
  product: StoreProduct | null;
  size: string | null;
  quantity: number;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onAdd: () => void;
};

export default function ProductInfo({
  product,
  size,
  quantity,
  onSizeChange,
  onQuantityChange,
  onAdd,
}: Props) {
  if (!product) return null;

  const canAdd = product.price !== null && size !== null;

  return (
    <section
      aria-label="Información de la prenda seleccionada"
      className="border-t border-black/20 py-7 lg:border-l lg:border-t-0 lg:px-10 lg:py-0"
    >
      <p className="text-[10px] uppercase tracking-[0.2em] text-black/45">
        PIEZA SELECCIONADA
      </p>

      <h2 className="font-editorial mt-5 text-[clamp(3rem,5vw,5.5rem)] uppercase leading-[0.9]">
        {product.name}
      </h2>

      <p className="mt-5 text-sm text-black/60">
        {product.description}
      </p>

      <p className="mt-8 text-xl font-semibold">
        {formatPrice(product.price)}
      </p>

      <div className="mt-10">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em]">
          TALLA
        </p>

        <div className="flex flex-wrap gap-2">
          {product.sizes.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSizeChange(option)}
              aria-pressed={size === option}
              className={`flex h-12 w-12 items-center justify-center border text-xs font-semibold transition-colors ${
                size === option
                  ? "border-[#191919] bg-[#191919] text-white"
                  : "border-black/20 hover:border-black"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em]">
          CANTIDAD
        </p>

        <div className="flex w-36 items-center justify-between border border-black/20">
          <button
            type="button"
            onClick={() =>
              onQuantityChange(Math.max(1, quantity - 1))
            }
            aria-label="Reducir cantidad"
            className="h-12 w-12 text-xl"
          >
            −
          </button>

          <span className="text-sm">{quantity}</span>

          <button
            type="button"
            onClick={() => onQuantityChange(quantity + 1)}
            aria-label="Aumentar cantidad"
            className="h-12 w-12 text-xl"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={onAdd}
        disabled={!canAdd}
        className="mt-10 flex min-h-14 w-full items-center justify-between bg-[#191919] px-5 text-xs font-semibold tracking-[0.1em] text-white transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-35"
      >
        <span>AGREGAR AL CARRITO</span>
        <span aria-hidden="true">↗</span>
      </button>

      {product.price === null && (
        <p className="mt-3 text-xs text-black/45">
          Pendiente de asignar precio al producto.
        </p>
      )}
    </section>
  );
}
