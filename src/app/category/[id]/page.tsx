"use client";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    { id: "peanuts" },
    { id: "nuts" },
    { id: "roasted" },
    { id: "crackers" },
    { id: "candy" },
    { id: "healthy" },
    { id: "chocolate" },
    { id: "choc_kg" },
    { id: "offers" },
  ];
}

export default function CategoryPage() {
  const { id } = useParams();
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default"|"price_asc"|"price_desc">("default");

  const category = categories.find(c => c.id === id);
  const catName = category ? (t.lang === "ar" ? category.nameAr : category.nameEn) : String(id);

  const filtered = useMemo(() => {
    let list = products.filter(p => p.categoryId === id);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => {
        // بحث في اسم المنتج
        const matchProduct = p.nameAr.toLowerCase().includes(q) || p.nameEn.toLowerCase().includes(q);
        // بحث في اسم القسم
        const cat = categories.find(c => c.id === p.categoryId);
        const matchCat = cat?.nameAr.toLowerCase().includes(q) || cat?.nameEn.toLowerCase().includes(q);
        // بحث في الأطعم
        const matchFlavor = p.flavors?.some(f => f.toLowerCase().includes(q));
        return matchProduct || matchCat || matchFlavor;
      });
    }
    if (sort === "price_asc")  list = [...list].sort((a,b) => a.pricePerKg - b.pricePerKg);
    if (sort === "price_desc") list = [...list].sort((a,b) => b.pricePerKg - a.pricePerKg);
    return list;
  }, [id, search, sort]);

  return (
    <div className={styles.page}>
      {/* Hero */}
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
            <Link href="/">{t.home}</Link>
            <span>›</span>
            <span>{catName}</span>
          </div>
          <h1 className={styles.heroTitle}>{catName}</h1>
          <p className={styles.heroCount}>
            {filtered.length} {t.lang === "ar" ? "منتج" : "products"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.catSearchWrapper}>
            <svg className={styles.catSearchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className={styles.catSearchInput}
              placeholder={t.lang === "ar"
                ? `ابحث في ${catName} (اسم المنتج أو الطعم)...`
                : `Search in ${catName}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <select
            className={styles.sortSelect}
            value={sort}
            onChange={e => setSort(e.target.value as typeof sort)}
          >
            <option value="default">{t.lang === "ar" ? "الترتيب الافتراضي" : "Default"}</option>
            <option value="price_asc">{t.lang === "ar" ? "السعر: من الأقل" : "Price: Low to High"}</option>
            <option value="price_desc">{t.lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low"}</option>
          </select>
        </div>
      </div>

      {/* Products grid */}
      <div className={styles.container}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>{search
              ? (t.lang === "ar" ? `لا توجد نتائج لـ "${search}"` : `No results for "${search}"`)
              : t.noProducts}</p>
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
