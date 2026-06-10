"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Product, calcPrice } from "@/data/products";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product }: { product: Product }) {
  const { t, toggleFavorite, isFavorite } = useApp();
  const fav = isFavorite(product.id);
  const name = t.lang === "ar" ? product.nameAr : product.nameEn;

  const isByUnit  = !!product.soldByUnit;
  // شوكولاتة بالكيلو → اعرض سعر الكيلو، غيره → سعر الربع (250g)
  const isKgDisplay = product.categoryId === "choc_kg";
  const basePrice = isByUnit
    ? (product.unitPrice ?? 0)
    : isKgDisplay
      ? calcPrice(product, 1000)
      : calcPrice(product, 250);
  const hasFlavors = product.flavors && product.flavors.length > 0;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.id}`} className={styles.imgLink}>
        <div className={styles.imgWrapper}>
          <img src={product.image} alt={name} className={styles.img} loading="lazy" />
          {product.badge && (
            <span className={`${styles.badge} ${styles[product.badge]}`}>
              {product.badge === "new" ? (t.lang === "ar" ? "جديد" : "New")
                : product.badge === "hot" ? "🔥"
                : (t.lang === "ar" ? `${product.discount}% خصم` : `${product.discount}% Off`)}
            </span>
          )}
          {hasFlavors && (
            <span className={styles.flavorTag}>
              {t.lang === "ar" ? "متعدد الأطعم" : "Multi-flavor"}
            </span>
          )}
          {isByUnit && (
            <span className={styles.unitTag}>
              {t.lang === "ar" ? "بالقطعة" : "Per Unit"}
            </span>
          )}
          {!product.inStock && <div className={styles.outOfStock}>{t.outOfStock}</div>}
        </div>
      </Link>

      <button
        className={`${styles.favBtn} ${fav ? styles.favActive : ""}`}
        onClick={() => toggleFavorite(product.id)}
        aria-label={fav ? t.removeFromFavorites : t.addToFavorites}
      >
        <svg viewBox="0 0 24 24" fill={fav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <div className={styles.info}>
        <Link href={`/product/${product.id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{name}</h3>
        </Link>
        <div className={styles.priceRow}>
          <div>
            <span className={styles.priceLabel}>
              {isByUnit
                ? (t.lang === "ar" ? "القطعة" : "Unit")
                : isKgDisplay
                  ? (t.lang === "ar" ? "الكيلو" : "per Kg")
                  : (t.lang === "ar" ? "الربع" : "250g")}
            </span>
            <span className={styles.price}> {basePrice} {t.egp}</span>
          </div>
          <Link href={`/product/${product.id}`} className={`${styles.addBtn} ${!product.inStock ? styles.addBtnDisabled : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
