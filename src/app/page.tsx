"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { categories, products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import styles from "./page.module.css";

export default function HomePage() {
  const { t } = useApp();
  const featured = products.filter(p => p.badge === "hot" || p.badge === "sale");
  const offerProducts = products.filter(p => p.categoryId === "offers");
  const displayCats = categories.filter(c => c.id !== "offers");

  function scrollCats(dir: "prev" | "next") {
    const el = document.getElementById("catScroll");
    if (!el) return;
    // عربي: prev = يمين (موجب)، next = شمال (سالب)
    // إنجليزي: prev = شمال (سالب)، next = يمين (موجب)
    const rtl = t.lang === "ar";
    const amount = dir === "prev"
      ? (rtl ?  220 : -220)
      : (rtl ? -220 :  220);
    el.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>{t.heroLabel}</span>
          <h1 className={styles.heroTitle}>{t.heroTitle}</h1>
          <p className={styles.heroSub}>{t.heroSubtitle}</p>
          <div className={styles.heroBtns}>
            <Link href="/category/nuts" className={styles.heroBtn}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {t.heroCta2}
            </Link>
            <Link href="/category/offers" className={`${styles.heroBtn} ${styles.heroBtnOutline}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
              {t.heroCta1}
            </Link>
          </div>
        </div>
        <div className={styles.heroCards}>
          {categories.slice(0, 3).map(cat => (
            <Link key={cat.id} href={`/category/${cat.id}`} className={styles.heroCard}>
              <div className={styles.heroCardImg} style={{ backgroundImage: `url(${cat.image})` }} />
              <span>{t.lang === "ar" ? cat.nameAr : cat.nameEn}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Offers banner ── */}
      {offerProducts.length > 0 && (
        <section className={styles.offersBanner}>
          <div className={styles.offersInner}>
            <div className={styles.offersLeft}>
              <span className={styles.offersTag}>🔥 {t.lang === "ar" ? "عروض حصرية" : "Special Offers"}</span>
              <h2>{t.lang === "ar" ? "تخفيضات مميزة الآن!" : "Amazing Deals Now!"}</h2>
              <p>{t.lang === "ar" ? "استغل العروض قبل انتهائها" : "Grab deals before they expire"}</p>
            </div>
            <Link href="/category/offers" className={styles.offersBtn}>
              {t.lang === "ar" ? "شوف كل العروض ←" : "View All Offers →"}
            </Link>
          </div>
        </section>
      )}

      {/* ── Categories horizontal scroll ── */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>{t.categoriesTitle}</h2>
            <div className={styles.titleUnderline} />
          </div>

          <div className={styles.catScrollWrapper}>
            {/* زر السابق */}
            <button
              className={`${styles.catScrollBtn} ${styles.catScrollBtnPrev}`}
              onClick={() => scrollCats("prev")}
              aria-label="previous"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>

            <div className={styles.catGrid} id="catScroll">
              {displayCats.map(cat => (
                <Link key={cat.id} href={`/category/${cat.id}`} className={styles.catCard}>
                  <div className={styles.catCardImg} style={{ backgroundImage: `url(${cat.image})` }} />
                  <div className={styles.catCardOverlay} style={{ background: cat.gradient }} />
                  <div className={styles.catCardContent}>
                    <span className={styles.catCardCount}>
                      {products.filter(p => p.categoryId === cat.id).length}{" "}
                      {t.lang === "ar" ? "منتج" : "items"}
                    </span>
                    <span className={styles.catCardName}>
                      {t.lang === "ar" ? cat.nameAr : cat.nameEn}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* زر التالي */}
            <button
              className={`${styles.catScrollBtn} ${styles.catScrollBtnNext}`}
              onClick={() => scrollCats("next")}
              aria-label="next"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Featured products ── */}
      {featured.length > 0 && (
        <section className={styles.sectionGray}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>{t.featuredTitle}</h2>
              <div className={styles.titleUnderline} />
            </div>
            <div className={styles.prodGrid}>
              {featured.slice(0, 10).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Bottom banner ── */}
      <section className={styles.banner}>
        <div className={styles.bannerInner}>
          <div className={styles.bannerText}>
            <h3>{t.lang === "ar" ? "جودة لا تُنافَس منذ 1972" : "Unmatched Quality Since 1972"}</h3>
            <p>{t.lang === "ar" ? "أفضل المحمصات والمكسرات بأسعار مناسبة وجودة ممتازة" : "Best roasted nuts and snacks at great prices"}</p>
          </div>
          <Link href="/category/peanuts" className={styles.bannerBtn}>
            {t.lang === "ar" ? "تسوق الآن" : "Shop Now"}
          </Link>
        </div>
      </section>

    </div>
  );
}
