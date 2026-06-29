"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./admin.module.css";

interface Product {
  id: number;
  category_id: string;
  name_ar: string;
  name_en: string;
  price_per_kg: number;
  price_125g?: number;
  price_250g?: number;
  price_500g?: number;
  price_750g?: number;
  price_1kg?: number;
  image: string;
  unit_price?: number;
  sold_by_unit: boolean;
  in_stock: boolean;
  badge?: string;
  discount?: number;
  flavors?: string[];
  description?: string;
}

interface Category { id: string; name_ar: string; name_en: string; }

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  category_id: "peanuts", name_ar: "", name_en: "",
  price_per_kg: 0, image: "", sold_by_unit: false, in_stock: true,
};

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [password, setPassword] = useState("");
  const [authErr,  setAuthErr]  = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [selCat,     setSelCat]     = useState("peanuts");
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState("");

  const [modal,    setModal]   = useState<"add"|"edit"|null>(null);
  const [editProd, setEditProd] = useState<Partial<Product>>(EMPTY_PRODUCT);
  const [saving,   setSaving]  = useState(false);
  const [msg,      setMsg]     = useState("");

  // Login
  async function handleLogin() {
    const res = await fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ password }) });
    if (res.ok) { setAuthed(true); setAuthErr(""); }
    else setAuthErr("باسورد غلط!");
  }

  // Load categories
  useEffect(() => {
    if (!authed) return;
    fetch('/api/categories').then(r => r.json()).then(setCategories);
  }, [authed]);

  // Load products
  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/products?category=${selCat}&t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [selCat]);

  useEffect(() => { if (authed) loadProducts(); }, [authed, loadProducts]);

  // Save product
  async function handleSave() {
    setSaving(true);
    setMsg("");
    const isEdit = modal === "edit" && editProd.id;
    const url  = isEdit ? `/api/products/${editProd.id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    // Build payload
    const payload: Record<string,unknown> = {
      category_id: editProd.category_id,
      name_ar:     editProd.name_ar,
      name_en:     editProd.name_en,
      price_per_kg: Number(editProd.price_per_kg) || 0,
      image:       editProd.image || "",
      sold_by_unit: editProd.sold_by_unit ?? false,
      in_stock:    editProd.in_stock ?? true,
      badge:       editProd.badge || null,
      discount:    editProd.discount ? Number(editProd.discount) : null,
      description: editProd.description || null,
      flavors:     editProd.flavors?.length ? editProd.flavors : null,
    };
    if (editProd.sold_by_unit) {
      payload.unit_price = Number(editProd.unit_price) || 0;
 } else {
  // لو في أسعار مخصصة حطها، لو لأ احسبها من pricePerKg
  const kg = Number(editProd.price_per_kg) || 0;
  payload.price_125g = Number(editProd.price_125g) || Math.round(kg * 125 / 1000);
  payload.price_250g = Number(editProd.price_250g) || Math.round(kg * 250 / 1000);
  payload.price_500g = Number(editProd.price_500g) || Math.round(kg * 500 / 1000);
  payload.price_750g = Number(editProd.price_750g) || Math.round(kg * 750 / 1000);
  payload.price_1kg  = Number(editProd.price_1kg)  || kg;
}

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type':'application/json', 'x-admin-password': password },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMsg(isEdit ? "✅ تم التعديل!" : "✅ تم الإضافة!");
      setModal(null);
      loadProducts();
    } else {
      const err = await res.json();
      setMsg("❌ " + (err.error || "خطأ"));
    }
    setSaving(false);
  }

  // Delete
  async function handleDelete(id: number, name: string) {
    if (!confirm(`هتمسح "${name}"؟`)) return;
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': password },
    });
    if (res.ok) { setMsg("✅ تم الحذف"); loadProducts(); }
    else setMsg("❌ خطأ في الحذف");
  }

  const filtered = products.filter(p =>
    p.name_ar.toLowerCase().includes(search.toLowerCase()) ||
    p.name_en.toLowerCase().includes(search.toLowerCase())
  );

  // ── Login screen ──
  if (!authed) return (
    <div className={styles.loginPage}>
      <div className={styles.loginCard}>
        <div className={styles.loginLogo}>
          <Image src="/logo.jpg" alt="تسالي الربيع" width={80} height={80} className={styles.logoImg} />
        </div>
        <h1 className={styles.loginTitle}>لوحة التحكم</h1>
        <p className={styles.loginSub}>تسالي الربيع — Admin Panel</p>
        <input
          type="password"
          className={styles.loginInput}
          placeholder="أدخل كلمة المرور"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          autoFocus
        />
        {authErr && <p className={styles.loginErr}>{authErr}</p>}
        <button className={styles.loginBtn} onClick={handleLogin}>دخول →</button>
      </div>
    </div>
  );

  // ── Admin panel ──
  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <header className={styles.adminHeader}>
        <div className={styles.headerLeft}>
          <Image src="/logo.jpg" alt="logo" width={40} height={40} className={styles.headerLogo} />
          <div>
            <h1 className={styles.headerTitle}>لوحة التحكم</h1>
            <p className={styles.headerSub}>تسالي الربيع</p>
          </div>
        </div>
        <button className={styles.addBtn} onClick={() => { setEditProd({...EMPTY_PRODUCT, category_id: selCat}); setModal("add"); }}>
          + إضافة منتج جديد
        </button>
      </header>

      {msg && <div className={`${styles.msgBar} ${msg.startsWith("✅") ? styles.msgOk : styles.msgErr}`}>{msg}</div>}

      <div className={styles.adminBody}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>الأقسام</p>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${selCat === cat.id ? styles.catActive : ""}`}
              onClick={() => setSelCat(cat.id)}
            >
              {cat.name_ar}
              <span className={styles.catCount}>
                {products.filter(p => p.category_id === cat.id).length}
              </span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className={styles.main}>
          {/* Search */}
          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="ابحث في المنتجات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className={styles.countBadge}>{filtered.length} منتج</span>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {Array.from({length: 6}).map((_,i) => <div key={i} className={styles.skeleton}/>)}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filtered.map(p => (
                <div key={p.id} className={`${styles.productCard} ${!p.in_stock ? styles.outOfStock : ""}`}>
                  <div className={styles.cardImg}>
                    <img src={p.image} alt={p.name_ar} loading="lazy" />
                    {p.badge && <span className={`${styles.badge} ${styles[p.badge]}`}>{p.badge}</span>}
                    {!p.in_stock && <div className={styles.outBadge}>غير متوفر</div>}
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.cardName}>{p.name_ar}</p>
                    <p className={styles.cardNameEn}>{p.name_en}</p>
                    <p className={styles.cardPrice}>
                      {p.sold_by_unit ? `${p.unit_price} ج.م / قطعة` : `${p.price_per_kg} ج.م / كجم`}
                    </p>
                    {p.flavors && p.flavors.length > 0 && (
                      <p className={styles.cardFlavors}>🌶️ {p.flavors.length} أطعم</p>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.editBtn} onClick={() => { setEditProd(p); setModal("edit"); }}>
                      ✏️ تعديل
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(p.id, p.name_ar)}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modal && (
        <div className={styles.modalBackdrop} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>{modal === "add" ? "➕ إضافة منتج جديد" : "✏️ تعديل المنتج"}</h2>
              <button onClick={() => setModal(null)}>✕</button>
            </div>
            <div className={styles.modalBody}>
              {/* Names */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>الاسم بالعربي *</label>
                  <input value={editProd.name_ar || ""} onChange={e => setEditProd(p => ({...p, name_ar: e.target.value}))} placeholder="مثال: كاجو ملح" />
                </div>
                <div className={styles.formField}>
                  <label>الاسم بالإنجليزي *</label>
                  <input value={editProd.name_en || ""} onChange={e => setEditProd(p => ({...p, name_en: e.target.value}))} placeholder="e.g. Salted Cashews" />
                </div>
              </div>

              {/* Category + Badge */}
              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label>القسم</label>
                  <select value={editProd.category_id || "peanuts"} onChange={e => setEditProd(p => ({...p, category_id: e.target.value}))}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
                  </select>
                </div>
                <div className={styles.formField}>
                  <label>الـ Badge</label>
                  <select value={editProd.badge || ""} onChange={e => setEditProd(p => ({...p, badge: e.target.value || undefined}))}>
                    <option value="">بدون</option>
                    <option value="hot">🔥 رائج</option>
                    <option value="new">✨ جديد</option>
                    <option value="sale">🏷️ خصم</option>
                  </select>
                </div>
              </div>

              {/* Sold by unit toggle */}
              <div className={styles.toggleRow}>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={editProd.sold_by_unit || false}
                    onChange={e => setEditProd(p => ({...p, sold_by_unit: e.target.checked}))} />
                  <span className={styles.toggleSlider} />
                </label>
                <span>{editProd.sold_by_unit ? "بالقطعة" : "بالكيلو (وزن)"}</span>
              </div>

              {/* Prices */}
              {editProd.sold_by_unit ? (
                <div className={styles.formField}>
                  <label>سعر القطعة (ج.م) *</label>
                  <input type="number" value={editProd.unit_price || ""} onChange={e => setEditProd(p => ({...p, unit_price: Number(e.target.value)}))} />
                </div>
              ) : (
                <>
                  <div className={styles.formField}>
                    <label>سعر الكيلو (ج.م) *</label>
                    <input type="number" value={editProd.price_per_kg || ""} onChange={e => setEditProd(p => ({...p, price_per_kg: Number(e.target.value)}))} />
                  </div>
                  <p className={styles.priceNote}>أسعار مخصصة (اختياري):</p>
                  <div className={styles.pricesGrid}>
                    {[["125g","125 جرام"],["250g","250 جرام"],["500g","500 جرام"],["750g","750 جرام"],["1kg","1 كيلو"]].map(([key,lbl]) => (
                      <div key={key} className={styles.priceItem}>
                        <label>{lbl}</label>
                        <input type="number" placeholder="تلقائي"
                          value={(editProd as Record<string,unknown>)[`price_${key}`] as number || ""}
                          onChange={e => setEditProd(p => ({...p, [`price_${key}`]: e.target.value ? Number(e.target.value) : undefined}))} />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Discount */}
              {editProd.badge === "sale" && (
                <div className={styles.formField}>
                  <label>نسبة الخصم %</label>
                  <input type="number" min="1" max="99" value={editProd.discount || ""} onChange={e => setEditProd(p => ({...p, discount: Number(e.target.value)}))} />
                </div>
              )}

              {/* Image */}
              <div className={styles.formField}>
                <label>مسار الصورة *</label>
                <input value={editProd.image || ""} onChange={e => setEditProd(p => ({...p, image: e.target.value}))} placeholder="/اسم-الصورة.jpg أو رابط https://" />
                {editProd.image && <img src={editProd.image} alt="preview" className={styles.imgPreview} />}
              </div>

              {/* Flavors */}
              <div className={styles.formField}>
                <label>الأطعم (كل طعم في سطر)</label>
                <textarea
                  rows={3}
                  placeholder={"مثال:\nجبنة\nكاتشب\nحار"}
                  value={editProd.flavors?.join("\n") || ""}
                  onChange={e => setEditProd(p => ({...p, flavors: e.target.value.split("\n").filter(Boolean)}))}
                />
              </div>

              {/* Description */}
              <div className={styles.formField}>
                <label>وصف (اختياري)</label>
                <textarea rows={2} value={editProd.description || ""} onChange={e => setEditProd(p => ({...p, description: e.target.value}))} />
              </div>

              {/* In stock */}
              <div className={styles.toggleRow}>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={editProd.in_stock ?? true}
                    onChange={e => setEditProd(p => ({...p, in_stock: e.target.checked}))} />
                  <span className={styles.toggleSlider} />
                </label>
                <span>{editProd.in_stock ? "✅ متوفر" : "❌ غير متوفر"}</span>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={() => setModal(null)}>إلغاء</button>
              <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "جاري الحفظ..." : (modal === "add" ? "➕ إضافة" : "💾 حفظ التعديلات")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
