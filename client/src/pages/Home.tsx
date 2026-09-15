import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Facebook,
  Filter,
  Heart,
  Instagram,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from "lucide-react";

type Product = {
  id: number;
  name: string;
  khmerName: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  tone: string;
  imagePosition?: string;
};

const products: Product[] = [
  { id: 1, name: "Landea Signature Bag", khmerName: "កាបូបដៃ Landea ស្អាតប្រណិត", category: "កាបូប", price: 29.9, oldPrice: 39.9, badge: "លក់ដាច់", tone: "bag", imagePosition: "38% 58%" },
  { id: 2, name: "Korean Pink Care Set", khmerName: "ឈុតថែរក្សាស្បែក Pink Care", category: "សម្រស់", price: 18.5, oldPrice: 24.9, badge: "-25%", tone: "beauty", imagePosition: "13% 58%" },
  { id: 3, name: "Cloud Step Clogs", khmerName: "ស្បែកជើង Cloud Step", category: "ស្បែកជើង", price: 14.9, badge: "ថ្មី", tone: "shoes", imagePosition: "55% 73%" },
  { id: 4, name: "Urban Leather Belt", khmerName: "ខ្សែក្រវ៉ាត់ស្បែក Urban", category: "គ្រឿងបន្លាស់", price: 11.9, oldPrice: 15.9, tone: "belt", imagePosition: "87% 76%" },
  { id: 5, name: "Everyday Mini Bag", khmerName: "កាបូបតូចប្រើរាល់ថ្ងៃ", category: "កាបូប", price: 22.0, badge: "ពេញនិយម", tone: "mini", imagePosition: "35% 55%" },
  { id: 6, name: "Glow Essentials", khmerName: "ឈុត Glow Essentials", category: "សម្រស់", price: 16.8, tone: "glow", imagePosition: "8% 60%" },
];

