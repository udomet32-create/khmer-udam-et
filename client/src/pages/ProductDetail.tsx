import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Facebook, Heart, MessageCircle, Minus, Plus, Send, Share2, ShoppingBag, Video, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

const fallbackImage = "/manus-storage/khmer-udam-product_f1de96af.png";
const fallbackPoster = "/manus-storage/khmer-udam-poster_b68ee22f.png";
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
  const [variant, setVariant] = useState("តពាក់ 1");
  const [size, setSize] = useState("One size");
  const [liked, setLiked] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({ name: "", phone: "", address: "", province: "ភ្នំពេញ" });
  const [formError, setFormError] = useState("");

  const name = product?.name || "ខ្សែក្រវ៉ាត់ស្បែក Urban";
  const code = product?.code || "KU-BELT-001";
  const price = product ? product.priceCents / 100 : 4.5;
  const total = price * quantity;
  const telegramHref = useMemo(() => {
    const message = [`ការបញ្ជាទិញ Khmer Udam ET`, `ផលិតផល: ${name}`, `Code: ${code}`, `តម្លៃ: $${price.toFixed(2)} × ${quantity}`, `Variant: ${variant}`, `Size: ${size}`, `ឈ្មោះ: ${form.name}`, `លេខទូរសព្ទ: ${form.phone}`, `ខេត្ត/ក្រុង: ${form.province}`, `អាសយដ្ឋាន: ${form.address}`].join("\n");
    return `https://t.me/share/url?url=https://khmerudamet.com/product/${id}&text=${encodeURIComponent(message)}`;
  }, [addressKey(form), code, form.name, form.phone, form.province, id, name, price, quantity, size, variant]);

  const addToCart = () => {
    try {
      const current = JSON.parse(localStorage.getItem("khmer-udam-cart") || "[]") as number[];
      if (!current.includes(id)) localStorage.setItem("khmer-udam-cart", JSON.stringify([...current, id]));
    } catch {
      localStorage.setItem("khmer-udam-cart", JSON.stringify([id]));
    }
    window.location.href = "/?cart=1";
  };

  const submitOrder = () => {
    if (!form.name.trim() || !/^0[1-9][0-9]{7,9}$/.test(form.phone.replace(/[\s-]/g, "")) || !form.address.trim() || !form.province) { setFormError("សូមបំពេញឈ្មោះ លេខទូរសព្ទ អាសយដ្ឋាន និងខេត្ត/ក្រុងឱ្យបានត្រឹមត្រូវ។"); return; }
    setFormError(""); window.open(telegramHref, "_blank", "noopener,noreferrer");
  };

  return <div className="storefront detail-page"><div className="top-ribbon"><span>✦ ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30</span><span className="ribbon-hide">បង់ប្រាក់ពេលទទួលទំនិញបាន</span></div><header className="site-header"><div className="header-inner"><Link className="back-link" href="/"><ArrowLeft size={18} /><span>ត្រឡប់</span></Link><a className="brand" href="/"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><button className="cart-pill detail-cart" onClick={() => setShowOrder(true)}><ShoppingBag size={19} /><span>កន្ត្រក</span></button></div></header>
    <main className="detail-main"><div className="detail-hero-strip"><img src={fallbackPoster} alt="Khmer Udam ET collection" /></div>{productQuery.isLoading ? <div className="admin-loading"><span>កំពុងបើកផលិតផល...</span></div> : <section className="product-detail-card"><div className="detail-gallery"><div className="detail-main-image">{media === "video" && video ? <video src={video} controls autoPlay muted /> : <img src={image} alt={name} />}<span className="gallery-count">{media === "video" ? "VIDEO" : "01/01"}</span></div><div className="detail-thumbs"><button className={`detail-thumb ${media === "image" ? "selected" : ""}`} onClick={() => setMedia("image")}><img src={image} alt="Product thumbnail" /></button>{video && <button className={`detail-thumb video-thumb ${media === "video" ? "selected" : ""}`} onClick={() => setMedia("video")}><img src={image} alt="Product video" /><span><Video size={18} /></span></button>}</div></div><div className="detail-options"><h2>ជម្រើស</h2><button className="variant-card chosen" onClick={() => setVariant("តពាក់ 1")}><img src={image} alt="Variant" /><span>{variant}</span></button><h2>សាយ</h2><div className="size-row"><button className="selected" onClick={() => setSize("One size")}>One size</button></div></div><div className="detail-price"><p>Code: <strong>{code}</strong></p><div>${price.toFixed(2)}</div><div className="quantity-row"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button></div><button className="add-order-button" onClick={addToCart}>បញ្ចូលទៅកន្ត្រក <Plus size={21} /></button></div><div className="detail-share"><div className="share-label"><Share2 size={18} /> <span>ចែករំលែក</span></div><div className="detail-share-buttons"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={18} /></a><a href={telegramHref} target="_blank" rel="noreferrer"><Send size={18} /></a><a href={`https://wa.me/?text=${encodeURIComponent(`${name} ${image}`)}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /></a><button onClick={() => setLiked(!liked)} className={liked ? "liked" : ""}><Heart size={18} fill={liked ? "currentColor" : "none"} /></button></div></div></section>}</main><a className="floating-telegram" href={telegramHref} target="_blank" rel="noreferrer"><Send size={19} /><span>Chat Telegram</span></a>
    {showOrder && <div className="drawer-backdrop" onClick={() => setShowOrder(false)}><aside className="order-drawer checkout-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">CHECKOUT · YOUR ORDER</p><h2>ព័ត៌មានការដឹកជញ្ជូន</h2></div><button className="close-button" onClick={() => setShowOrder(false)}><X size={20} /></button></div><div className="order-summary"><img src={image} alt={name} /><div><p>Code: {code}</p><h3>{name}</h3><strong>${total.toFixed(2)} × {quantity}</strong><small>{variant} · {size}</small></div></div><div className="checkout-fields"><label><span>ឈ្មោះអ្នកទទួល *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ឈ្មោះពេញ" /></label><label><span>លេខទូរសព្ទ *</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="012 345 678" /></label><label><span>ខេត្ត/ក្រុង *</span><select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>អាសយដ្ឋានលម្អិត *</span><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់/ឃុំ..." /></label></div>{formError && <p className="checkout-error">{formError}</p>}<button className="reference-checkout checkout-submit" onClick={submitOrder}>បន្តទៅ Telegram <ArrowRight size={20} /></button><p className="order-note">ព័ត៌មានរបស់អ្នកនឹងត្រូវបញ្ចូលទៅក្នុងសារបញ្ជាទិញ Telegram ដើម្បីឱ្យយើងទាក់ទងបញ្ជាក់។</p></aside></div>}
  </div>;
}

function addressKey(form: CheckoutForm) { return `${form.name}|${form.phone}|${form.address}|${form.province}`; }
