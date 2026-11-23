
export type DropProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};

export const dropProducts: DropProduct[] = [
  {
    id: "01",
    name: "KRKN Washed Black Tee",
    category: "Graphic Tee",
    price: 245,
    image: "/images/drop/drop-01.png",
    slug: "krkn-washed-black-tee",
  },
  {
    id: "02",
    name: "Olive Cargo Pants",
    category: "Cargo Pants",
    price: 385,
    image: "/images/drop/drop-02.png",
    slug: "olive-cargo-pants",
  },
  {
    id: "03",
    name: "Archive Graphic Tee",
    category: "Graphic Tee",
    price: 265,
    image: "/images/drop/drop-03.png",
    slug: "archive-graphic-tee",
  },
  {
    id: "04",
    name: "Washed Grey Hoodie",
    category: "Oversized Hoodie",
    price: 395,
    image: "/images/drop/drop-04.png",
    slug: "washed-grey-hoodie",
  },
  {
    id: "05",
    name: "Utility Vest",
    category: "Utility Outerwear",
    price: 345,
    image: "/images/drop/drop-05.png",
    slug: "utility-vest",
  },
  {
    id: "06",
    name: "Black Bomber Jacket",
    category: "Outerwear",
    price: 495,
    image: "/images/drop/drop-06.png",
    slug: "black-bomber-jacket",
  },
];
