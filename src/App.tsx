import { useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Instagram,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';

type Product = {
  id: number;
  name: string;
  category: 'Plastic' | 'Steel';
  price: number;
  mrp: number;
  badge?: string;
  rating: number;
  image: string;
  tone: string;
  description: string;
};

type CartItem = Product & { quantity: number };

type View = 'home' | 'shop' | 'about' | 'contact';

const products: Product[] = [
  {
    id: 1,
    name: 'Double Coated Plastic Tumbler',
    category: 'Plastic',
    price: 199,
    mrp: 249,
    badge: 'Everyday favourite',
    rating: 4.9,
    image: '/images/plastic-tumblers/ChatGPT_Image_Sep_25,_2026,_10_21_53_PM.png',
    tone: 'green',
    description: 'Light in your hand, easy on your bag, and cheerful enough to make plain water feel like a plan. The double-coated finish keeps it comfortable to hold through long workdays and lazy afternoons.',
  },
  {
    id: 2,
    name: 'Double Coated Plastic Tumbler',
    category: 'Plastic',
    price: 199,
    mrp: 249,
    badge: 'Pretty in pink',
    rating: 4.9,
    image: '/images/steel-tumblers/ChatGPT_Image_Sep_25,_2026,_10_26_33_PM.png',
    tone: 'pink',
    description: 'A pop of pink for your morning coffee, evening chai, and the desk corner that needed a little more personality. Practical, spill-friendly, and made for everyday sipping.',
  },
  {
    id: 3,
    name: 'Midnight Blue Insulated Tumbler',
    category: 'Steel',
    price: 459,
    mrp: 599,
    badge: 'Premium steel',
    rating: 5,
    image: '/images/steel-tumblers/ChatGPT_Image_Sep_25,_2026,_10_31_00_PM.png',
    tone: 'blue',
    description: 'The one you reach for when you want your drink to stay cold, your coffee to stay warm, and your day to keep moving. Solid, insulated, and quietly good-looking.',
  },
];

const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

function App() {
  const [view, setView] = useState<View>('home');
  const [category, setCategory] = useState<'All' | 'Plastic' | 'Steel'>('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = !normalizedSearch || product.name.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartShipping = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 100;
  const cartTotal = cartSubtotal + cartShipping;

  const navigate = (nextView: View) => {
    setView(nextView);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);
      if (existing) {
        return currentCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((currentCart) => currentCart
      .map((item) => item.id === productId ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0));
  };

  return (
    <div className="app-shell">
      <div className="announcement"><span>Free shipping above ₹499</span><span className="announcement-dot">•</span><span>Cash on delivery available</span><span className="announcement-dot">•</span><span>20% off on prepaid orders</span></div>
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu"><Menu size={22} /></button>
          <button className="brand" onClick={() => navigate('home')} aria-label="Trove Store home"><span className="brand-spark">✦</span><span className="brand-dark">trove</span><span className="brand-coral">store</span></button>
          <nav className={`main-nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            <button className={view === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Home</button>
            <button className={view === 'shop' ? 'active' : ''} onClick={() => navigate('shop')}>Shop</button>
            <button onClick={() => { setCategory('All'); navigate('shop'); }}>New arrivals</button>
            <button className={view === 'about' ? 'active' : ''} onClick={() => navigate('about')}>About</button>
            <button className={view === 'contact' ? 'active' : ''} onClick={() => navigate('contact')}>Contact</button>
          </nav>
          <div className="header-actions">
            <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} onFocus={() => navigate('shop')} placeholder="Search" aria-label="Search products" /></label>
            <button className="icon-button" onClick={() => setIsCartOpen(true)} aria-label="Open cart"><ShoppingBag size={20} /><span className="cart-count">{cartCount}</span></button>
          </div>
        </div>
      </header>

      <main>
        {view === 'home' && <HomePage onShop={() => navigate('shop')} onProduct={setSelectedProduct} onCategory={(nextCategory) => { setCategory(nextCategory); navigate('shop'); }} />}
        {view === 'shop' && <ShopPage products={filteredProducts} category={category} setCategory={setCategory} search={search} setSearch={setSearch} onProduct={setSelectedProduct} />}
        {view === 'about' && <AboutPage onShop={() => navigate('shop')} />}
        {view === 'contact' && <ContactPage />}
      </main>

      <footer className="site-footer">
        <div className="footer-grid">
          <div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-spark">✦</span><span className="brand-dark">trove</span><span className="brand-coral">store</span></button><p className="footer-tagline">A little trove of good finds,<br />made for everyday joy.</p><div className="social-row"><button aria-label="Instagram"><Instagram size={17} /></button><button aria-label="Pinterest">P</button><button aria-label="WhatsApp">W</button></div></div>
          <div><h4>Shop</h4><button onClick={() => { setCategory('Plastic'); navigate('shop'); }}>Plastic Tumblers</button><button onClick={() => { setCategory('Steel'); navigate('shop'); }}>Steel Tumblers</button><button onClick={() => navigate('shop')}>All products</button></div>
          <div><h4>Good to know</h4><button onClick={() => navigate('about')}>Our story</button><button onClick={() => navigate('contact')}>Contact us</button><button>Shipping & returns</button></div>
          <div><h4>Stay in the loop</h4><p className="footer-small">First dibs on new drops, good deals, and little surprises.</p><div className="footer-email"><input placeholder="Your email address" aria-label="Your email address" /><button aria-label="Subscribe"><ArrowRight size={17} /></button></div></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Trove Store. All rights reserved.</span><span>Made with care in India</span></div>
      </footer>

      {isCartOpen && <CartDrawer cart={cart} total={cartTotal} onClose={() => setIsCartOpen(false)} onUpdate={updateQuantity} />}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
    </div>
  );
}

function HomePage({ onShop, onProduct, onCategory }: { onShop: () => void; onProduct: (product: Product) => void; onCategory: (category: 'Plastic' | 'Steel') => void }) {
  return <>
    <section className="hero-section"><div className="hero-copy"><div className="eyebrow"><Sparkles size={14} /> little things, big mood</div><h1>Find your next<br /><em>favourite thing.</em></h1><p>Thoughtful little finds for your space, your people, and all the in-between moments worth making special.</p><button className="primary-button" onClick={onShop}>Shop the trove <ArrowRight size={18} /></button><div className="hero-note"><span className="avatar-stack"><span>R</span><span>A</span><span>M</span></span><span>Loved by 2,000+ happy humans</span></div></div><div className="hero-art"><div className="hero-sun"></div><div className="hero-sticker">good<br />finds<br /><span>inside</span></div><img src="https://images.pexels.com/photos/7764532/pexels-photo-7764532.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Floral tumbler in a sunny setting" /></div></section>
    <section className="trust-strip"><div><Truck size={22} /><span><strong>Free shipping</strong> on orders over ₹499</span></div><div><span className="trust-icon">COD</span><span><strong>Cash on delivery</strong> available</span></div><div><span className="trust-icon">20%</span><span><strong>Prepaid orders</strong> get 20% off</span></div><div><span className="trust-icon">♥</span><span><strong>Packed with care</strong> every time</span></div></section>
    <section className="section category-section"><div className="section-heading"><div><span className="eyebrow">pick your mood</span><h2>Shop by category</h2></div><button className="text-button" onClick={onShop}>View everything <ArrowRight size={16} /></button></div><div className="category-grid"><button className="category-card plastic-card" onClick={() => onCategory('Plastic')}><div className="category-copy"><span>01</span><h3>Double-coated<br />plastic tumblers</h3><strong>Shop now <ArrowUpRightIcon /></strong></div><img src="https://images.pexels.com/photos/7774277/pexels-photo-7774277.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Bright reusable tumbler" /></button><button className="category-card steel-card" onClick={() => onCategory('Steel')}><div className="category-copy"><span>02</span><h3>Steel tumblers<br />with good energy</h3><strong>Shop now <ArrowUpRightIcon /></strong></div><img src="https://images.pexels.com/photos/7734743/pexels-photo-7734743.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Matte steel tumbler" /></button><div className="category-card coming-card"><Sparkles size={30} /><span>new drops<br />every week</span><small>Stay curious</small></div></div></section>
    <section className="section products-section"><div className="section-heading"><div><span className="eyebrow">the good stuff</span><h2>Our tumbler edit</h2></div><button className="text-button" onClick={onShop}>Shop all <ArrowRight size={16} /></button></div><div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} onProduct={onProduct} />)}</div></section>
    <section className="why-section"><div className="why-intro"><span className="eyebrow">why trove?</span><h2>Small joys,<br /><em>well found.</em></h2><p>We look for the things that make you pause, smile, and think, “Oh, I need that.”</p></div><div className="why-grid"><div><span className="why-number">01</span><h3>Good stuff only</h3><p>Useful, lovely, and chosen with a little extra thought.</p></div><div><span className="why-number">02</span><h3>Fast to your door</h3><p>Quick dispatch, careful packing, zero unnecessary waiting.</p></div><div><span className="why-number">03</span><h3>Gift-ready energy</h3><p>Find something for them, or keep it for yourself. We get it.</p></div></div></section>
    <section className="newsletter"><div><span className="eyebrow">don't miss a good find</span><h2>Get first dibs on<br /><em>new drops.</em></h2></div><div className="newsletter-form"><p>Fresh finds, occasional offers, always worth opening.</p><div><input placeholder="Your email address" aria-label="Newsletter email" /><button className="primary-button">Sign me up <ArrowRight size={17} /></button></div><small>By signing up, you agree to receive good things from Trove.</small></div></section>
  </>;
}

function ArrowUpRightIcon() { return <ArrowRight size={15} />; }

function ProductCard({ product, onProduct }: { product: Product; onProduct: (product: Product) => void }) {
  const discount = Math.round((1 - product.price / product.mrp) * 100);
  return <article className="product-card"><button className="product-image-button" onClick={() => onProduct(product)}><div className={`product-image ${product.tone}`}><img src={product.image} alt={product.name} /><span className="product-badge">{product.badge || `${discount}% off`}</span><span className="heart-button"><Heart size={17} /></span></div></button><div className="product-info"><div><span className="product-category">{product.category} tumbler</span><h3>{product.name}</h3><span className="rating"><Star size={13} fill="currentColor" /> {product.rating}</span></div><div className="product-pricing"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.mrp)}</del></div></div><button className="add-button" onClick={() => onProduct(product)}>Quick view <ArrowRight size={15} /></button></article>;
}

function ShopPage({ products: visibleProducts, category, setCategory, search, setSearch, onProduct }: { products: Product[]; category: 'All' | 'Plastic' | 'Steel'; setCategory: (category: 'All' | 'Plastic' | 'Steel') => void; search: string; setSearch: (search: string) => void; onProduct: (product: Product) => void }) {
  return <section className="shop-page section"><div className="shop-heading"><div><span className="eyebrow">take a little browse</span><h1>All the good stuff</h1><p>{visibleProducts.length} lovely finds waiting for a new home.</p></div><div className="shop-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the trove" aria-label="Search the trove" /></div></div><div className="filter-bar"><div className="filter-tabs">{(['All', 'Plastic', 'Steel'] as const).map((item) => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item === 'All' ? 'All products' : `${item} tumblers`}</button>)}</div><button className="sort-button">Sort by: Featured <ChevronDown size={16} /></button></div>{visibleProducts.length ? <div className="product-grid shop-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onProduct={onProduct} />)}</div> : <div className="empty-state"><Search size={28} /><h2>No finds yet</h2><p>Try a different search or browse all the good stuff.</p><button className="primary-button" onClick={() => { setSearch(''); setCategory('All'); }}>Reset filters</button></div>}</section>;
}

function AboutPage({ onShop }: { onShop: () => void }) { return <section className="story-page section"><div className="story-hero"><div><span className="eyebrow">hello, we're trove</span><h1>A little corner<br />for <em>good finds.</em></h1><p>Trove started with a simple idea: the best things don't always shout the loudest. Sometimes they are the cheerful cup on your desk, the gift that gets used every day, or the tiny upgrade that makes an ordinary Tuesday feel better.</p><button className="primary-button" onClick={onShop}>Explore the finds <ArrowRight size={18} /></button></div><div className="story-image"><img src="https://images.pexels.com/photos/9630170/pexels-photo-9630170.jpeg?auto=compress&cs=tinysrgb&w=1000" alt="Friends enjoying a reusable cup outdoors" /></div></div><div className="story-values"><div><span>01</span><h3>Curious by nature</h3><p>We are always looking for the next little thing that makes life more fun.</p></div><div><span>02</span><h3>Thoughtful by choice</h3><p>Every find is picked for its mix of useful, beautiful, and giftable.</p></div><div><span>03</span><h3>Small brand, big care</h3><p>From our first hello to your doorstep, the details matter to us.</p></div></div></section>; }

function ContactPage() { return <section className="contact-page section"><div className="contact-intro"><span className="eyebrow">come say hi</span><h1>Let's talk<br /><em>good stuff.</em></h1><p>Have a question, a gift idea, or just want to say hello? Our inbox is a friendly place.</p><div className="contact-details"><a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"><span className="detail-icon">W</span><div><small>WhatsApp us</small><strong>+91 98765 43210</strong></div></a><a href="tel:+919876543210"><span className="detail-icon">☎</span><div><small>Call us</small><strong>+91 98765 43210</strong></div></a><a href="mailto:hello@trovestore.in"><span className="detail-icon">@</span><div><small>Email us</small><strong>hello@trovestore.in</strong></div></a></div></div><form className="contact-form" onSubmit={(event) => event.preventDefault()}><label>Your name<input required placeholder="What should we call you?" /></label><label>Email address<input type="email" required placeholder="you@example.com" /></label><label>Your message<textarea required rows={5} placeholder="Tell us what's on your mind..."></textarea></label><button className="primary-button" type="submit">Send a little note <ArrowRight size={18} /></button></form></section>; }

function CartDrawer({ cart, total, onClose, onUpdate }: { cart: CartItem[]; total: number; onClose: () => void; onUpdate: (id: number, change: number) => void }) { const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const shipping = subtotal > 499 || subtotal === 0 ? 0 : 100; const prepaidDiscount = Math.round(subtotal * 0.2); return <div className="overlay"><aside className="cart-drawer"><div className="drawer-head"><div><span className="eyebrow">your little trove</span><h2>Your cart <span>({cart.length})</span></h2></div><button className="close-button" onClick={onClose} aria-label="Close cart"><X size={21} /></button></div>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name} /><div className="cart-item-info"><h3>{item.name}</h3><strong>{formatPrice(item.price)}</strong><div className="quantity-control"><button onClick={() => onUpdate(item.id, -1)} aria-label="Decrease quantity"><Minus size={14} /></button><span>{item.quantity}</span><button onClick={() => onUpdate(item.id, 1)} aria-label="Increase quantity"><Plus size={14} /></button></div></div></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Shipping</span><strong>{shipping ? formatPrice(shipping) : 'Free'}</strong></div><div className="prepaid-row"><span>Prepaid savings</span><strong>-{formatPrice(prepaidDiscount)}</strong></div><p>{shipping ? 'Flat ₹100 shipping on orders under ₹499.' : 'You unlocked free shipping.'} <b>Pay prepaid and save 20%.</b></p><div className="cart-total"><span>Pay on delivery</span><strong>{formatPrice(total)}</strong></div><button className="primary-button checkout-button">Checkout <ArrowRight size={18} /></button><small>Prepaid orders get 20% off · COD available</small></div></> : <div className="empty-cart"><ShoppingBag size={35} /><h3>Your trove is waiting</h3><p>Add something lovely and it will show up here.</p><button className="primary-button" onClick={onClose}>Keep browsing</button></div>}</aside></div>; }

function ProductModal({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product) => void }) { const [quantity, setQuantity] = useState(1); return <div className="overlay"><div className="product-modal"><button className="close-button modal-close" onClick={onClose} aria-label="Close product details"><X size={21} /></button><div className={`modal-image ${product.tone}`}><img src={product.image} alt={product.name} /></div><div className="modal-content"><span className="product-category">{product.category} tumbler</span><h2>{product.name}</h2><div className="modal-rating"><span className="rating"><Star size={14} fill="currentColor" /> {product.rating}</span><span>32 happy reviews</span></div><div className="modal-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.mrp)}</del><span>{Math.round((1 - product.price / product.mrp) * 100)}% off</span></div><p>{product.description}</p><div className="modal-detail"><span>Made for</span><strong>Everyday sipping, gifting, and tiny upgrades.</strong></div><div className="modal-actions"><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity"><Plus size={14} /></button></div><button className="primary-button" onClick={() => { for (let index = 0; index < quantity; index += 1) onAdd(product); onClose(); }}>Add to cart <ShoppingBag size={17} /></button></div><div className="modal-trust"><span><Truck size={16} /> Free shipping over ₹499</span><span>20% off when prepaid</span></div></div></div></div>; }

export default App;
