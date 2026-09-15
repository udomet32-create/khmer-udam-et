import { useMemo, useState } from "react";
import { Facebook, Heart, Instagram, MapPin, Menu, MessageCircle, Minus, Phone, Plus, Search, Send, Share2, ShoppingBag, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

type Product = { id: number; name: string; khmerName: string; category: string; price: number; oldPrice?: number; badge?: string; tone: string; imagePosition?: string; imageUrl?: string; videoUrl?: string };
const products: Product[] = [
  { id: 1, name: "Landea Signature Bag", khmerName: "កាបូបដៃ Landea ស្អាតប្រណិត", category: "កាបូប", price: 29.9, oldPrice: 39.9, badge: "លក់ដាច់", tone: "bag", imagePosition: "38% 58%" },
  { id: 2, name: "Korean Pink Care Set", khmerName: "ឈុតថែរក្សាស្បែក Pink Care", category: "សម្រស់", price: 18.5, oldPrice: 24.9, badge: "-25%", tone: "beauty", imagePosition: "13% 58%" },
  { id: 3, name: "Cloud Step Clogs", khmerName: "ស្បែកជើង Cloud Step", category: "ស្បែកជើង", price: 14.9, badge: "ថ្មី", tone: "shoes", imagePosition: "55% 73%" },
  { id: 4, name: "Urban Leather Belt", khmerName: "ខ្សែក្រវ៉ាត់ស្បែក Urban", category: "គ្រឿងបន្លាស់", price: 11.9, oldPrice: 15.9, tone: "belt", imagePosition: "87% 76%" },
  { id: 5, name: "Everyday Mini Bag", khmerName: "កាបូបតូចប្រើរាល់ថ្ងៃ", category: "កាបូប", price: 22, badge: "ពេញនិយម", tone: "mini", imagePosition: "35% 55%" },
  { id: 6, name: "Glow Essentials", khmerName: "ឈុត Glow Essentials", category: "សម្រស់", price: 16.8, tone: "glow", imagePosition: "8% 60%" },
];
const categories = ["ទាំងអស់", "កាបូប", "សម្រស់", "ស្បែកជើង", "គ្រឿងបន្លាស់"];
const hero = "/manus-storage/khmer-udam-reference_7cd38c7a.png";
const poster = "/manus-storage/khmer-udam-poster_b68ee22f.png";
const price = (value: number) => `$${value.toFixed(2)}`;

function ProductVisual({ product }: { product: Product }) {
  return <div className={`product-visual ${product.tone}`}><img src={product.imageUrl || hero} alt={product.khmerName} style={{ objectPosition: product.imagePosition }} /><div className="visual-shade" /><span className="visual-tag">KU</span></div>;
}

export default function Home() {
  const [category, setCategory] = useState("ទាំងអស់");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const liveProducts = trpc.products.list.useQuery(undefined, { retry: false });
  const catalog = useMemo<Product[]>(() => liveProducts.data?.length ? liveProducts.data.map((product) => ({ id: product.id, name: product.name, khmerName: product.name, category: product.category, price: product.priceCents / 100, oldPrice: product.oldPriceCents ? product.oldPriceCents / 100 : undefined, badge: product.badge ?? undefined, tone: "database-product", imageUrl: product.imageUrl ?? undefined, videoUrl: product.videoUrl ?? undefined })) : products, [liveProducts.data]);
  const filtered = useMemo(() => catalog.filter((p) => (category === "ទាំងអស់" || p.category === category) && `${p.name} ${p.khmerName}`.toLowerCase().includes(search.toLowerCase())), [catalog, category, search]);
  const cartProducts = catalog.filter((p) => cart.includes(p.id));
  const total = cartProducts.reduce((sum, p) => sum + p.price, 0);
  const toggleCart = (id: number) => setCart((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const toggleFavorite = (id: number) => setFavorites((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);

  return <div className="storefront">
    <div className="top-ribbon"><span>✦ ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30</span><span className="ribbon-hide">បង់ប្រាក់ពេលទទួលទំនិញបាន</span><span className="ribbon-arrow">→</span></div>
    <header className="site-header"><div className="header-inner"><button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button><a className="brand" href="#top"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><nav className={`main-nav ${menuOpen ? "open" : ""}`}><a href="#collection" onClick={() => setMenuOpen(false)}>ទំនិញ</a><a href="#share" onClick={() => setMenuOpen(false)}>ចែករំលែក</a><a href="#contact" onClick={() => setMenuOpen(false)}>ទំនាក់ទំនង</a></nav><div className="header-actions"><button className="language-pill"><span>ខ្មែរ</span><span className="language-divider">/</span><span className="muted">EN</span></button><button className="cart-pill" onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>កន្ត្រក</span><b>{cart.length}</b></button></div></div></header>

    <main id="top">
      <section className="reference-hero"><div className="reference-poster"><img src={poster} alt="Khmer Udam ET poster" /></div></section>

      <section className="quick-links reference-links"><a href="https://t.me/" target="_blank" rel="noreferrer" className="quick-link telegram"><Send size={21} /><span>Telegram</span></a><a href="https://m.me/" target="_blank" rel="noreferrer" className="quick-link messenger"><MessageCircle size={21} /><span>Messenger</span></a><a href="tel:+85500000000" className="quick-link phone"><Phone size={21} /><span>Phone Call</span></a><a href="https://wa.me/85500000000" target="_blank" rel="noreferrer" className="quick-link whatsapp"><MessageCircle size={21} /><span>WhatsApp</span></a><a href="#contact" className="quick-link location"><MapPin size={21} /><span>ទីតាំង</span></a></section>

      <section id="share" className="share-section"><div className="share-title"><Share2 size={20} /><span>ចែករំលែក POSTER នេះ</span></div><div className="share-buttons"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={16} /> Facebook</a><a href="https://t.me/share/url?url=https://khmerudamet.com" target="_blank" rel="noreferrer"><Send size={16} /> Telegram</a><a href="https://wa.me/?text=Khmer%20Udam%20ET" target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp</a><button onClick={() => navigator.clipboard?.writeText(window.location.href)}><Share2 size={16} /> ចម្លងតំណ</button></div></section>

      <section id="collection" className="collection-section reference-collection"><div className="reference-categories">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="search-box reference-search"><Search size={20} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ស្វែងរកលេខកូដ ឬឈ្មោះទំនិញ..." aria-label="ស្វែងរកទំនិញ" /></div><div className="product-grid">{filtered.map((product) => <article className="product-card" key={product.id}><div className="product-media" onClick={() => window.location.assign(`/product/${product.id}`)} role="link" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && window.location.assign(`/product/${product.id}`)}><ProductVisual product={product} />{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${favorites.includes(product.id) ? "liked" : ""}`} onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}><Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button></div><div className="product-info"><p className="product-category">{product.category}</p><h3>{product.khmerName}</h3><div className="product-bottom"><div><strong>{price(product.price)}</strong>{product.oldPrice && <del>{price(product.oldPrice)}</del>}</div><button className={`add-button ${cart.includes(product.id) ? "added" : ""}`} onClick={() => toggleCart(product.id)}>{cart.includes(product.id) ? "បានបន្ថែម ✓" : "បន្ថែម"}</button></div></div></article>)}</div>{filtered.length === 0 && <div className="empty-state"><Search size={28} /><h3>រកមិនឃើញទំនិញ</h3><p>សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត។</p></div>}</section>
    </main>

    <footer id="contact" className="site-footer"><div><a className="brand footer-brand" href="#top"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><p>របស់ស្អាតៗ សម្រាប់ជីវិតដែលមានស្ទាយ។</p></div><div className="footer-links"><a href="#collection">ទំនិញ</a><a href="#share">ចែករំលែក</a><a href="mailto:hello@khmerudamet.com">អ៊ីមែល</a></div><div className="social-links"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={17} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={17} /></a><a href="https://t.me/" target="_blank" rel="noreferrer"><Send size={17} /></a></div><div className="footer-bottom"><span>© 2026 Khmer Udam ET</span><span>Designed with care in Cambodia</span></div></footer>
    <a className="floating-telegram" href="https://t.me/" target="_blank" rel="noreferrer"><Send size={19} /><span>Chat Telegram</span></a>

    {cartOpen && <div className="drawer-backdrop" onClick={() => setCartOpen(false)}><aside className="cart-drawer reference-cart-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR EDIT</p><h2>កន្ត្រករបស់អ្នក <span>{cart.length} items</span></h2></div><button className="close-button" onClick={() => setCartOpen(false)}><X size={25} /></button></div>{cartProducts.length === 0 ? <div className="cart-empty"><ShoppingBag size={32} /><h3>កន្ត្រកនៅទទេ</h3><p>បន្ថែមទំនិញដែលអ្នកចូលចិត្ត ដើម្បីចាប់ផ្តើម order។</p></div> : <><div className="cart-items reference-cart-items">{cartProducts.map((p) => <div className="cart-item reference-cart-item" key={p.id}><div className="mini-product"><ProductVisual product={p} /></div><div className="cart-item-copy"><p>{p.category}</p><h3>{p.khmerName}</h3><small>តពាក់ 1 · ONE SIZE</small><strong>{price(p.price)}</strong><div className="cart-quantity"><button onClick={() => toggleCart(p.id)}><Minus size={16} /></button><span>1</span><button onClick={() => toggleCart(p.id)}><Plus size={16} /></button><button className="remove-item" onClick={() => toggleCart(p.id)}><X size={17} /></button></div></div></div>)}</div><div className="reference-cart-total"><p>សរុបរងរបស់ទំនិញ</p><p>ការដឹកជញ្ជូន និងថ្លៃសេវានឹងបង្ហាញពេល chat</p><strong>{price(total + 2.0)}</strong></div><a className="reference-checkout" href="https://t.me/" target="_blank" rel="noreferrer">បញ្ជាទិញឥឡូវនេះ <span>→</span></a></>}</aside></div>}
  </div>;
}
