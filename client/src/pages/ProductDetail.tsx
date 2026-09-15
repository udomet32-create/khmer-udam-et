import { useState } from "react";
import { ArrowLeft, Download, Facebook, Heart, MessageCircle, Minus, Plus, Send, Share2, ShoppingBag, Video, X } from "lucide-react";
import { Link, useLocation } from "wouter";

const productImage = "/manus-storage/khmer-udam-product_f1de96af.png";
const posterImage = "/manus-storage/khmer-udam-poster_b68ee22f.png";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("តពាក់ 1");
  const [selectedSize, setSelectedSize] = useState("One size");
  const [liked, setLiked] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const addToCart = () => {
    setShowOrder(true);
  };

  return <div className="storefront detail-page">
    <div className="top-ribbon"><span>✦ ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30</span><span className="ribbon-hide">បង់ប្រាក់ពេលទទួលទំនិញបាន</span></div>
    <header className="site-header"><div className="header-inner"><Link className="back-link" href="/"><ArrowLeft size={18} /><span>ត្រឡប់</span></Link><a className="brand" href="/"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><button className="cart-pill detail-cart" onClick={() => setShowOrder(true)}><ShoppingBag size={19} /><span>កន្ត្រក</span></button></div></header>

    <main className="detail-main">
      <div className="detail-hero-strip"><img src={posterImage} alt="Khmer Udam ET collection" /></div>
      <section className="product-detail-card">
        <div className="detail-gallery"><div className="detail-main-image"><img src={productImage} alt="Versace belt product" /><span className="gallery-count">52/130</span></div><div className="detail-thumbs"><button className="detail-thumb selected"><img src={productImage} alt="Product thumbnail" /></button><button className="detail-thumb video-thumb"><img src={productImage} alt="Product video" /><span><Video size={18} /></span></button></div></div>
        <div className="detail-options"><h2>តម្លៃ</h2><button className={`variant-card ${selectedVariant ? "chosen" : ""}`} onClick={() => setSelectedVariant("តពាក់ 1")}><img src={productImage} alt="Variant" /><span>តពាក់ 1</span></button><h2>សាយ</h2><div className="size-row"><button className={selectedSize === "One size" ? "selected" : ""} onClick={() => setSelectedSize("One size")}>One size</button></div></div>
        <div className="detail-price"><p>Code: <strong>ខ្សែក្រវ៉ាត់ 4</strong></p><div>$4.50</div><div className="quantity-row"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={18} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={18} /></button></div><button className="add-order-button" onClick={addToCart}>បន្ថែមទៅកន្ត្រក <Plus size={21} /></button></div>
        <div className="detail-share"><div className="share-label"><Share2 size={18} /> <span>ចែករំលែក</span></div><div className="detail-share-buttons"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={18} /></a><a href="https://t.me/share/url?url=https://khmerudamet.com" target="_blank" rel="noreferrer"><Send size={18} /></a><a href="https://wa.me/?text=Khmer%20Udam%20ET" target="_blank" rel="noreferrer"><MessageCircle size={18} /></a><button onClick={() => setLiked(!liked)} className={liked ? "liked" : ""}><Heart size={18} fill={liked ? "currentColor" : "none"} /></button></div><a className="download-button" href={productImage} download="khmer-udam-product.png"><Download size={20} /></a></div>
      </section>
    </main>

    <a className="floating-telegram" href="https://t.me/" target="_blank" rel="noreferrer"><Send size={19} /><span>Chat Telegram</span></a>
    {showOrder && <div className="drawer-backdrop" onClick={() => setShowOrder(false)}><aside className="order-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR ORDER</p><h2>បញ្ជាទិញផលិតផល</h2></div><button className="close-button" onClick={() => setShowOrder(false)}><X size={20} /></button></div><div className="order-summary"><img src={productImage} alt="Selected product" /><div><p>Code: ខ្សែក្រវ៉ាត់ 4</p><h3>Versace Leather Belt</h3><strong>$4.50 × {quantity}</strong><small>{selectedVariant} · {selectedSize}</small></div></div><a className="primary-button full" href="https://t.me/" target="_blank" rel="noreferrer"><Send size={18} /> បញ្ជាទិញតាម Telegram</a><p className="order-note">សូមផ្ញើឈ្មោះ លេខទូរស័ព្ទ និងទីតាំងដឹកជញ្ជូនទៅកាន់ Telegram ដើម្បីបញ្ចប់ការកុម្ម៉ង់។</p></aside></div>}
  </div>;
}
