
import {
  StoreCategory,
  storeCategories,
} from "@/lib/store-products";

type Props = {
  active: StoreCategory;
  onChange: (category: StoreCategory) => void;
};

export default function CategorySelector({
  active,
  onChange,
}: Props) {
  return (
    <nav
      aria-label="Categorías de productos"
      className="flex w-full gap-7 overflow-x-auto border-b border-black/20 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-12"
    >
      {storeCategories.map((category) => {
        const selected = category.id === active;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            aria-current={selected ? "true" : undefined}
            className={`relative shrink-0 pb-2 text-[11px] font-semibold tracking-[0.12em] transition-colors md:text-xs ${
              selected
                ? "text-[#191919]"
                : "text-black/40 hover:text-black/70"
            }`}
          >
            {category.label}

            <span
              className={`absolute inset-x-0 -bottom-[17px] h-[2px] bg-[#191919] transition-transform duration-300 ${
                selected ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
