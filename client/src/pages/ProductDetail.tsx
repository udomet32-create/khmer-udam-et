import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Maximize2, Minus, Plus, Send, ShoppingBag, Video, X } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";

const fallbackImage = "/manus-storage/khmer-udam-product_f1de96af.png";
const provinces = ["ភ្នំពេញ", "បន្ទាយមានជ័យ", "បាត់ដំបង", "កំពង់ចាម", "កំពង់ឆ្នាំង", "កំពង់ស្ពឺ", "កំពង់ធំ", "កំពត", "កណ្តាល", "កោះកុង", "ក្រចេះ", "មណ្ឌលគិរី", "ព្រះវិហារ", "ព្រៃវែង", "ពោធិ៍សាត់", "រតនគិរី", "សៀមរាប", "ស្ទឹងត្រែង", "ស្វាយរៀង", "តាកែវ", "ឧត្តរមានជ័យ", "កែប", "ប៉ៃលិន", "ព្រះសីហនុ", "ត្បូងឃ្មុំ"];
const districts = ["ស្រុក/ខណ្ឌកណ្តាល", "ចំការមន", "ដូនពេញ", "៧មករា", "ទួលគោក", "ដង្កោ", "មានជ័យ", "សែនសុខ", "ពោធិ៍សែនជ័យ", "ក្រុង/ស្រុកផ្សេងៗ"];
type CheckoutForm = { name: string; phone: string; address: string; province: string; district: string };

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const id = Number(params?.id);
  const productQuery = trpc.products.getById.useQuery({ id }, { enabled: Number.isInteger(id) && id > 0, retry: false });
  const product = productQuery.data;
  const image = product?.imageUrl || fallbackImage;
  const video = product?.videoUrl || "";
  const colors = useMemo(() => { try { const value = product?.colorOptions ? JSON.parse(product.colorOptions) : []; return Array.isArray(value) ? value : []; } catch { return []; } }, [product?.colorOptions]);
  const sizes = useMemo(() => { try { const value = product?.sizeOptions ? JSON.parse(product.sizeOptions) : []; return Array.isArray(value) ? value : []; } catch { return []; } }, [product?.sizeOptions]);
  const images = useMemo(() => { if (!product?.imageUrls) return [image]; try { const parsed = JSON.parse(product.imageUrls); return Array.isArray(parsed) && parsed.length ? parsed : [image]; } catch { return [image]; } }, [image, product?.imageUrls]);
  const [imageIndex, setImageIndex] = useState(0);
  const activeImage = images[imageIndex] || image;
  const [media, setMedia] = useState<"image" | "video">("image");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showOrder, setShowOrder] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({ name: "", phone: "", address: "", province: "ភ្នំពេញ", district: "ចំការមន" });
  const [formError, setFormError] = useState("");
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const name = product?.name || "ផលិតផល Khmer Udam ET";
  const code = product?.code || "KU-PRODUCT";
  const price = product ? product.priceCents / 100 : 4.5;
  const total = price * quantity;
  const telegramHref = useMemo(() => {
    const message = [`ការបញ្ជាទិញ Khmer Udam ET`, `ផលិតផល: ${name}`, `Code: ${code}`, `តម្លៃ: $${price.toFixed(2)} × ${quantity}`, `ពណ៌: ${selectedColor || "មិនបានជ្រើស"}`, `ទំហំ: ${selectedSize || "មិនបានជ្រើស"}`, `ឈ្មោះ: ${form.name}`, `លេខទូរសព្ទ: ${form.phone}`, `រាជធានី/ខេត្ត: ${form.province}`, `ស្រុក/ខណ្ឌ: ${form.district}`, `អាសយដ្ឋាន: ${form.address}`].join("\n");
    return `https://t.me/oudom_online_shop?text=${encodeURIComponent(message)}`;
  }, [code, form.address, form.district, form.name, form.phone, form.province, name, price, quantity, selectedColor, selectedSize]);
  const submitOrder = () => {
    if ((colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize) || !form.name.trim() || !/^0[1-9][0-9]{7,9}$/.test(form.phone.replace(/[\s-]/g, "")) || !form.address.trim() || !form.province || !form.district) { setFormError("សូមជ្រើសរើសពណ៌/ទំហំ (បើមាន) និងបំពេញឈ្មោះ លេខទូរសព្ទ រាជធានី/ខេត្ត ស្រុក/ខណ្ឌ និងអាសយដ្ឋានឱ្យបានត្រឹមត្រូវ។"); return; }
    setFormError(""); window.open(telegramHref, "_blank", "noopener,noreferrer");
  };
  useEffect(() => {
    if (media === "video" && videoRef.current) {
      videoRef.current.muted = true;
      void videoRef.current.play().catch(() => {
        // Some mobile browsers require a second user gesture; controls remain available.
      });
    }
  }, [media, video]);
  useEffect(() => {
    if (video) setMedia("video");
  }, [video]);
  const openVideo = () => {
    if (!video) return;
    setMedia("video");
    window.setTimeout(() => {
      if (videoRef.current) { videoRef.current.muted = true; void videoRef.current.play().catch(() => undefined); }
    }, 0);
  };
  const toggleFullscreen = async () => {
    if (!mediaRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await mediaRef.current.requestFullscreen();
  };
  return <div className="product-focus-page">
    <div className="focus-toolbar"><Link href="/" aria-label="ត្រឡប់ទៅហាង"><ArrowLeft size={20} /></Link><span>KHMER UDAM ET</span><button onClick={() => setShowOrder(true)} aria-label="បើកការបញ្ជាទិញ"><ShoppingBag size={20} /></button></div>
    <main className="focus-content">{productQuery.isLoading ? <div className="admin-loading"><span>កំពុងបើកផលិតផល...</span></div> : <section className="focus-product"><div className="focus-media"><div ref={mediaRef} className={`focus-main-media ${media === "video" ? "video-playing" : ""}`}>{media === "video" && video ? <video ref={videoRef} src={video} controls autoPlay muted playsInline preload="auto" /> : <img src={activeImage} alt={name} />}{media === "video" && video && <button type="button" className="video-fullscreen-button" onClick={toggleFullscreen} aria-label="ពង្រីកវីដេអូ"><Maximize2 size={20} /></button>}</div><div className="focus-media-tabs"><button className={media === "image" ? "active" : ""} onClick={() => setMedia("image")}><img src={activeImage} alt="រូបភាពផលិតផល" /><span>រូបភាព {images.length > 1 ? `(${imageIndex + 1}/${images.length})` : ""}</span></button>{images.slice(1).map((url, index) => <button key={url} className={media === "image" && imageIndex === index + 1 ? "active" : ""} onClick={() => { setMedia("image"); setImageIndex(index + 1); }}><img src={url} alt={`រូបភាព ${index + 2}`} /><span>រូបភាព {index + 2}</span></button>)}{video && <button className={media === "video" ? "active" : ""} onClick={openVideo}><span className="video-thumb"><img src={image} alt="វីដេអូផលិតផល" /><Video size={22} /></span><span>វីដេអូ</span></button>}</div></div><div className="focus-info"><p className="focus-code">{code}</p><h1>{name}</h1><strong className="focus-price">${price.toFixed(2)}</strong><div className="variant-selectors">{colors.length > 0 && <div className="variant-group"><span>ពណ៌</span><div>{colors.map((color: string) => <button type="button" key={color} className={selectedColor === color ? "selected" : ""} onClick={() => setSelectedColor(color)}>{color}</button>)}</div></div>}{sizes.length > 0 && <div className="variant-group"><span>ទំហំ</span><div>{sizes.map((size: string) => <button type="button" key={size} className={selectedSize === size ? "selected" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}</div></div>}</div><div className="focus-quantity"><span>ចំនួន</span><div><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={17} /></button><b>{quantity}</b><button onClick={() => setQuantity(quantity + 1)}><Plus size={17} /></button></div></div><button className="focus-order-button" onClick={() => setShowOrder(true)}>បញ្ជាទិញឥឡូវនេះ <ArrowRight size={20} /></button><p className="focus-total">សរុប: <b>${total.toFixed(2)}</b></p></div></section>}</main>
    {showOrder && <div className="drawer-backdrop" onClick={() => setShowOrder(false)}><aside className="order-drawer checkout-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR ORDER</p><h2>ព័ត៌មានការដឹកជញ្ជូន</h2></div><button className="close-button" onClick={() => setShowOrder(false)}><X size={20} /></button></div><div className="order-summary"><img src={image} alt={name} /><div><p>Code: {code}</p><h3>{name}</h3><strong>${total.toFixed(2)} × {quantity}</strong></div></div><div className="checkout-fields">{colors.length > 0 && <label><span>ពណ៌ *</span><select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}><option value="">សូមជ្រើសរើសពណ៌</option>{colors.map((color: string) => <option key={color}>{color}</option>)}</select></label>}{sizes.length > 0 && <label><span>ទំហំ *</span><select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}><option value="">សូមជ្រើសរើសទំហំ</option>{sizes.map((size: string) => <option key={size}>{size}</option>)}</select></label>}<label><span>ឈ្មោះអ្នកទទួល *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="ឈ្មោះពេញ" /></label><label><span>លេខទូរសព្ទ *</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} inputMode="tel" placeholder="012 345 678" /></label><label><span>រាជធានី/ខេត្ត *</span><select value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>ស្រុក/ខណ្ឌ *</span><select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}>{districts.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>អាសយដ្ឋានលម្អិត *</span><textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={3} placeholder="ផ្ទះលេខ, ផ្លូវ, ឃុំ/សង្កាត់..." /></label></div>{formError && <p className="checkout-error">{formError}</p>}<button className="reference-checkout checkout-submit" onClick={submitOrder}>បន្តទៅ Telegram <Send size={18} /></button></aside></div>}
  </div>;
}
