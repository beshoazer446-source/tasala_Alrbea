"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { categories } from "@/data/products";
import styles from "./Header.module.css";

export default function Header() {
  const {
    t, toggleLang,
    cartCount, setIsCartOpen,
    favCount,  setIsFavOpen,
    isMenuOpen, setIsMenuOpen,
    headerSearch, setHeaderSearch,
  } = useApp();

  const router = useRouter();
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(headerSearch.trim())}`);
    }
  }

  return (
    <header className={styles.header}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span className={styles.branchTag}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {t.branch}
          </span>
          <span className={styles.topTagline}>📍 {t.addressVal}</span>
        </div>
      </div>

      {/* Main header */}
      <div className={styles.mainHeader}>
        <div className={styles.mainInner}>

          {/* Logo — real image */}
          <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
            <div className={styles.logoImgWrapper}>
              <Image
                src="/logo.jpg"
                alt="تسالي الربيع"
                width={52}
                height={52}
                className={styles.logoImg}
                priority
              />
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoMain}>{t.siteName}</span>
              <span className={styles.logoSub}>{t.tagline}</span>
            </div>
          </Link>

          {/* Search (desktop) */}
          <form className={styles.searchWrapper} onSubmit={handleSearch}>
            <button type="submit" className={styles.searchIconBtn} aria-label="search">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <input
              type="text"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={headerSearch}
              onChange={e => setHeaderSearch(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            <button className={styles.langBtn} onClick={toggleLang}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{t.language}</span>
            </button>

            <button className={styles.iconBtn} onClick={() => { setIsFavOpen(true); setIsMenuOpen(false); }} aria-label={t.favorites}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
            </button>

            <button className={styles.iconBtn} onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }} aria-label={t.cart}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>

            {/* Burger with label */}
            <div className={styles.burgerWrapper} ref={catRef}>
              <button
                className={`${styles.burgerBtn} ${catOpen ? styles.burgerActive : ""}`}
                onClick={() => setCatOpen(v => !v)}
                aria-label="categories"
              >
                <div className={`${styles.burgerLines} ${catOpen ? styles.burgerOpen : ""}`}>
                  <span/><span/><span/>
                </div>
                <span className={styles.burgerLabel}>{t.lang === "ar" ? "الأقسام" : "Categories"}</span>
              </button>

              {/* Mega menu */}
              {catOpen && (
                <div className={styles.megaMenu}>
                  <p className={styles.megaTitle}>{t.lang === "ar" ? "تصفح الأقسام" : "Browse Categories"}</p>
                  <div className={styles.catGrid}>
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}`}
                        className={styles.catItem}
                        onClick={() => setCatOpen(false)}
                        style={{ "--cat-color": cat.color } as React.CSSProperties}
                      >
                        <div className={styles.catImg} style={{ backgroundImage: `url(${cat.image})` }} />
                        <span>{t.lang === "ar" ? cat.nameAr : cat.nameEn}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        <form className={styles.mobileSearch} onSubmit={handleSearch}>
          <button type="submit" className={styles.searchIconBtn} aria-label="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t.searchPlaceholder}
            value={headerSearch}
            onChange={e => setHeaderSearch(e.target.value)}
          />
        </form>
      </div>
    </header>
  );
}
