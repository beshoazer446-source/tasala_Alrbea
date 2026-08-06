export interface Product {
  id: number;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  pricePerKg: number;
  customPrices?: {
    "125g": number;
    "250g": number;
    "500g": number;
    "750g": number;
    "1kg": number;
  };
  image: string;
  images?: string[];
  unitPrice?: number;
  soldByUnit?: boolean;
  inStock: boolean;
  badge?: "new" | "sale" | "hot";
  discount?: number;
  flavors?: string[];
  flavorImages?: Record<string, string>;
  description?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  image: string;
  color: string;
  gradient: string;
}

export const WEIGHT_OPTIONS = [
  { label: "125 جرام",  labelEn: "125g",   grams: 125,  key: "125g"  },
  { label: "250 جرام",  labelEn: "250g",   grams: 250,  key: "250g"  },
  { label: "500 جرام",  labelEn: "500g",   grams: 500,  key: "500g"  },
  { label: "750 جرام",  labelEn: "750g",   grams: 750,  key: "750g"  },
  { label: "1000 جرام", labelEn: "1000g",  grams: 1000, key: "1kg"   },
];

type PriceKey = "125g" | "250g" | "500g" | "750g" | "1kg";
const GRAMS_TO_KEY: Record<number, PriceKey> = {
  125: "125g", 250: "250g", 500: "500g", 750: "750g", 1000: "1kg",
};

// حساب السعر — لو في customPrices يستخدمها، غيره يحسب من pricePerKg
export function calcPrice(product: Product, grams: number): number {
  if (product.customPrices) {
    const key = GRAMS_TO_KEY[grams];
    if (key && product.customPrices[key] !== undefined) return product.customPrices[key];
  }
  return Math.round((product.pricePerKg * grams) / 1000);
}

// اختصار لعمل customPrices من ثمن→ربع→نصف→كيلو
function cp(eighth: number, quarter: number, half: number, kilo: number): NonNullable<Product["customPrices"]> {
  return { "125g": eighth, "250g": quarter, "500g": half, "750g": Math.round((half + kilo) / 2), "1kg": kilo };
}

export const categories: Category[] = [
  { id: "peanuts",   nameAr: "السوداني",        nameEn: "Peanuts",        image: "/Gemini_Generated_Image_4trc3t4trc3t4trc.png",  color: "#c8860a", gradient: "linear-gradient(135deg,#c8860a,#f0a832)" },
  { id: "nuts",      nameAr: "مكسرات",           nameEn: "Nuts",           image: "/Gemini_Generated_Image_1v1uwt1v1uwt1v1u.png",  color: "#6d4c41", gradient: "linear-gradient(135deg,#6d4c41,#a1715e)" },
  { id: "roasted",   nameAr: "محمصات",           nameEn: "Roasted Seeds",  image: "/Gemini_Generated_Image_3985yp3985yp3985.png",  color: "#b5651d", gradient: "linear-gradient(135deg,#b5651d,#d4893c)" },
  { id: "crackers",  nameAr: "مقرمشات",           nameEn: "Crackers",       image: "/Gemini_Generated_Image_flw3esflw3esflw3.png",  color: "#c0392b", gradient: "linear-gradient(135deg,#c0392b,#e74c3c)" },
  { id: "candy",     nameAr: "كاندي و توفي",     nameEn: "Candy & Toffee", image: "/Gemini_Generated_Image_nsm1l6nsm1l6nsm1.png",  color: "#d63384", gradient: "linear-gradient(135deg,#d63384,#f06292)" },
  { id: "healthy",   nameAr: " صحي و بلح",               nameEn: "Healthy and Dates",        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80",  color: "#16a34a", gradient: "linear-gradient(135deg,#16a34a,#4ade80)" },
  { id: "chocolate", nameAr: "شوكولا",             nameEn: "Chocolate",      image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=600&q=80",  color: "#5d3a1a", gradient: "linear-gradient(135deg,#5d3a1a,#8b5e3c)" },
  { id: "choc_kg",   nameAr: "شوكولاتة بالكيلو",  nameEn: "Chocolate by Kg", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80", color: "#3b1f0a", gradient: "linear-gradient(135deg,#3b1f0a,#6b3a1f)" },
  { id: "offers",    nameAr: "العروض",             nameEn: "Offers",         image: "/Gemini_Generated_Image_ujl3fvujl3fvujl3.png",  color: "#e67e22", gradient: "linear-gradient(135deg,#e67e22,#f39c12)" },
];

const PNUT = "https://images.unsplash.com/photo-1567892737950-30c4db39a4b7?w=400&q=80";
const PNUT2 = "https://images.unsplash.com/photo-1616684000067-36952fde56ec?w=400&q=80";
const NUT1 = "https://images.unsplash.com/photo-1574570082632-a8c8a67d5d25?w=400&q=80";
const NUT2 = "https://images.unsplash.com/photo-1563296020-ef58a7ec8bcd?w=400&q=80";
const NUT3 = "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=80";
const NUT4 = "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=400&q=80";
const SEED1 = "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80";
const SEED2 = "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80";
const CRACK1 = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80";
const CRACK2 = "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=80";
const CRACK3 = "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&q=80";
const CANDY1 = "https://images.unsplash.com/photo-1582058091522-22c1b4e4a78e?w=400&q=80";
const CANDY2 = "https://images.unsplash.com/photo-1611601322175-ef8f8be7ea07?w=400&q=80";
const HEALTH1 = "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&q=80";
const HEALTH2 = "https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=400&q=80";
const OFFER1 = "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=400&q=80";

const FLAVOR_PNUT  = ["كاتشب","جبنة","فلفل حلو","شطة وليمون","باربيكيو","فراخ","ميكس جميع الأطعم"];
const FLAVOR_CRACK = ["جبنة","كاتشب","ملح","ميكس"];
const FLAVOR_MQR   = ["كاتشب","جبنة","فلفل حلو","شطة وليمون","باربيكيو","فراخ","خلطة سرية","ميكس جميع الأطعم"];

let _id = 1;

export const products: Product[] = [];
