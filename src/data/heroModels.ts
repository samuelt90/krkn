export type HeroModel = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  slug: string;
};

export const heroModels = [
  {
    id: "01",
    name: "Washed Grey Hoodie",
    category: "Oversized Hoodie",
    price: 395,
    image: "/images/hero/modelo-1.png",
    slug: "washed-grey-hoodie",
  },
  {
    id: "02",
    name: "Archive Graphic Tee",
    category: "Graphic Tee",
    price: 245,
    image: "/images/hero/modelo-2.png",
    slug: "archive-graphic-tee",
  },
  {
    id: "03",
    name: "Black Bomber Jacket",
    category: "Outerwear",
    price: 495,
    image: "/images/hero/modelo-3.png",
    slug: "black-bomber-jacket",
  },

];