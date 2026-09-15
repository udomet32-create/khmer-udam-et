import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Minus, Plus, Send, ShoppingBag, Video, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

const fallbackImage = "/manus-storage/khmer-udam-product_f1de96af.png";
const provinces = ["ភ្នំពេញ", "កណ្តាល", "សៀមរាប", "បាត់ដំបង", "ព្រះសីហនុ", "កំពង់ចាម", "ខេត្តផ្សេងៗ"];
type CheckoutForm = { name: string; phone: string; address: string; province: string };

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = Number(params?.id);
  const productQuery = trpc.products.getById.useQuery({ id }, { enabled: Number.isInteger(id) && id > 0, retry: false });
  const product = productQuery.data;
  const image = product?.imageUrl || fallbackImage;
  const video = product?.videoUrl || "";
  const [media, setMedia] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState(1);
  const [showOrder, setShowOrder] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({ name: "", phone: "", address: "", province: "ភ្នំពេញ" });
  const [formError, setFormError] = useState("");

  const name = product?.name || "ផលិតផល Khmer Udam ET";
  const code = product?.code || "KU-PRODUCT";
  const price = product ? product.priceCents / 100 : 4.5;
  const total = price * quantity;
  const telegramHref = useMemo(() => {
    const message = [`ការបញ្ជាទិញ Khmer Udam ET`, `ផលិតផល: ${name}`, `Code: ${code}`, `តម្លៃ: $${price.toFixed(2)} × ${quantity}`, `ឈ្មោះ: ${form.name}`, `លេខទូរសព្ទ: ${form.phone}`, `ខេត្ត/ក្រុង: ${form.province}`, `អាសយដ្ឋាន: ${form.address}`].join("\n");
    return `https://t.me/share/url?url=https://khmerudamet.com/product/${id}&text=${encodeURIComponent(message)}`;
  }, [code, form.address, form.name, form.phone, form.province, id, name, price, quantity]);

  const submitOrder = () => {
    if (!form.name.trim() || !/^0[1-9][0-9]{7,9}$/.test(form.phone.replace(/[\s-]/g, "")) || !form.address.trim() || !form.province) {
      setFormError("សូមបំពេញឈ្មោះ លេខទូរសព្ទ អាសយដ្ឋាន និងខេត្ត/ក្រុងឱ្យបានត្រឹមត្រូវ។");
      return;
    }
    setFormError("");
    window.open(telegramHref, "_blank", "noopener,noreferrer");
  };

  return <div className="product-focus-page">
    <div className="focus-toolbar"><Link href="/" aria-label="ត្រឡប់ទៅហាង"><ArrowLeft size={20} /></Link><span>KHMER UDAM ET</span><button onClick={() => setShowOrder(true)} aria-label="បើកការបញ្ជាទិញ"><ShoppingBag size={20} /></button></div>
    <main className="focus-content">
      {productQuery.isLoading ? <div className="admin-loading"><span>កំពុងបើកផលិតផល...</span></div> : <section className="focus-product">
        <div className="focus-media"><div className="focus-main-media">{media === "video" && video ? <video src={video} controls autoPlay muted playsInline /> : <img src={image} alt={name} />}</div><div className="focus-media-tabs"><button className={media === "image" ? "active" : ""} onClick={() => setMedia("image")}><img src={image} alt="រូបភាពផលិតផល" /><span>រូបភាព</span></button>{video && <button className={media === "video" ? "active" : ""} onClick={() => setMedia("video")}><span className="video-thumb"><img src={image} alt="វីដេអូផលិតផល" /><Video size={22} /></span><span>វីដេអូ</span></button>}</div></div>
        <div className="focus-info"><p className="focus-code">{code}</p><h1>{name}</h1><strong className="focus-price">${price.toFixed(2)}</strong><div className="focus-quantity"><span>ចំនួន</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={17} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={17} /></button></div></div><button className="focus-order-button" onClick={() => setShowOrder(true)}>បញ្ជាទិញឥឡូវនេះ <ArrowRight size={20} /></button><p className="focus-total">សរុប: <b>${total.toFixed(2)}</b></p></div>
      </section>}
    </main>
    {showOrder && <div className="drawer-backdrop" onClick={() => setShowOrder(false)}><aside className="order-drawer checkout-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR ORDER</p><h2>ព័ត៌មានការដឹកជញ្ជូន</h2></div><button className="close-button" onClick={() => setShowOrder(false)}><X size={20} /></button></div><div className="order-summary"><img src={image} alt={name} /><div><p>Code: {code}</p><h3>{name}</h3><strong>${total.toFixed(2)} × {quantity}</strong></div></div><div className="checkout-fields"><label><span>ឈ្មោះអ្នកទទួល *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ឈ្មោះពេញ" /></label><label><span>លេខទូរសព្ទ *</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="012 345 678" /></label><label><span>ខេត្ត/ក្រុង *</span><select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>អាសយដ្ឋានលម្អិត *</span><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់/ឃុំ..." /></label></div>{formError && <p className="checkout-error">{formError}</p>}<button className="reference-checkout checkout-submit" onClick={submitOrder}>បន្តទៅ Telegram <Send size={18} /></button></aside></div>}
  </div>;
}
