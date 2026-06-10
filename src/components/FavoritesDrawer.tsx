"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { products, calcPrice } from "@/data/products";
import styles from "./Drawer.module.css";

export default function FavoritesDrawer() {
  const { t, favorites, isFavOpen, setIsFavOpen, toggleFavorite } = useApp();
  const favProducts = products.filter(p => favorites.includes(p.id));

  return (
    <>
      {isFavOpen && <div className={styles.overlay} onClick={() => setIsFavOpen(false)} />}
      <div className={`${styles.drawer} ${isFavOpen ? styles.open : ""}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginInlineEnd:6,verticalAlign:'middle'}}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            {t.favoritesTitle}
          </h2>
          <button className={styles.closeBtn} onClick={() => setIsFavOpen(false)}>✕</button>
        </div>
        <div className={styles.drawerBody}>
          {favProducts.length === 0 ? (
            <div className={styles.empty}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.3"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <p>{t.emptyFavorites}</p>
            </div>
          ) : (
            <div className={styles.itemList}>
              {favProducts.map(p => {
                const name = t.lang === "ar" ? p.nameAr : p.nameEn;
                const price = calcPrice(p, 250);
                return (
                  <div key={p.id} className={styles.cartItem}>
                    <img src={p.image} alt={name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{name}</p>
                      <p className={styles.itemPrice}>{t.lang === "ar" ? "الربع" : "250g"}: {price} {t.egp}</p>
                      <Link href={`/product/${p.id}`} className={styles.viewLink} onClick={() => setIsFavOpen(false)}>
                        {t.lang === "ar" ? "عرض المنتج ←" : "View Product →"}
                      </Link>
                    </div>
                    <button className={styles.removeBtn} onClick={() => toggleFavorite(p.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
