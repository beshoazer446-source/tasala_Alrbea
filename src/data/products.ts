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
  { id: "candy",     nameAr: "كاندي وحلويات",     nameEn: "Candy & Sweets", image: "/Gemini_Generated_Image_nsm1l6nsm1l6nsm1.png",  color: "#d63384", gradient: "linear-gradient(135deg,#d63384,#f06292)" },
  { id: "healthy",   nameAr: "صحي",               nameEn: "Healthy",        image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80",  color: "#16a34a", gradient: "linear-gradient(135deg,#16a34a,#4ade80)" },
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

export const products: Product[] = [

  /* ══════════════════════════════════════
     قسم السوداني
  ══════════════════════════════════════ */
   {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني بالقشرة",
    nameEn: "Peanuts in Shell",
    pricePerKg: 160,
    customPrices: cp(20, 40, 80, 160),
    image: "/Gemini_Generated_Image_10psjk10psjk10ps.png", inStock: true,
  },
  {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني بالقشرة بدون ملح",
    nameEn: "Peanuts in Shell (Unsalted)",
    pricePerKg: 160,
    customPrices: cp(20, 40, 80, 160),
     image: "/Gemini_Generated_Image_10psjk10psjk10ps.png", inStock: true,
  },
  {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني مقشر بدون ملح",
    nameEn: "Shelled Peanuts (Unsalted)",
    pricePerKg: 180,
    customPrices: cp(23, 45, 90, 180),
    image: "/Gemini_Generated_Image_lz0u1hlz0u1hlz0u.png", inStock: true,
  },
  {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني مقشر سريع (ملح زيادة)",
    nameEn: "Shelled Peanuts Extra Salt",
    pricePerKg: 180,
    customPrices: cp(23, 45, 90, 180),
    image: "/Gemini_Generated_Image_j5snc6j5snc6j5sn.png", inStock: true,
  },
  {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني أسواني مقشر",
    nameEn: "Aswan Shelled Peanuts",
    pricePerKg: 180,
    customPrices: cp(23, 45, 90, 180),
    image: "/Gemini_Generated_Image_lz0u1hlz0u1hlz0u.png", inStock: true,
  },
  {
    id: _id++, categoryId: "peanuts",
    nameAr: "فول سوداني أطعم (جميع الأطعم)",
    nameEn: "Flavored Peanuts",
    pricePerKg: 200,
    customPrices: cp(25, 50, 100, 200),
    image: "/Gemini_Generated_Image_b0um8ob0um8ob0um.png", inStock: true,
    badge: "hot",
    flavors: FLAVOR_PNUT,
  },

  /* ══════════════════════════════════════
     قسم المكسرات
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "nuts",
    nameAr: "لوز بقشرة",
    nameEn: "Almonds in Shell",
    pricePerKg: 450,
    customPrices: cp(61, 123, 225, 450),
    image: "/Gemini_Generated_Image_hscbedhscbedhscb.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "لوز بملح",
    nameEn: "Salted Almonds",
    pricePerKg: 800,
    customPrices: cp(100, 200, 400, 800),
    image: "/Gemini_Generated_Image_gbg1fggbg1fggbg1.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "لوز بدون ملح",
    nameEn: "Unsalted Almonds",
    pricePerKg: 800,
    customPrices: cp(100, 200, 400, 800),
    image: "/Gemini_Generated_Image_gbg1fggbg1fggbg1.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "بندق",
    nameEn: "Hazelnuts",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_pzhjnkpzhjnkpzhj.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "فستق",
    nameEn: "Pistachios",
    pricePerKg: 920,
    customPrices: cp(115, 230, 460, 920),
    image: "/Gemini_Generated_Image_6qxwic6qxwic6qxw.png", inStock: true,
    badge: "hot",
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "كاجو ملح",
    nameEn: "Salted Cashews",
    pricePerKg: 920,
    customPrices: cp(115, 230, 460, 920),
    image: "/Gemini_Generated_Image_1bkfem1bkfem1bkf.png", inStock: true,
    badge: "hot",
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "كاجو بدون ملح",
    nameEn: "Unsalted Cashews",
    pricePerKg: 920,
    customPrices: cp(115, 230, 460, 920),
    image: "/Gemini_Generated_Image_1bkfem1bkfem1bkf.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "عين جمل",
    nameEn: "Walnuts",
    pricePerKg: 800,
    customPrices: cp(100, 200, 400, 800),
    image: "/Gemini_Generated_Image_ae6gmjae6gmjae6g.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "مكسرات مشكل",
    nameEn: "Mixed Nuts",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_e5g172e5g172e5g1.png", inStock: true,
    badge: "new",
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "بيكان فانيليا",
    nameEn: "Vanilla Pecans",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_n3r5xyn3r5xyn3r5.jpeg", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "بيكان ملح",
    nameEn: "Salted Pecans",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_n3r5xyn3r5xyn3r5.jpeg", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "ماكاديميا فانيليا",
    nameEn: "Vanilla Macadamia",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_eppkbmeppkbmeppk.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "ماكاديميا قهوة",
    nameEn: "Coffee Macadamia",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_eppkbmeppkbmeppk.png", inStock: true,
  },
  {
    id: _id++, categoryId: "nuts",
    nameAr: "ماكاديميا شوكولاتة",
    nameEn: "Chocolate Macadamia",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "/Gemini_Generated_Image_eppkbmeppkbmeppk.png", inStock: true,
    badge: "new",
  },


  /* ══════════════════════════════════════
     قسم المحمصات (لب)
  ══════════════════════════════════════ */
 {
    id: _id++, categoryId: "roasted",
    nameAr: "لب قرع أبيض درجة أولى مستورد",
    nameEn: "Premium Imported White Pumpkin Seeds",
    pricePerKg: 400,
    customPrices: cp(50, 100, 200, 400),
    image: "/Gemini_Generated_Image_u2p3cvu2p3cvu2p3.png", inStock: true,
    badge: "hot",
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب قرع أبيض محلى",
    nameEn: "Local White Pumpkin Seeds",
    pricePerKg: 260,
    customPrices: cp(33, 65, 130, 260),
    image: "/Gemini_Generated_Image_u2p3cvu2p3cvu2p3.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب قرع بدون ملح مستورد",
    nameEn: "Imported Pumpkin Seeds (Unsalted)",
    pricePerKg: 400,
    customPrices: cp(50, 100, 200, 400),
    image: "/Gemini_Generated_Image_wwqpk8wwqpk8wwqp.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب قرع بدون ملح محلى",
    nameEn: "Local Pumpkin Seeds (Unsalted)",
    pricePerKg: 260,
    customPrices: cp(33, 65, 130, 260),
    image: "/Gemini_Generated_Image_wwqpk8wwqpk8wwqp.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب سوري درجة أولى مستورد",
    nameEn: "Premium Imported Syrian Seeds",
    pricePerKg: 200,
    customPrices: cp(25, 50, 100, 200),
    image: "/Gemini_Generated_Image_iyc2o0iyc2o0iyc2.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب سوري بدون ملح درجة أولى مستورد",
    nameEn: "Imported Syrian Seeds (Unsalted)",
    pricePerKg: 200,
    customPrices: cp(25, 50, 100, 200),
    image: "/Gemini_Generated_Image_iyc2o0iyc2o0iyc2.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب سوري محلى",
    nameEn: "Local Syrian Seeds",
    pricePerKg: 140,
    customPrices: cp(18, 35, 70, 140),
    image: "/Gemini_Generated_Image_iyc2o0iyc2o0iyc2.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب سوبر درجة أولى محمودية",
    nameEn: "Super Mahmoudia Premium Seeds",
    pricePerKg: 300,
    customPrices: cp(38, 75, 150, 300),
    image: "/Gemini_Generated_Image_xsrnglxsrnglxsrn.png", inStock: true,
    badge: "new",
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب سوبر محلى",
    nameEn: "Local Super Seeds",
    pricePerKg: 240,
    customPrices: cp(30, 60, 120, 240),
    image: "/Gemini_Generated_Image_xsrnglxsrnglxsrn.png", inStock: true,
  },
  {
    id: _id++, categoryId: "roasted",
    nameAr: "لب بطيخ",
    nameEn: "Watermelon Seeds",
    pricePerKg: 300,
    customPrices: cp(38, 75, 150, 300),
    image: "/Gemini_Generated_Image_176ri1176ri1176r.png", inStock: true,
  },

  /* ══════════════════════════════════════
     قسم المقرمشات
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "crackers",
    nameAr: "قلية (جميع الأطعم)",
    nameEn: "Fried Crackers (All Flavors)",
    pricePerKg: 200,
    customPrices: cp(25, 50, 100, 200),
    image: "/Gemini_Generated_Image_79e8b479e8b479e8.png", inStock: true,
    badge: "hot",
    flavors: FLAVOR_CRACK,
  },
  {
    id: _id++, categoryId: "crackers",
    nameAr: "حمص مقلي",
    nameEn: "Fried Chickpeas",
    pricePerKg: 160,
    customPrices: cp(20, 40, 80, 160),
    image: "/Gemini_Generated_Image_eziwuleziwuleziw.png", inStock: true,
  },
  {
    id: _id++, categoryId: "crackers",
    nameAr: "مقرمشات (جميع الأطعم)",
    nameEn: "Crackers (All Flavors)",
    pricePerKg: 120,
    customPrices: cp(15, 30, 60, 120),
    image: "/Gemini_Generated_Image_g76v2jg76v2jg76v.png", inStock: true,
    badge: "new",
    flavors: FLAVOR_MQR,
  },


  /* ══════════════════════════════════════
     كاندي وحلويات
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "candy",
    nameAr: "كاندي إسباني",
    nameEn: "Spanish Candy",
    pricePerKg: 400,
    customPrices: cp(50, 100, 200, 400),
    image: "/Gemini_Generated_Image_u96iiau96iiau96i.png", inStock: true,
    badge: "hot",
  },
  {
    id: _id++, categoryId: "candy",
    nameAr: "كاندي فواكه مشكلة",
    nameEn: "Mixed Fruit Candy",
    pricePerKg: 300,
    customPrices: cp(38, 75, 150, 300),
    image: "/Gemini_Generated_Image_u96iiau96iiau96i.png", inStock: true,
  },
  {
    id: _id++, categoryId: "candy",
    nameAr: "مارشميلو فواكه",
    nameEn: "Fruit Marshmallow",
    pricePerKg: 280,
    customPrices: cp(35, 70, 140, 280),
    image: "/Gemini_Generated_Image_u1kyrau1kyrau1ky.png", inStock: true,
    badge: "new",
  },

  /* ══════════════════════════════════════
     قسم صحي
  ══════════════════════════════════════ */
   {
    id: _id++, categoryId: "healthy",
    nameAr: "فواكه مجففة",
    nameEn: "Dried Fruits",
    pricePerKg: 1600,
    customPrices: cp(200, 400, 800, 1600),
    image: "/Gemini_Generated_Image_qyefo9qyefo9qyef.png", inStock: true,
    badge: "new",
  },
  {
    id: _id++, categoryId: "healthy",
    nameAr: "فواكه مجففة مشكل",
    nameEn: "Mixed Dried Fruits",
    pricePerKg: 1600,
    customPrices: cp(200, 400, 800, 1600),
    image: "/Gemini_Generated_Image_qyefo9qyefo9qyef.png", inStock: true,
    badge: "new",
  },
  {
    id: _id++, categoryId: "healthy",
    nameAr: "بذور اليقطين",
    nameEn: "Pumpkin Seeds",
    pricePerKg: 500,
    customPrices: cp(63, 125, 250, 500),
    image: "/Gemini_Generated_Image_jb7sk1jb7sk1jb7s.png", inStock: true,
  },

  /* ══════════════════════════════════════
     شوكولا
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "سويس فرو (بالحشوات)",
    nameEn: "Swiss Fru (Filled)",
    pricePerKg: 180, unitPrice: 180, soldByUnit: true,
    image: "/Gemini_Generated_Image_ltr4ylltr4ylltr4 (1).png",
    inStock: true, badge: "hot",
    flavors: ["Whole Hazelnuts", "Almond Cream", "Mouse Cream", "Pistachio Cream"],
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "علي شوكولاتة",
    nameEn: "Ali Chocolate",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/Gemini_Generated_Image_uo10lxuo10lxuo10 (1).png",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "دبي شوكولاتة بالفستق",
    nameEn: "Dubai Chocolate Pistachio",
    pricePerKg: 130, unitPrice: 130, soldByUnit: true,
    image: "/Gemini_Generated_Image_8h82cd8h82cd8h82 (1).png",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "لوتس شوكولاتة",
    nameEn: "Lotus Chocolate",
    pricePerKg: 200, unitPrice: 200, soldByUnit: true,
    image: "/Gemini_Generated_Image_yrycm3yrycm3yryc (1).png",
    inStock: true, badge: "new",
    flavors: ["Mango", "White", "Pistachio"],
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "تويا شوكولاتة",
    nameEn: "Tuya Chocolate",
    pricePerKg: 60, unitPrice: 60, soldByUnit: true,
    image: "/Gemini_Generated_Image_biovq5biovq5biov.png",
    inStock: true,
    flavors: ["Coconut Cream", "Dark Almonds", "Hazelnut Cream", "Cinnamon Biscuit", "Dark Hazelnut", "Hazelnut Paste & Pieces"],
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "تويا ميلك",
    nameEn: "Tuya Milk",
    pricePerKg: 120, unitPrice: 120, soldByUnit: true,
    image: "/Gemini_Generated_Image_vecxjcvecxjcvecx.png",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلكا شوكولاتة (جميع الأطعم)",
    nameEn: "Milka Chocolate (All Flavors)",
    pricePerKg: 100, unitPrice: 100, soldByUnit: true,
    image: "/Gemini_Generated_Image_3evkm43evkm43evk.png",
    inStock: true, badge: "hot",
    flavors: ["All Flavors / جميع الأطعم"],
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كيت كات دبل شوكولاتة",
    nameEn: "KitKat Double Chocolate",
    pricePerKg: 180, unitPrice: 180, soldByUnit: true,
    image: "/Gemini_Generated_Image_ss03goss03goss03.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "زيرو (0% سكر)",
    nameEn: "Zero (0% Sugar)",
    pricePerKg: 85, unitPrice: 85, soldByUnit: true,
    image: "/Gemini_Generated_Image_u34dvxu34dvxu34d.png",
    inStock: true, badge: "new",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "داماك شوكولاتة",
    nameEn: "Damak Chocolate",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/Gemini_Generated_Image_aodvq7aodvq7aodv.png",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "رافيلو",
    nameEn: "Raffaello",
    pricePerKg: 200, unitPrice: 200, soldByUnit: true,
    image: "/Gemini_Generated_Image_euxaigeuxaigeuxa.png",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ليندت شوكولاتة",
    nameEn: "Lindt Chocolate",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/Gemini_Generated_Image_xh01o8xh01o8xh01.png",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلكا شوكو ويفر",
    nameEn: "Milka Choco Wafer",
    pricePerKg: 50, unitPrice: 50, soldByUnit: true,
    image: "/Gemini_Generated_Image_6y7gyy6y7gyy6y7g.png",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "بريك شوكولاتة",
    nameEn: "Break Chocolate",
    pricePerKg: 120, unitPrice: 120, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.26 PM.jpeg",
    inStock: true,
    flavors: ["Raisin Almonds & Hazelnuts", "Whole Hazelnuts", "Whole Almonds"],
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "فوكس شوكولاتة",
    nameEn: "Fox Chocolate",
    pricePerKg: 85, unitPrice: 85, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.28 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلكا كوكيز",
    nameEn: "Milka Cookies",
    pricePerKg: 200, unitPrice: 200, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.30 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "أوريو",
    nameEn: "Oreo",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.32 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كيندر ريجيل",
    nameEn: "Kinder Riegel",
    pricePerKg: 35, unitPrice: 35, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.48 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كيندر شوكولاتة",
    nameEn: "Kinder Chocolate",
    pricePerKg: 60, unitPrice: 60, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.48 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مالتيسرز بسكويت",
    nameEn: "Maltesers Biscuits",
    pricePerKg: 180, unitPrice: 180, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 5.38.40 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "علي داكنة 70%",
    nameEn: "Ali Dark 70%",
    pricePerKg: 80, unitPrice: 80, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.50 PM.jpeg",
    inStock: true, badge: "new",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "دبي شوكولاتة فستق",
    nameEn: "Dubai Chocolate Pistachio",
    pricePerKg: 130, unitPrice: 130, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.52.16 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "فيريرو روشيه",
    nameEn: "Ferrero Rocher",
    pricePerKg: 90, unitPrice: 90, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.51 PM.jpeg",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مولكي فستق كنافة ويفر",
    nameEn: "Mulki Pistachio Kunafa Wafer",
    pricePerKg: 140, unitPrice: 140, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.51 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ديستينجو كنافة",
    nameEn: "Distingo Kunafa",
    pricePerKg: 100, unitPrice: 100, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.52 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "زيرو فستق كنافة",
    nameEn: "Zero Pistachio Kunafa",
    pricePerKg: 120, unitPrice: 120, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.52 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلبار",
    nameEn: "MilPar",
    pricePerKg: 80, unitPrice: 80, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.53 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "لوتس فستق",
    nameEn: "Lotus Pistachio",
    pricePerKg: 80, unitPrice: 80, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.52 PM (2).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "سويس فرو ميني",
    nameEn: "Swiss Fru Mini",
    pricePerKg: 25, unitPrice: 25, soldByUnit: true,
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "نوجاتيلي كوكيز",
    nameEn: "Nougatelli Cookies",
    pricePerKg: 145, unitPrice: 145, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.53 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلكا شوكو ستيكس",
    nameEn: "Milka Choco Sticks",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.54 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مارفل شوكولاتة",
    nameEn: "Marvel Chocolate",
    pricePerKg: 65, unitPrice: 65, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.54 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "شوكولاتة كوكيز",
    nameEn: "Chocolate Cookies",
    pricePerKg: 145, unitPrice: 145, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.54 PM (2).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "نستله (5 قطع)",
    nameEn: "Nestle (5 Pack)",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.55 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كرانش ويفر",
    nameEn: "Crunch Wafer",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 5.13.18 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كواليتي ستريت",
    nameEn: "Quality Street",
    pricePerKg: 450, unitPrice: 450, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.55 PM (2).jpeg",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميني أوريو",
    nameEn: "Mini Oreo",
    pricePerKg: 150, unitPrice: 150, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.55 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كيندر كاردز",
    nameEn: "Kinder Cards",
    pricePerKg: 460, unitPrice: 460, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-09 at 4.49.56 PM.jpeg",
    inStock: true, badge: "new",
  },
{
    id: _id++, categoryId: "chocolate",
    nameAr: "فيريرو روشيه",
    nameEn: "Ferrero Rocher",
    pricePerKg: 1100, unitPrice: 1100, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.23 PM.jpeg",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مارشميلو",
    nameEn: "Marshmallows",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.23 PM (1).jpeg",
    inStock: true, badge: "sale", discount: 20,
    description: "عرض خاص! بـ 200 جنيه بدل 250 جنيه",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مارش زون",
    nameEn: "Marshzone",
    pricePerKg: 25, unitPrice: 25, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.26 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "منتوس",
    nameEn: "Mentos",
    pricePerKg: 70, unitPrice: 70, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.27 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كاندي سويتو",
    nameEn: "Candy Sweeto",
    pricePerKg: 35, unitPrice: 35, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.28 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كاندي هاريبو",
    nameEn: "Candy Haribo",
    pricePerKg: 35, unitPrice: 35, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.29 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميلتد شوكولاتة",
    nameEn: "Melted Chocolate",
    pricePerKg: 680, unitPrice: 680, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.31 PM.jpeg",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "كواليتي ستريت",
    nameEn: "Quality Street",
    pricePerKg: 650, unitPrice: 650, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.31 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ليندت شوكولاتة",
    nameEn: "Lindt Chocolate",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.46 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ميجا شوكولاتة",
    nameEn: "Mega Chocolate",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.45 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "مشكل مكسرات فيينا",
    nameEn: "Viena Mixed Nuts Chocolate",
    pricePerKg: 500, unitPrice: 500, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.46 PM (1).jpeg",
    inStock: true, badge: "new",
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "تويست شوكولاتة",
    nameEn: "Twist Chocolate",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.45 PM (1).jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "بايتس شوكولاتة",
    nameEn: "Bites Chocolate",
    pricePerKg: 100, unitPrice: 100, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.44 PM.jpeg",
    inStock: true,
  },
  {
    id: _id++, categoryId: "chocolate",
    nameAr: "ترافل شوكولاتة",
    nameEn: "Truffle Chocolate",
    pricePerKg: 250, unitPrice: 250, soldByUnit: true,
    image: "/WhatsApp Image 2026-06-10 at 3.42.45 PM (2).jpeg",
    inStock: true,
  },

  /* ══════════════════════════════════════
     شوكولاتة بالكيلو
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة داكنة بالكيلو",
    nameEn: "Dark Chocolate by Kg",
    pricePerKg: 800,
    customPrices: cp(100, 200, 400, 800),
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&q=80",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة حليب بالكيلو",
    nameEn: "Milk Chocolate by Kg",
    pricePerKg: 750,
    customPrices: cp(94, 188, 375, 750),
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&q=80",
    inStock: true,
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة بيضاء بالكيلو",
    nameEn: "White Chocolate by Kg",
    pricePerKg: 780,
    customPrices: cp(98, 195, 390, 780),
    image: "https://images.unsplash.com/photo-1511381939415-e44676b7f0f7?w=400&q=80",
    inStock: true,
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة بالبندق بالكيلو",
    nameEn: "Hazelnut Chocolate by Kg",
    pricePerKg: 900,
    customPrices: cp(113, 225, 450, 900),
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    inStock: true, badge: "hot",
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة بالفستق بالكيلو",
    nameEn: "Pistachio Chocolate by Kg",
    pricePerKg: 1000,
    customPrices: cp(125, 250, 500, 1000),
    image: "https://images.unsplash.com/photo-1526081347589-7151940e76d6?w=400&q=80",
    inStock: true, badge: "new",
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة بالكراميل بالكيلو",
    nameEn: "Caramel Chocolate by Kg",
    pricePerKg: 850,
    customPrices: cp(106, 213, 425, 850),
    image: "https://images.unsplash.com/photo-1543352634-99a5d50ae78e?w=400&q=80",
    inStock: true,
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "شوكولاتة بالتوت بالكيلو",
    nameEn: "Berry Chocolate by Kg",
    pricePerKg: 820,
    customPrices: cp(103, 205, 410, 820),
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    inStock: true,
  },
  {
    id: _id++, categoryId: "choc_kg",
    nameAr: "تراجون شوكولاتة بالكيلو",
    nameEn: "Truffle Chocolate by Kg",
    pricePerKg: 1100,
    customPrices: cp(138, 275, 550, 1100),
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80",
    inStock: true, badge: "hot",
  },

  /* ══════════════════════════════════════
     قسم العروض
  ══════════════════════════════════════ */
  {
    id: _id++, categoryId: "offers",
    nameAr: "فول سوداني بالقشرة — عرض خاص",
    nameEn: "Peanuts in Shell — Special Offer",
    pricePerKg: 130,
    customPrices: cp(16, 33, 65, 130),
    image: OFFER1, inStock: true,
    badge: "sale",
    discount: 19,
    description: "عرض خاص! فول سوداني بالقشرة بسعر مميز بدل 160 ج.م بس 130 ج.م للكيلو",
  },
];
