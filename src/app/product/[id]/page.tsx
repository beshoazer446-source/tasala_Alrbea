"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { products, categories, WEIGHT_OPTIONS, calcPrice } from "@/data/products";
import { useApp } from "@/context/AppContext";
import styles from "./page.module.css";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t, addToCart, toggleFavorite, isFavorite, setIsCartOpen } = useApp();
  const product = products.find(p => p.id === Number(id));

  const [selectedWeight, setSelectedWeight] = useState(WEIGHT_OPTIONS[1]);
  const [qty, setQty]                       = useState(1);
  const [added, setAdded]                   = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [flavorError, setFlavorError]       = useState(false);
  const [activeImg, setActiveImg]           = useState(0);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>المنتج غير موجود</p>
        <button onClick={() => router.back()}>رجوع</button>
      </div>
    );
  }

  const name       = t.lang === "ar" ? product.nameAr : product.nameEn;
  const category   = categories.find(c => c.id === product.categoryId);
  const catName    = t.lang === "ar" ? category?.nameAr : category?.nameEn;
  const hasFlavors = !!(product.flavors && product.flavors.length > 0);
  const isByUnit   = !!product.soldByUnit;

  // صور — لو في images[] استخدمها، غيره الصورة الواحدة
  const allImages = product.images && product.images.length > 0
    ? product.images
    : [product.image];

  // لو طعم متاحتله صورة خاصة، وإلا استخدم الصورة الحالية بالـ index
  const displayImg = product.flavorImages && selectedFlavor && product.flavorImages[selectedFlavor]
    ? product.flavorImages[selectedFlavor]
    : allImages[activeImg] ?? product.image;

  // السعر
  const displayPrice = isByUnit
    ? (product.unitPrice ?? 0)
    : calcPrice(product, selectedWeight.grams);

  const originalPrice = product.discount
    ? Math.round(displayPrice / (1 - product.discount / 100))
    : null;

  function handleAddToCart() {
    if (!product || !product.inStock) return;
    if (hasFlavors && !selectedFlavor) { setFlavorError(true); return; }
    setFlavorError(false);
    const itemName = hasFlavors && selectedFlavor
      ? { ar: `${product.nameAr} — ${selectedFlavor}`, en: `${product.nameEn} — ${selectedFlavor}` }
      : { ar: product.nameAr, en: product.nameEn };
    addToCart({
      ...product,
      nameAr: itemName.ar,
      nameEn: itemName.en,
      qty,
      selectedWeight: isByUnit ? "unit" : selectedWeight.key,
      weightGrams:    isByUnit ? 0      : selectedWeight.grams,
      finalPrice:     displayPrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    if (hasFlavors && !selectedFlavor) { setFlavorError(true); return; }
    handleAddToCart();
    setIsCartOpen(true);
  }

  // اختيار طعم → قلّب الصورة
  function handleFlavorSelect(fl: string) {
    setSelectedFlavor(fl);
    setFlavorError(false);
    if (!product) return;
    // لو مفيش flavorImages، قلّب بالـ index
    if (!product.flavorImages) {
      const idx = product.flavors?.indexOf(fl) ?? 0;
      setActiveImg(Math.min(idx, allImages.length - 1));
    }
  }

  const related = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 6);

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadInner}>
          <Link href="/">{t.home}</Link>
          <span className={styles.sep}>›</span>
          <Link href={`/category/${product.categoryId}`}>{catName}</Link>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{name}</span>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.productGrid}>

          {/* ── Image gallery ── */}
          <div className={styles.imageCol}>
            {/* Main image */}
            <div className={styles.imgWrapper}>
              <img src={displayImg} alt={name} className={styles.img} key={displayImg} />
              {product.badge && (
                <span className={`${styles.badge} ${styles[product.badge]}`}>
                  {product.badge === "new" ? (t.lang === "ar" ? "جديد" : "New")
                    : product.badge === "hot" ? "🔥 رائج"
                    : (t.lang === "ar" ? `خصم ${product.discount}%` : `${product.discount}% Off`)}
                </span>
              )}
              {isByUnit && (
                <span className={styles.unitBadge}>
                  {t.lang === "ar" ? "بالقطعة" : "Per Unit"}
                </span>
              )}
              {!product.inStock && (
                <div className={styles.outOfStockOverlay}>{t.outOfStock}</div>
              )}
            </div>

            {/* Thumbnails — لو في أكتر من صورة */}
            {allImages.length > 1 && (
              <div className={styles.thumbRow}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${activeImg === i && !selectedFlavor ? styles.thumbActive : ""}`}
                    onClick={() => { setActiveImg(i); setSelectedFlavor(""); }}
                  >
                    <img src={img} alt={`${name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className={styles.detailsCol}>
            <div className={styles.categoryTag} style={{ background: category?.gradient }}>
              {catName}
            </div>

            <h1 className={styles.productName}>{name}</h1>

            {product.description && (
              <p className={styles.productDesc}>{product.description}</p>
            )}

            {/* Price */}
            <div className={styles.priceBox}>
              <span className={styles.bigPrice}>{displayPrice} {t.egp}</span>
              {originalPrice && (
                <span className={styles.oldPrice}>{originalPrice} {t.egp}</span>
              )}
              {product.discount && (
                <span className={styles.discountTag}>خصم {product.discount}%</span>
              )}
            </div>
            <p className={styles.priceNote}>
              {isByUnit
                ? (t.lang === "ar" ? "السعر للقطعة الواحدة" : "Price per unit")
                : (t.lang === "ar" ? `السعر لـ ${selectedWeight.label}` : `Price for ${selectedWeight.labelEn}`)}
            </p>

            {/* Weight selector — فقط للمنتجات بالكيلو */}
            {!isByUnit && (
              <div className={styles.weightSection}>
                <p className={styles.sectionLabel}>
                  {t.lang === "ar" ? "اختر الوزن" : "Select Weight"}
                </p>
                <div className={styles.weightGrid}>
                  {WEIGHT_OPTIONS.map(w => (
                    <button
                      key={w.key}
                      className={`${styles.weightBtn} ${selectedWeight.key === w.key ? styles.weightActive : ""}`}
                      onClick={() => setSelectedWeight(w)}
                    >
                      <span className={styles.weightLabel}>{t.lang === "ar" ? w.label : w.labelEn}</span>
                      <span className={styles.weightPrice}>{calcPrice(product, w.grams)} {t.egp}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavors */}
            {hasFlavors && (
              <div className={`${styles.flavorSection} ${flavorError ? styles.flavorError : ""}`}>
                <p className={styles.sectionLabel}>
                  {t.lang === "ar" ? "اختر الطعم *" : "Select Flavor *"}
                  {flavorError && (
                    <span className={styles.flavorRequired}>
                      {t.lang === "ar" ? " — مطلوب" : " — required"}
                    </span>
                  )}
                </p>
                <div className={styles.flavorGrid}>
                  {product.flavors!.map(fl => (
                    <button
                      key={fl}
                      className={`${styles.flavorBtn} ${selectedFlavor === fl ? styles.flavorActive : ""}`}
                      onClick={() => handleFlavorSelect(fl)}
                    >
                      {fl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className={styles.qtySection}>
              <p className={styles.sectionLabel}>{t.qty}</p>
              <div className={styles.qtyRow}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                <span className={styles.qtyTotal}>= {displayPrice * qty} {t.egp}</span>
              </div>
            </div>

            {/* CTA */}
            <div className={styles.ctaRow}>
              <button
                className={`${styles.addCartBtn} ${added ? styles.addedAnim : ""}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {added
                  ? (t.lang === "ar" ? "✓ تمت الإضافة!" : "✓ Added!")
                  : t.addToCart}
              </button>
              <button
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                {t.lang === "ar" ? "اشتري الآن" : "Buy Now"}
              </button>
              <button
                className={`${styles.favCircle} ${isFavorite(product.id) ? styles.favActive : ""}`}
                onClick={() => toggleFavorite(product.id)}
                aria-label={t.addToFavorites}
              >
                <svg viewBox="0 0 24 24" fill={isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Stock */}
            <div className={styles.stockRow}>
              <span className={`${styles.stockDot} ${product.inStock ? styles.inStock : styles.outStock}`}/>
              <span className={styles.stockLabel}>
                {product.inStock ? t.inStock : t.outOfStock}
              </span>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>
              {t.lang === "ar" ? "منتجات من نفس القسم" : "More from this Category"}
            </h2>
            <div className={styles.relatedGrid}>
              {related.map(rp => {
                const rName  = t.lang === "ar" ? rp.nameAr : rp.nameEn;
                const rPrice = rp.soldByUnit ? (rp.unitPrice ?? 0) : calcPrice(rp, 250);
                return (
                  <Link key={rp.id} href={`/product/${rp.id}`} className={styles.relatedCard}>
                    <img src={rp.image} alt={rName} className={styles.relatedImg} />
                    <div className={styles.relatedInfo}>
                      <p className={styles.relatedName}>{rName}</p>
                      <p className={styles.relatedPrice}>{rPrice} {t.egp}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
