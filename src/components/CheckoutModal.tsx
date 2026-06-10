"use client";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import styles from "./CheckoutModal.module.css";

const WHATSAPP_NUMBER = "201092559527";
const VODAFONE_CASH   = "01271555092";
const INSTAPAY        = "01271555092"; // same number per request

type PayMethod = "whatsapp_cod" | "instapay" | "vodafone";

interface Props { onClose: () => void; }

export default function CheckoutModal({ onClose }: Props) {
  const { t, cart, cartTotal } = useApp();

  const [name,    setName]    = useState("");
  const [phone,   setPhone]   = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState<PayMethod>("whatsapp_cod");
  const [errors,  setErrors]  = useState<Record<string,string>>({});

  function validate() {
    const e: Record<string,string> = {};
    if (!name.trim())    e.name    = t.lang === "ar" ? "الاسم مطلوب"    : "Name is required";
    if (!phone.trim())   e.phone   = t.lang === "ar" ? "الهاتف مطلوب"   : "Phone is required";
    if (!address.trim()) e.address = t.lang === "ar" ? "العنوان مطلوب"  : "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Build Arabic weight label
  function weightLabel(wKey: string) {
    const map: Record<string,string> = { "125g":"125 جرام","250g":"250 جرام","500g":"500 جرام","750g":"750 جرام","1kg":"1000 جرام" };
    return t.lang === "ar" ? (map[wKey] ?? wKey) : wKey;
  }

  function buildMessage() {
    const payLabels: Record<PayMethod,string> = {
      whatsapp_cod: "عند التوصيل 🚚",
      instapay:     `إنستاباي 💳 (${INSTAPAY})`,
      vodafone:     `فودافون كاش 📱 (${VODAFONE_CASH})`,
    };

    const lines = cart.map((item, idx) => {
      const itemName = t.lang === "ar" ? item.nameAr : item.nameEn;
      const total    = item.finalPrice * item.qty;
      return `${idx + 1}. *${itemName}* (${item.qty} × ${weightLabel(item.selectedWeight)}) — ${total} ج.م`;
    });

    return (
`🛒 *طلب جديد من تسالي الربيع 🌿*
*الفرع:* الغردقة
*الاسم:* ${name.trim()}
*الهاتف:* ${phone.trim()}
*العنوان:* ${address.trim()}
*طريقة الدفع:* ${payLabels[payMethod]}
----------------------------
${lines.join("\n")}
----------------------------
*الإجمالي:* ${cartTotal} ج.م
يرجى التواصل لترتيب التوصيل 🙏`
    );
  }

  function handleSubmit() {
    if (!validate()) return;
    const msg = buildMessage();
    const url  = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
  }

  const payOptions: { key: PayMethod; icon: string; label: string; sub: string }[] = [
    { key: "whatsapp_cod", icon: "🚚", label: t.lang === "ar" ? "الدفع عند التوصيل" : "Cash on Delivery",  sub: t.lang === "ar" ? "ادفع لما البضاعة توصلك" : "Pay when you receive" },
    { key: "instapay",     icon: "💳", label: "InstaPay",                                                   sub: `رقم: ${INSTAPAY}` },
    { key: "vodafone",     icon: "📱", label: "Vodafone Cash",                                              sub: `رقم: ${VODAFONE_CASH}` },
  ];

  return (
    <div className={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.waIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            </div>
            <div>
              <h2 className={styles.modalTitle}>{t.lang === "ar" ? "إتمام الطلب عبر واتساب" : "Order via WhatsApp"}</h2>
              <p className={styles.modalSub}>{t.lang === "ar" ? "أدخل بياناتك وسنرسل طلبك مباشرة" : "Fill your details and we'll send your order"}</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.modalBody}>
          {/* Order summary */}
          <div className={styles.orderSummary}>
            <p className={styles.summaryTitle}>{t.lang === "ar" ? "ملخص الطلب" : "Order Summary"}</p>
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedWeight}`} className={styles.summaryItem}>
                <span className={styles.summaryName}>{t.lang === "ar" ? item.nameAr : item.nameEn}</span>
                <span className={styles.summaryMeta}>{item.qty} × {weightLabel(item.selectedWeight)}</span>
                <span className={styles.summaryPrice}>{item.finalPrice * item.qty} {t.egp}</span>
              </div>
            ))}
            <div className={styles.summaryTotal}>
              <span>{t.total}</span>
              <span className={styles.totalNum}>{cartTotal} {t.egp}</span>
            </div>
          </div>

          {/* Form */}
          <div className={styles.form}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>{t.lang === "ar" ? "الاسم الكامل *" : "Full Name *"}</label>
                <input
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder={t.lang === "ar" ? "مثال: بيشوي عازر" : "e.g. John Doe"}
                  value={name} onChange={e => { setName(e.target.value); setErrors(v => ({...v, name:""})); }}
                />
                {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t.lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}</label>
                <input
                  className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  placeholder="01xxxxxxxxx"
                  value={phone} onChange={e => { setPhone(e.target.value); setErrors(v => ({...v, phone:""})); }}
                  type="tel" dir="ltr"
                />
                {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>{t.lang === "ar" ? "عنوان التوصيل *" : "Delivery Address *"}</label>
              <input
                className={`${styles.input} ${errors.address ? styles.inputError : ""}`}
                placeholder={t.lang === "ar" ? "الحي / الشارع / المبنى..." : "Street / Area / Building..."}
                value={address} onChange={e => { setAddress(e.target.value); setErrors(v => ({...v, address:""})); }}
              />
              {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
            </div>

            {/* Payment method */}
            <div className={styles.field}>
              <label className={styles.label}>{t.lang === "ar" ? "طريقة الدفع *" : "Payment Method *"}</label>
              <div className={styles.payGrid}>
                {payOptions.map(opt => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`${styles.payCard} ${payMethod === opt.key ? styles.payActive : ""}`}
                    onClick={() => setPayMethod(opt.key)}
                  >
                    <span className={styles.payIcon}>{opt.icon}</span>
                    <span className={styles.payLabel}>{opt.label}</span>
                    <span className={styles.paySub}>{opt.sub}</span>
                    {payMethod === opt.key && <span className={styles.payCheck}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {t.lang === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            {t.lang === "ar" ? "أرسل الطلب عبر واتساب" : "Send Order via WhatsApp"}
          </button>
        </div>
      </div>
    </div>
  );
}
