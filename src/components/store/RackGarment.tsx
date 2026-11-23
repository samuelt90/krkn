
import Image from "next/image";
import type { StoreProduct } from "@/lib/store-products";

type Props = {
  product: StoreProduct;
  active: boolean;
  onSelect: () => void;
};

export default function RackGarment({
  product,
  active,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label={`Ver ${product.name}`}
      aria-pressed={active}
      onClick={onSelect}
      className="relative block h-full w-full select-none outline-none"
    >
      <Image
        src={product.image}
        alt={product.name}
        fill
        draggable={false}
        sizes="(max-width: 767px) 52vw, 176px"
        className="pointer-events-none select-none object-fill"
      />
    </button>
  );
}
