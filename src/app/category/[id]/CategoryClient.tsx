"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { categories, Product } from "@/data/products";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

function adaptProduct(p: Record<string, unknown>): Product {
  return {
    id:          Number(p.id),
    categoryId:  String(p.category_id ?? ""),
    nameAr:      String(p.name_ar ?? ""),
    nameEn:      String(p.name_en ?? ""),
    pricePerKg:  Number(p.price_per_kg ?? 0),
    customPrices: (p.price_125g || p.price_250g) ? {
      "125g": Number(p.price_125g ?? 0),
      "250g": Number(p.price_250g ?? 0),
      "500g": Number(p.price_500g ?? 0),
      "750g": Number(p.price_750g ?? 0),
      "1kg":  Number(p.price_1kg  ?? 0),
    } : undefined,
    image:       String(p.image ?? ""),
    unitPrice:   p.unit_price ? Number(p.unit_price) : undefined,
    soldByUnit:  Boolean(p.sold_by_unit),
    inStock:     Boolean(p.in_stock),
    badge:       (p.badge as Product["badge"]) ?? undefined,
    discount:    p.discount ? Number(p.discount) : undefined,
    flavors:     Array.isArray(p.flavors) ? p.flavors : undefined,
    description: p.description ? String(p.description) : undefined,
  };
}

export default function CategoryClient({ categoryId }: { categoryId: string }) {
  const { t } = useApp();
  const [search, setSearch]     = useState("");
  const [sort, setSort]         = useState<"default"|"price_asc"|"price_desc">("default");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  const category = categories.find(c => c.id === categoryId);
  const catName  = category ? (t.lang === "ar" ? category.nameAr : category.nameEn) : categoryId;

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products?category=${categoryId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data.map(adaptProduct));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryId]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => {
        const matchProduct = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        const cat = categories.find(c => c.id === p.categoryId);
        const matchCat = cat?.nameAr.toLowerCase().includes(q) || cat?.nameEn.toLowerCase().includes(q);
        const matchFlavor = p.flavors?.some(f => f.toLowerCase().includes(q));
        return matchProduct || matchCat || matchFlavor;
      });
    }
    if (sort === "price_asc")  list = [...list].sort((a,b) => a.pricePerKg - b.pricePerKg);
    if (sort === "price_desc") list = [...list].sort((a,b) => b.pricePerKg - a.pricePerKg);
    return list;
  }, [products, search, sort]);

  return (
    <div className={styles.page}>
      <div
        className={styles.hero}
        style={{
          backgroundImage: category ? `url(${category.image})` : undefined,
          "--hero-gradient": category?.gradient ?? "#1a9e7c",
        } as React.CSSProperties}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <div className={styles.breadcrumb}>
            <Link href="/">الرئيسية</Link>
            <span>›</span>
            <span>{catName}</span>
          </div>
          <h1 className={styles.heroTitle}>{catName}</h1>
          <p className={styles.heroCount}>{loading ? "..." : `${filtered.length} منتج`}</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.catSearchWrapper}>
            <svg className={styles.catSearchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className={styles.catSearchInput}
              placeholder={`ابحث في ${catName}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button className={styles.clearSearch} onClick={() => setSearch("")}>✕</button>}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price_asc">السعر: من الأقل</option>
            <option value="price_desc">السعر: من الأعلى</option>
          </select>
        </div>
      </div>

      <div className={styles.container}>
        {loading ? (
          <div className={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: 14, overflow: "hidden", background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <div style={{
                  aspectRatio: "1",
                  background: "linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)",
                  backgroundSize: "400% 100%",
                  animation: `shimmer 1.2s ease ${i*0.08}s infinite`,
                }}/>
                <div style={{padding:12}}>
                  <div style={{height:12,borderRadius:6,background:"#f0f0f0",marginBottom:8}}/>
                  <div style={{height:10,width:"60%",borderRadius:5,background:"#f0f0f0"}}/>
                </div>
              </div>
            ))}
            <style>{`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p>{search ? `لا توجد نتائج لـ "${search}"` : "لا توجد منتجات"}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
