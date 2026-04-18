export interface Product {
  id?: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  emoji: string;
  badge: string;
  bg: string;
  description: string;
  image?: string;
  details: string[];
  reviews: {
    rating: number;
    text: string;
    author: string;
  }[];
}

export const products: Product[] = [
  {
    slug: "teff-grain",
    name: "Teff Grain",
    category: "Grains & Seeds",
    price: "$4.99",
    emoji: "🌾",
    badge: "Organic",
    bg: "rgba(27,48,34,0.4)",
    description: "Our organic Teff grain is a gluten-free superfood, perfect for making traditional injera or as a nutritious addition to any meal. Grown in ideal conditions, it boasts a mild, nutty flavor.",
    details: [
      "1lb (453g) of whole grain teff",
      "Certified USDA Organic",
      "Gluten-Free and Non-GMO",
      "Sourced from local partners",
    ],
    reviews: [
      { rating: 5, text: "Best teff I've found in Vegas! Makes perfect injera.", author: "Hana L." },
      { rating: 5, text: "So fresh and high quality. A pantry staple for me now.", author: "David R." },
    ],
  },
  {
    slug: "ethiopian-coffee",
    name: "Ethiopian Coffee",
    category: "Drinks",
    price: "$14.99",
    emoji: "☕",
    badge: "Premium",
    bg: "rgba(193,163,106,0.06)",
    description: "Experience the birthplace of coffee with our single-origin Ethiopian beans. Featuring a bright, citrusy acidity and a complex floral aroma, this medium roast is perfect for pour-over or drip brewing.",
    details: [
      "12oz (340g) of whole coffee beans",
      "Single-Origin: Yirgacheffe, Ethiopia",
      "Medium Roast Profile",
      "Tasting Notes: Lemon, Floral, Black Tea",
    ],
    reviews: [
      { rating: 5, text: "The aroma alone is worth the price. Incredible coffee.", author: "Michael B." },
      { rating: 4, text: "A little lighter than I usually prefer, but the flavors are amazing.", author: "Sarah K." },
    ],
  },
    {
    slug: "berbere-spice",
    name: "Berbere Spice",
    category: "Spices",
    price: "$7.99",
    emoji: "🌶️",
    badge: "Imported",
    bg: "rgba(27,48,34,0.4)",
    description: "A vibrant, aromatic, and essential spice blend for Ethiopian cuisine. Our authentic berbere is a complex mix of chili peppers and over a dozen other spices, providing a fiery and flavorful kick to any dish.",
    details: [
        "4oz (113g) spice blend jar",
        "Authentic Ethiopian recipe",
        "Ingredients include chili, garlic, ginger, and fenugreek",
        "Perfect for stews (wats), lentils, and meats",
    ],
    reviews: [
        { rating: 5, text: "This is the real deal! Just like the berbere my grandmother used.", author: "Fikir T." },
        { rating: 5, text: "Spicy, but so flavorful. I put it on everything now.", author: "Chris G." },
    ],
  },
  {
    slug: "injera",
    name: "Injera",
    category: "Bakery",
    price: "$5.99",
    emoji: "🥞",
    badge: "Fresh",
    bg: "rgba(193,163,106,0.06)",
    description: "Freshly made daily, our injera is the perfect sourdough flatbread to accompany your Ethiopian dishes. Its unique, spongy texture is ideal for scooping up flavorful stews and salads.",
    details: [
        "Pack of 3 large injera rounds",
        "Made fresh in-house daily",
        "100% teff flour used",
        "Store in a cool, dry place",
    ],
    reviews: [
        { rating: 5, text: "Always fresh and delicious. The best injera in town.", author: "Abel M." },
        { rating: 4, text: "Very good, just wish they came in a smaller pack size.", author: "Jessica W." },
    ],
  },
   {
    name: "Fresh Fruit Mix",
    slug: "fresh-fruit-mix",
    category: "Produce",
    price: "$6.99",
    emoji: "🍎",
    badge: "Daily Fresh",
    bg: "rgba(193,163,106,0.06)",
    description: "A delightful mix of the freshest seasonal fruits, chopped and ready to eat. Perfect for a healthy breakfast, a light snack, or a vibrant addition to your desserts.",
    details: [
      "16oz (454g) container",
      "Contains a mix of melons, berries, and citrus",
      "Prepared fresh daily in-store",
      "Selection varies based on seasonal availability",
    ],
    reviews: [
      { rating: 5, text: "So convenient and always delicious. The quality is top-notch.", author: "Maria P." },
      { rating: 5, text: "My kids love this mix. A great way to get them to eat more fruit.", author: "Tom H." },
    ],
  },
  {
    name: "Premium Snacks",
    slug: "premium-snacks",
    category: "Snacks",
    price: "$3.49",
    emoji: "🍿",
    badge: "Popular",
    bg: "rgba(193,163,106,0.06)",
    description: "A curated selection of premium, hard-to-find snacks. From artisanal popcorn to gourmet chips, treat yourself to something special. This is our most popular grab-and-go item.",
    details: [
      "Single-serving bag (size varies)",
      "Features a rotating selection of artisanal brands",
      "Perfect for a quick, high-quality snack",
      "Check in-store for the current selection",
    ],
    reviews: [
      { rating: 5, text: "They always have the most interesting snacks!", author: "Jenna D." },
      { rating: 4, text: "A bit pricey for a snack, but worth it for the quality.", author: "Carlos V." },
    ],
  },
];
