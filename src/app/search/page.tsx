"use client";
import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import Link from "next/link";
import { products, categories } from "@/data/products";
import { useApp } from "@/context/AppContext";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { t } = useApp();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(p => {
      const cat = categories.find(c => c.id === p.categoryId);
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        cat?.nameAr.toLowerCase().includes(q) ||
        cat?.nameEn.toLowerCase().includes(q) ||
        p.flavors?.some(f => f.toLowerCase().includes(q))
      );
    });
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof products> = {};
    results.forEach(p => {
      if (!map[p.categoryId]) map[p.categoryId] = [];
      map[p.categoryId].push(p);
    });
    return map;
  }, [results]);

  return (
    <div className={styles.page}>
      <div className={styles.headerBand}>
        <div className={styles.headerInner}>
          <div className={styles.breadcrumb}>
            <Link href="/">{t.home}</Link>
            <span>›</span>
            <span>{t.lang === "ar" ? "نتائج البحث" : "Search Results"}</span>
          </div>
          <h1 className={styles.title}>
            {t.lang === "ar" ? `نتائج: "${query}"` : `Results for: "${query}"`}
          </h1>
          <p className={styles.count}>{results.length} {t.lang === "ar" ? "منتج" : "products"}</p>
        </div>
      </div>

      <div className={styles.container}>
        {results.length === 0 ? (
          <div className={styles.empty}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <p>{t.lang === "ar" ? "لا توجد نتائج لـ" : "No results for"} <strong>&ldquo;{query}&rdquo;</strong></p>
            <Link href="/" className={styles.homeLink}>{t.backHome}</Link>
          </div>
        ) : (
          Object.entries(grouped).map(([catId, prods]) => {
            const cat = categories.find(c => c.id === catId);
            const catName = t.lang === "ar" ? cat?.nameAr : cat?.nameEn;
            return (
              <div key={catId} className={styles.group}>
                <div className={styles.groupHeader}>
                  <h2 className={styles.groupTitle}>{catName}</h2>
                  <Link href={"/category/" + catId} className={styles.viewAll}>{t.viewAll}</Link>
                </div>
                <div className={styles.grid}>
                  {prods.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{padding:"80px",textAlign:"center"}}>جاري البحث...</div>}>
      <SearchResults />
    </Suspense>
  );
}
