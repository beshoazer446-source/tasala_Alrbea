"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { products, categories, Category } from "@/data/products";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export default function CategoryClient({ categoryId }: { categoryId: string }) {
  const { t } = useApp();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"default"|"price_asc"|"price_desc">("default");

  const category = categories.find(c => c.id === categoryId);
  const catName = category ? (t.lang === "ar" ? category.nameAr : category.nameEn) : categoryId;

  const filtered = useMemo(() => {
    let list = products.filter(p => p.categoryId === categoryId);
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
  }, [categoryId, search, sort]);

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
          <p className={styles.heroCount}>{filtered.length} منتج</p>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.catSearchWrapper}>
            <svg className={styles.catSearchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
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