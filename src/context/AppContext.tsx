"use client";
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Lang, translations } from "@/lib/translations";
import { Product } from "@/data/products";

export interface CartItem extends Product {
  qty: number;
  selectedWeight: string;
  weightGrams: number;
  finalPrice: number;
}

interface AppContextType {
  lang: Lang;
  t: typeof translations.ar;
  toggleLang: () => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQty: (id: number, weight: string, qty: number) => void;
  cartCount: number;
  cartTotal: number;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  favCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  isFavOpen: boolean;
  setIsFavOpen: (v: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (v: boolean) => void;
  headerSearch: string;
  setHeaderSearch: (v: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const CART_KEY = "tasali_cart";
const FAV_KEY  = "tasali_favorites";
const LANG_KEY = "tasali_lang";

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLang]         = useState<Lang>("ar");
  const [cart, setCart]         = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen]   = useState(false);
  const [isFavOpen,  setIsFavOpen]    = useState(false);
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");

  // Load from localStorage once on mount
  useEffect(() => {
    setLang(safeGet<Lang>(LANG_KEY, "ar"));
    setCart(safeGet<CartItem[]>(CART_KEY, []));
    setFavorites(safeGet<number[]>(FAV_KEY, []));
    setHydrated(true);
  }, []);

  // Persist on change (only after hydration to avoid overwriting with defaults)
  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(FAV_KEY,  JSON.stringify(favorites)); }, [favorites, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(LANG_KEY, lang); }, [lang, hydrated]);

  const t = translations[lang];
  const toggleLang = useCallback(() => setLang(l => l === "ar" ? "en" : "ar"), []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const key = `${item.id}-${item.selectedWeight}`;
      const exists = prev.find(i => `${i.id}-${i.selectedWeight}` === key);
      if (exists) return prev.map(i => `${i.id}-${i.selectedWeight}` === key ? { ...i, qty: i.qty + item.qty } : i);
      return [...prev, item];
    });
  }, []);

  const removeFromCart = useCallback((id: number, weight: string) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedWeight === weight)));
  }, []);

  const updateQty = useCallback((id: number, weight: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id, weight); return; }
    setCart(prev => prev.map(i => i.id === id && i.selectedWeight === weight ? { ...i, qty } : i));
  }, [removeFromCart]);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  }, []);

  const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.finalPrice * i.qty, 0);
  const favCount  = favorites.length;

  return (
    <AppContext.Provider value={{
      lang, t, toggleLang,
      cart, addToCart, removeFromCart, updateQty, cartCount, cartTotal,
      favorites, toggleFavorite, isFavorite, favCount,
      isCartOpen, setIsCartOpen,
      isFavOpen,  setIsFavOpen,
      isMenuOpen, setIsMenuOpen,
      headerSearch, setHeaderSearch,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