const categories = ["ទាំងអស់", "កាបូប", "សម្រស់", "ស្បែកជើង", "គ្រឿងបន្លាស់"];

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function ProductVisual({ product }: { product: Product }) {
  return (
    <div className={`product-visual ${product.tone}`}>
      <img src="/manus-storage/khmer-udam-reference_7cd38c7a.png" alt="Khmer Udam ET product collection" style={{ objectPosition: product.imagePosition }} />
      <div className="visual-shade" />
      <span className="visual-glow" />
      <span className="visual-tag">KU</span>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("ទាំងអស់");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const categoryMatch = activeCategory === "ទាំងអស់" || product.category === activeCategory;
    const searchMatch = `${product.name} ${product.khmerName}`.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  }), [activeCategory, search]);

  const cartItems = products.filter((product) => cart.includes(product.id));
  const cartTotal = cartItems.reduce((sum, product) => sum + product.price, 0);

  const toggleCartItem = (id: number) => {
    setCart((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const scrollToCollection = () => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="storefront">
      <div className="top-ribbon">
        <span><Sparkles size={14} /> ដឹកជញ្ជូនឥតគិតថ្លៃ សម្រាប់ការកុម្ម៉ង់ចាប់ពី $30</span>
        <span className="ribbon-hide">បង់ប្រាក់ពេលទទួលទំនិញបាន</span>
        <span className="ribbon-arrow"><ArrowRight size={14} /></span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="បើកម៉ឺនុយ"><Menu size={22} /></button>
          <a className="brand" href="#top" aria-label="Khmer Udam ET home">
            <span className="brand-mark">K</span>
            <span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span>
          </a>
          <nav className={`main-nav ${isMenuOpen ? "open" : ""}`}>
            <a href="#collection" onClick={() => setIsMenuOpen(false)}>ទំនិញ</a>
            <a href="#story" onClick={() => setIsMenuOpen(false)}>រឿងរ៉ាវរបស់យើង</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>ទំនាក់ទំនង</a>
          </nav>
          <div className="header-actions">
            <button className="language-pill" aria-label="ប្តូរភាសា"><span>ខ្មែរ</span><span className="language-divider">/</span><span className="muted">EN</span><ChevronDown size={14} /></button>
            <button className="cart-pill" onClick={() => setIsCartOpen(true)}><ShoppingBag size={18} /><span>កន្ត្រក</span><b>{cart.length}</b></button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> <span>NEW COLLECTION · 2026</span></div>
            <h1>របស់ស្អាតៗ<br /><span>សម្រាប់អ្នក</span></h1>
            <p>ស្វែងរកទំនិញដែលអ្នកស្រឡាញ់ ជាមួយការរចនាដែលមានអត្តសញ្ញាណ និងតម្លៃដែលសមរម្យ។</p>
            <div className="hero-cta-row">
              <button className="primary-button" onClick={scrollToCollection}>មើលទំនិញ <ArrowRight size={18} /></button>
              <a className="text-link" href="#story">ស្គាល់ Khmer Udam <ArrowRight size={15} /></a>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><span>KU</span><span>ET</span><span>♥</span></div><span>ជឿទុកចិត្តដោយអតិថិជនជាច្រើន</span></div>
          </div>
          <div className="hero-art">
            <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
            <div className="hero-image-frame"><img src="/manus-storage/khmer-udam-reference_7cd38c7a.png" alt="Khmer Udam ET collection hero" /><div className="hero-image-overlay" /></div>
            <div className="hero-note note-one"><Zap size={16} /><span>Made<br />with care</span></div>
            <div className="hero-note note-two"><span>01</span><small>ស្ទាយ<br />ប្រចាំថ្ងៃ</small></div>
          </div>
        </section>

        <section className="quick-links" aria-label="Quick contact links">
          <a href="https://t.me/" target="_blank" rel="noreferrer" className="quick-link telegram"><Send size={20} /><span>Telegram</span><small>ជជែកជាមួយយើង</small></a>
          <a href="https://m.me/" target="_blank" rel="noreferrer" className="quick-link messenger"><MessageCircle size={20} /><span>Messenger</span><small>សួរព័ត៌មាន</small></a>
          <a href="tel:+85500000000" className="quick-link phone"><Phone size={20} /><span>Phone Call</span><small>ហៅមកយើង</small></a>
          <a href="https://wa.me/85500000000" target="_blank" rel="noreferrer" className="quick-link whatsapp"><MessageCircle size={20} /><span>WhatsApp</span><small>សម្រាប់ order</small></a>
          <a href="#contact" className="quick-link location"><MapPin size={20} /><span>ទីតាំង</span><small>ស្វែងរកយើង</small></a>
        </section>

        <section id="story" className="story-strip">
          <div className="story-icon"><Star size={18} fill="currentColor" /></div>
          <div><p className="section-kicker">KHMER UDAM ET · OUR EDIT</p><h2>ជ្រើសរើសអ្វីដែលធ្វើឱ្យអ្នកមានអារម្មណ៍ល្អ</h2></div>
          <p className="story-description">រាល់ផលិតផលត្រូវបានជ្រើសរើសដោយយកចិត្តទុកដាក់ ដើម្បីនាំមកនូវភាពស្រស់ស្អាតក្នុងជីវិតប្រចាំថ្ងៃ។</p>
        </section>

        <section id="collection" className="collection-section">
          <div className="section-heading"><div><p className="section-kicker">THE COLLECTION</p><h2>រកឃើញអ្វីថ្មី <span>សម្រាប់អ្នក</span></h2></div><button className="outline-button" onClick={() => { setActiveCategory("ទាំងអស់"); setSearch(""); }}>មើលទាំងអស់ <ArrowRight size={16} /></button></div>
          <div className="collection-tools">
            <div className="category-list">{categories.map((category) => <button key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
            <div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ស្វែងរកទំនិញ..." aria-label="ស្វែងរកទំនិញ" /><Filter size={16} /></div>
          </div>
          <div className="product-grid">
            {visibleProducts.map((product) => <article className="product-card" key={product.id}>
              <div className="product-media"><ProductVisual product={product} />{product.badge && <span className="product-badge">{product.badge}</span>}<button className={`favorite-button ${favorites.includes(product.id) ? "liked" : ""}`} onClick={() => toggleFavorite(product.id)} aria-label="បន្ថែមទៅបញ្ជីចូលចិត្ត"><Heart size={18} fill={favorites.includes(product.id) ? "currentColor" : "none"} /></button></div>
              <div className="product-info"><p className="product-category">{product.category}</p><h3>{product.khmerName}</h3><div className="product-bottom"><div><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}</div><button className={`add-button ${cart.includes(product.id) ? "added" : ""}`} onClick={() => toggleCartItem(product.id)}>{cart.includes(product.id) ? "បានបន្ថែម ✓" : "បន្ថែម"}</button></div></div>
            </article>)}
          </div>
          {visibleProducts.length === 0 && <div className="empty-state"><Search size={28} /><h3>រកមិនឃើញទំនិញ</h3><p>សូមសាកល្បងពាក្យស្វែងរកផ្សេងទៀត។</p></div>}
        </section>

        <section className="service-section"><div className="service-card"><Truck size={23} /><div><h3>ដឹកជញ្ជូនរហ័ស</h3><p>ទទួលទំនិញក្នុងរយៈពេល 1–3 ថ្ងៃ</p></div></div><div className="service-card"><Package size={23} /><div><h3>ខ្ចប់យ៉ាងយកចិត្តទុកដាក់</h3><p>រាល់ order ត្រូវបានរៀបចំដោយប្រុងប្រយ័ត្ន</p></div></div><div className="service-card"><MessageCircle size={23} /><div><h3>ជួយអ្នកគ្រប់ពេល</h3><p>ទំនាក់ទំនងមកយើងតាម Telegram</p></div></div></section>
      </main>

      <footer id="contact" className="site-footer"><div><a className="brand footer-brand" href="#top"><span className="brand-mark">K</span><span className="brand-name"><strong>KHMER UDAM</strong><em>ET</em></span></a><p>របស់ស្អាតៗ សម្រាប់ជីវិតដែលមានស្ទាយ។</p></div><div className="footer-links"><a href="#collection">ទំនិញ</a><a href="#story">អំពីយើង</a><a href="mailto:hello@khmerudamet.com">អ៊ីមែល</a></div><div className="social-links"><a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href="https://t.me/" target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={17} /></a></div><div className="footer-bottom"><span>© 2026 Khmer Udam ET</span><span>Designed with care in Cambodia</span></div></footer>

      {isCartOpen && <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}><aside className="cart-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="section-kicker">YOUR EDIT</p><h2>កន្ត្រករបស់អ្នក <span>({cart.length})</span></h2></div><button className="close-button" onClick={() => setIsCartOpen(false)} aria-label="បិទ"><X size={20} /></button></div>{cartItems.length === 0 ? <div className="cart-empty"><ShoppingBag size={32} /><h3>កន្ត្រកនៅទទេ</h3><p>បន្ថែមទំនិញដែលអ្នកចូលចិត្ត ដើម្បីចាប់ផ្តើម order។</p><button className="primary-button" onClick={() => { setIsCartOpen(false); scrollToCollection(); }}>ទៅមើលទំនិញ</button></div> : <><div className="cart-items">{cartItems.map((product) => <div className="cart-item" key={product.id}><div className="mini-product"><ProductVisual product={product} /></div><div className="cart-item-copy"><p>{product.category}</p><h3>{product.khmerName}</h3><strong>{formatPrice(product.price)}</strong></div><button onClick={() => toggleCartItem(product.id)} className="remove-item" aria-label="យកចេញ"><X size={15} /></button></div>)}</div><div className="cart-summary"><div><span>សរុប</span><strong>{formatPrice(cartTotal)}</strong></div><p>តម្លៃដឹកជញ្ជូននឹងគណនាតាមទីតាំង។</p><a className="primary-button full" href="https://t.me/" target="_blank" rel="noreferrer"><Send size={17} /> Order តាម Telegram</a></div></>}</aside></div>}
    </div>
  );
}
