import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Facebook, Heart, Instagram, MapPin, Menu, MessageCircle, Minus, Phone, Plus, Search, Send, Share2, ShoppingBag, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Product = { id: number; name: string; khmerName: string; category: string; price: number; oldPrice?: number; badge?: string; tone: string; imagePosition?: string; imageUrl?: string; videoUrl?: string };
const products: Product[] = [
  { id: 1, name: "Landea Signature Bag", khmerName: "កាបូបដៃ Landea ស្អាតប្រណិត", category: "កាបូប", price: 29.9, oldPrice: 39.9, badge: "លក់ដាច់", tone: "bag", imagePosition: "38% 58%" },
  { id: 2, name: "Korean Pink Care Set", khmerName: "ឈុតថែរក្សាស្បែក Pink Care", category: "ម៉េកអាប់", price: 18.5, oldPrice: 24.9, badge: "-25%", tone: "beauty", imagePosition: "13% 58%" },
  { id: 3, name: "Cloud Step Clogs", khmerName: "ស្បែកជើង Cloud Step", category: "ស្បែកជើង", price: 14.9, badge: "ថ្មី", tone: "shoes", imagePosition: "55% 73%" },
  { id: 4, name: "Urban Leather Belt", khmerName: "ខ្សែក្រវ៉ាត់ស្បែក Urban", category: "ខ្សែក្រវ៉ាត់", price: 11.9, oldPrice: 15.9, tone: "belt", imagePosition: "87% 76%" },
  { id: 5, name: "Everyday Mini Bag", khmerName: "កាបូបតូចប្រើរាល់ថ្ងៃ", category: "កាបូប", price: 22, badge: "ពេញនិយម", tone: "mini", imagePosition: "35% 55%" },
  { id: 6, name: "Glow Essentials", khmerName: "ឈុត Glow Essentials", category: "សម្រស់", price: 16.8, tone: "glow", imagePosition: "8% 60%" },
];
const categories = ["ទាំងអស់", "កាបូប", "ស្បែកជើង", "ខ្សែក្រវ៉ាត់", "ម៉េកអាប់"];
const provinces = ["ភ្នំពេញ", "កណ្តាល", "សៀមរាប", "បាត់ដំបង", "ព្រះសីហនុ", "កំពង់ចាម", "ខេត្តផ្សេងៗ"];
const hero = "/manus-storage/khmer-udam-reference_7cd38c7a.png";
const poster = "/manus-storage/khmer-udam-poster_b68ee22f.png";
const price = (value: number) => `$${value.toFixed(2)}`;
const displayCategory = (category: string) => category === "សម្រស់" ? "ម៉េកអាប់" : category === "គ្រឿងបន្លាស់" ? "ខ្សែក្រវ៉ាត់" : category;

function ProductVisual({ product }: { product: Product }) {
  return <div className={`product-visual ${product.tone}`}><img src={product.imageUrl || hero} alt={product.khmerName} style={{ objectPosition: product.imagePosition }} /><div className="visual-shade" /><span className="visual-tag">KU</span></div>;
}

