"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import CheckoutModal from "./CheckoutModal";
import styles from "./Drawer.module.css";

export default function CartDrawer() {
  const { t, cart, isCartOpen, setIsCartOpen, removeFromCart, updateQty, cartTotal } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  function weightLabel(wKey: string) {
    const map: Record<string,string> = { "125g":"125 جرام","250g":"250 جرام","500g":"500 جرام","750g":"750 جرام","1kg":"1000 جرام" };
    return t.lang === "ar" ? (map[wKey] ?? wKey) : wKey;
  }

  return (
    <>
      {isCartOpen && <div className={styles.overlay} onClick={() => setIsCartOpen(false)} />}
      <div className={`${styles.drawer} ${isCartOpen ? styles.open : ""}`}>
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginInlineEnd:6,verticalAlign:'middle'}}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {t.cartTitle}
          </h2>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>✕</button>
        </div>

        <div className={styles.drawerBody}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.3"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <p>{t.emptyCart}</p>
            </div>
          ) : (
            <div className={styles.itemList}>
              {cart.map(item => {
                const name = t.lang === "ar" ? item.nameAr : item.nameEn;
                return (
                  <div key={`${item.id}-${item.selectedWeight}`} className={styles.cartItem}>
                    <img src={item.image} alt={name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{name}</p>
                      <p className={styles.itemWeight}>{weightLabel(item.selectedWeight)}</p>
                      <p className={styles.itemPrice}>{item.finalPrice} {t.egp}</p>
                      <div className={styles.qtyRow}>
                        <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.selectedWeight, item.qty - 1)}>−</button>
                        <span className={styles.qtyNum}>{item.qty}</span>
                        <button className={styles.qtyBtn} onClick={() => updateQty(item.id, item.selectedWeight, item.qty + 1)}>+</button>
                      </div>
                    </div>
                    <button className={styles.removeBtn} onClick={() => removeFromCart(item.id, item.selectedWeight)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.totalRow}>
              <span>{t.total}</span>
              <span className={styles.totalAmount}>{cartTotal} {t.egp}</span>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={() => { setIsCartOpen(false); setShowCheckout(true); }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              {t.checkout}
            </button>
          </div>
        )}
      </div>

      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </>
  );
}
