
export type StoreCategory =
  | "drop"
  | "camisetas"
  | "pantalones"
  | "hoodies"
  | "chalecos"
  | "chaquetas";

export type StoreProduct = {
  id: string;
  name: string;
  category: Exclude<StoreCategory, "drop">;
  image: string;
  price: number | null;
  sizes: string[];
  description: string;
};

export const storeCategories: {
  id: StoreCategory;
  label: string;
}[] = [
  { id: "drop", label: "EL DROP" },
  { id: "camisetas", label: "CAMISETAS" },
  { id: "pantalones", label: "PANTALONES" },
  { id: "hoodies", label: "HOODIES" },
  { id: "chalecos", label: "CHALECOS" },
  { id: "chaquetas", label: "CHAQUETAS" },
];

export const storeProducts: StoreProduct[] = [
  {
    id: "store-01",
    name: "KRKN / BLACK GRAPHIC",
    category: "camisetas",
    image: "/images/store/store-01.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Camiseta oversized negra de acabado lavado.",
  },
  {
    id: "store-02",
    name: "KRKN / OLIVE CARGO",
    category: "pantalones",
    image: "/images/store/store-02.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Pantalón cargo oliva de silueta amplia.",
  },
  {
    id: "store-03",
    name: "KRKN / ARCHIVE TEE",
    category: "camisetas",
    image: "/images/store/store-03.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Camiseta oversized beige con gráfico de archivo.",
  },
  {
    id: "store-04",
    name: "KRKN / WASHED HOODIE",
    category: "hoodies",
    image: "/images/store/store-04.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Hoodie gris lavado con bolsillo frontal.",
  },
  {
    id: "store-05",
    name: "KRKN / UTILITY VEST",
    category: "chalecos",
    image: "/images/store/store-05.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Chaleco utility con múltiples bolsillos.",
  },
  {
    id: "store-06",
    name: "KRKN / BLACK BOMBER",
    category: "chaquetas",
    image: "/images/store/store-06.png",
    price: null,
    sizes: ["S", "M", "L", "XL"],
    description: "Bomber negra con cierre frontal.",
  },
];

export function getCategoryProducts(category: StoreCategory) {
  return category === "drop"
    ? storeProducts
    : storeProducts.filter((product) => product.category === category);
}

export function formatPrice(price: number | null) {
  if (price === null) return "PRECIO POR DEFINIR";

  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 2,
  }).format(price);
}