export default function Home() {
  const [category, setCategory] = useState("ទាំងអស់");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("khmer-udam-cart") || "[]"); } catch { return []; }
  });
  const [favorites, setFavorites] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkout, setCheckout] = useState({ name: "", phone: "", address: "", province: "ភ្នំពេញ" });
  const [checkoutError, setCheckoutError] = useState("");
  const liveProducts = trpc.products.list.useQuery(undefined, { retry: false });
  const catalog = useMemo<Product[]>(() => liveProducts.data?.length ? liveProducts.data.map((product) => ({ id: product.id, name: product.name, khmerName: product.name, category: displayCategory(product.category), price: product.priceCents / 100, oldPrice: product.oldPriceCents ? product.oldPriceCents / 100 : undefined, badge: product.badge ?? undefined, tone: "database-product", imageUrl: product.imageUrl ?? undefined, videoUrl: product.videoUrl ?? undefined })) : products, [liveProducts.data]);
  const filtered = useMemo(() => catalog.filter((p) => (category === "ទាំងអស់" || p.category === category) && `${p.name} ${p.khmerName}`.toLowerCase().includes(search.toLowerCase())), [catalog, category, search]);
  const cartProducts = catalog.filter((p) => cart.includes(p.id));
  const total = cartProducts.reduce((sum, p) => sum + p.price, 0);
  const cartMessage = [`ការបញ្ជាទិញ Khmer Udam ET`, ...cartProducts.map((p) => `${p.khmerName} · ${price(p.price)}`), `សរុប: ${price(total + 2)}`, `ឈ្មោះ: ${checkout.name}`, `លេខទូរសព្ទ: ${checkout.phone}`, `ខេត្ត/ក្រុង: ${checkout.province}`, `អាសយដ្ឋាន: ${checkout.address}`].join("\n");
  const cartTelegramHref = `https://t.me/share/url?url=https://khmerudamet.com&text=${encodeURIComponent(cartMessage)}`;
  useEffect(() => { localStorage.setItem("khmer-udam-cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { if (new URLSearchParams(window.location.search).get("cart") === "1") setCartOpen(true); }, []);
  const toggleCart = (id: number) => setCart((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const toggleFavorite = (id: number) => setFavorites((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);

  return <div className="storefront">
    <div className="top-ribbon"><span>✦ ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30</span><span className="ribbon-hide">បង់ប្រាក់ពេលទទួលទំនិញបាន</span><span className="ribbon-arrow">→</span></div>
    <header className="site-header"><div className="header-inner"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button><a className="brand" href="#top"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><nav className={`main-nav ${menuOpen ? "open" : ""}`}><a href="#collection" onClick={() => setMenuOpen(false)}>ទំនិញ</a><a href="#share" onClick={() => setMenuOpen(false)}>ចែករំលែក</a><a href="#contact" onClick={() => setMenuOpen(false)}>ទំនាក់ទំនង</a></nav><div className="header-actions"><button className="language-pill"><span>ខ្មែរ</span><span className="language-divider">/</span><span className="muted">EN</span></button><button className="cart-pill" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>កន្ត្រក</span><b>{cart.length}</b></button></div></div></header>

    <main id="top">
      <section className="reference-hero"><div className="reference-poster"><img src={poster} alt="Khmer Udam ET poster" /></div></section>

      <section className="quick-links reference-links"><a href="https://t.me/oudom_online_shop" target="_blank" rel="noreferrer" className="quick-link telegram"><Send size={21} /><span>Telegram</span></a><a href="https://www.facebook.com/share/19ajM7PjU8/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="quick-link messenger"><Facebook size={21} /><span>Facebook</span></a><a href="tel:+855888717671" className="quick-link phone"><Phone size={21} /><span>088 871 7671</span></a><a href="https://www.whatsapp.com/business/download/" target="_blank" rel="noreferrer" className="quick-link whatsapp"><MessageCircle size={21} /><span>WhatsApp</span></a><a href="https://maps.app.goo.gl/EaQbHNijNE7EHgmFA?g_st=ic" target="_blank" rel="noreferrer" className="quick-link location"><MapPin size={21} /><span>ទីតាំង</span></a></section>

      <section id="share" className="share-section"><div className="share-title"><Share2 size={20} /><span>ចែករំលែក POSTER នេះ</span></div><div className="share-buttons"><a href="https://www.facebook.com/share/19ajM7PjU8/?mibextid=wwXIfr" target="_blank" rel="noreferrer"><Facebook size={16} /> Facebook</a><a href="https://t.me/share/url?url=https://khmerudamet.com" target="_blank" rel="noreferrer"><Send size={16} /> Telegram</a><a href="https://wa.me/855888717671?text=Khmer%20Udam%20ET" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a><button onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 size={16} /> ចម្លងតំណ</button></div></section>

      <section id="collection" className="collection-section reference-collection"><div className="reference-categories">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}><span>{item}</span><small>{item === "ទាំងអស់" ? catalog.length : catalog.filter((product) => product.category === item).length}</small></button>)}</div><div className="search-box reference-search"><Search size={20} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ស្វែងរកលេខកូដ ឬឈ្មោះទំនិញ..." aria-label="ស្វែងរកទំនិញ" /></div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-media" onClick={() => window.location.assign(`/product/${product.id}`)} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && window.location.assign(`/product/${product.id}`)}><ProductVisual product={product} />{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${favorites.includes(product.id) ? "liked" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}><Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button></div><div className="product-info"><p className="product-category">{product.category}</p><h3>{product.khmerName}</h3><div className="product-bottom"><div><strong>{price(product.price)}</strong>{product.oldPrice && <del>{price(product.oldPrice)}</del>}</div><button className={`add-button ${cart.includes(product.id) ? "added" : ""}`} onClick={() => toggleCart(product.id)}>{cart.includes(product.id) ? "បានបន្ថែម ✓" : "បន្ថែម"}</button></div></div></article>)}</div>{filtered.length === 0 && <div className="empty-state"><Search size={28} /><h3>រកមិនឃើញទំនិញ</h3><p>សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត។</p></div>}</section>
    </main>

    <footer id="contact" className="site-footer"><div><a className="brand footer-brand" href="#top"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><p>របស់ស្អាតៗ សម្រាប់ជីវិតដែលមានស្ទាយ។</p></div><div className="footer-links"><a href="#collection">ទំនិញ</a><a href="#share">ចែករំលែក</a><a href="mailto:hello@khmerudamet.com">អ៊ីមែល</a></div><div className="social-links"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={17} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /></a><a href="https://t.me/" target="_blank" rel="noreferrer"><Send size={17} /></a></div><div className="footer-bottom"><span>© 2026 Khmer Udam ET</span><span>Designed with care in Cambodia</span></div></footer>
    <a className="floating-telegram" href="https://t.me/" target="_blank" rel="noreferrer"><Send size={19} /><span>Chat Telegram</span></a>

    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer reference-cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR EDIT</p><h2>កន្ត្រករបស់អ្នក <span>{cart.length} items</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)}><X size={25} /></button></div>{cartProducts.length === 0 ? <div className="cart-empty"><ShoppingBag size={32} /><h3>កន្ត្រកនៅទទេ</h3><p>បន្ថែមទំនិញដែលអ្នកចូលចិត្ត ដើម្បីចាប់ផ្តើម order។</p></div> : <><div className="cart-items reference-cart-items">{cartProducts.map((p) => <div className="cart-item reference-cart-item" key={p.id}><div className="mini-product"><ProductVisual product={p} /></div><div className="cart-item-copy"><p>{p.category}</p><h3>{p.khmerName}</h3><small>តពាក់ 1 · ONE SIZE</small><strong>{price(p.price)}</strong><div className="cart-quantity"><button onClick={() => toggleCart(p.id)}><Minus size={16} /></button><span>1</span><button onClick={() => toggleCart(p.id)}><Plus size={16} /></button><button className="remove-item" onClick={() => toggleCart(p.id)}><X size={17} /></button></div></div></div>)}</div><div className="reference-cart-total"><p>សរុបរងរបស់ទំនិញ</p><p>ការដឹកជញ្ជូន និងថ្លៃសេវានឹងបង្ហាញពេល chat</p><strong>{price(total + 2.0)}</strong></div>{!checkoutOpen ? <button className="reference-checkout" onClick={() => { setCheckoutOpen(true); setCheckoutError(""); }}>បញ្ជាទិញឥឡូវនេះ <span>→</span></button> : <div className="cart-checkout-form"><h3>ព័ត៌មានការដឹកជញ្ជូន</h3><label><span>ឈ្មោះអ្នកទទួល *</span><input value={checkout.name} onChange={(e) => setCheckout({ ...checkout, name: e.target.value })} placeholder="ឈ្មោះពេញ" /></label><label><span>លេខទូរសព្ទ *</span><input value={checkout.phone} onChange={(e) => setCheckout({ ...checkout, phone: e.target.value })} inputMode="tel" placeholder="012 345 678" /></label><label><span>ខេត្ត/ក្រុង *</span><select value={checkout.province} onChange={(e) => setCheckout({ ...checkout, province: e.target.value })}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>អាសយដ្ឋានលម្អិត *</span><textarea rows={3} value={checkout.address} onChange={(e) => setCheckout({ ...checkout, address: e.target.value })} placeholder="ផ្ទះលេខ, ផ្លូវ, សង្កាត់/ឃុំ..." /></label>{checkoutError && <p className="checkout-error">{checkoutError}</p>}<a className="reference-checkout" href={checkout.name && checkout.phone && checkout.address ? cartTelegramHref : undefined} target="_blank" rel="noreferrer" onClick={(e) => { if (!checkout.name.trim() || !/^0[1-9][0-9]{7,9}$/.test(checkout.phone.replace(/[\s-]/g, "")) || !checkout.address.trim()) { e.preventDefault(); setCheckoutError("សូមបំពេញឈ្មោះ លេខទូរសព្ទ និងអាសយដ្ឋានឱ្យបានត្រឹមត្រូវ។"); } }}>{"បន្តទៅ Telegram"} <ArrowRight size={18} /></a></div>}</>}</aside></div>}
  </div>;
}
