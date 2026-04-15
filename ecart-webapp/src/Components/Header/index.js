import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../../App';
import { fetchDataFromApi, postData } from '../../utils/api';
import Navigation from '../Navigation';
import CountryDropdown from '../CountryDropdown';
import SearchBox from '../SearchBox';

// ── inline styles ──────────────────────────────────────────────────────────
const S = {
  /* announcement strip */
  strip: {
    background: 'linear-gradient(90deg,#0f4c81 0%,#1a6fc4 50%,#0f4c81 100%)',
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
    padding: '8px 16px',
    letterSpacing: '.04em',
    fontFamily: "'DM Sans', sans-serif",
  },
  stripText: { opacity: .9 },
  stripBold: { fontWeight: 600, opacity: 1 },

  /* outer header */
  headerOuter: {
    background: '#fff',
    borderBottom: '1px solid #eef0f4',
    position: 'sticky',
    top: 0,
    zIndex: 999,
    boxShadow: '0 2px 16px rgba(15,76,129,.07)',
  },
  headerInner: {
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 24px',
  },

  /* logo */
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    background: 'linear-gradient(135deg,#1a6fc4 0%,#0f4c81 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 800, fontSize: 18,
    fontFamily: "'Sora', sans-serif",
    boxShadow: '0 4px 14px rgba(26,111,196,.35)',
  },
  logoText: { fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, color: '#0f1b2d', lineHeight: 1 },
  logoAccent: { color: '#1a6fc4' },

  /* country */
  countryWrap: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '9px 14px', borderRadius: 10,
    border: '1px solid #e8ecf2', background: '#f7f9fc',
    fontSize: 13, color: '#4a5568', cursor: 'pointer', flexShrink: 0,
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color .2s, background .2s',
  },

  /* search */
  searchOuter: { flex: 1, position: 'relative', minWidth: 0 },
  searchInput: {
    width: '100%', padding: '11px 130px 11px 46px',
    border: '1.5px solid #e2e8f2', borderRadius: 12,
    fontSize: 14, background: '#f7f9fc', color: '#1a202c',
    outline: 'none', fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color .2s, box-shadow .2s, background .2s',
  },
  searchIcon: { position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' },
  searchBtn: {
    position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
    background: 'linear-gradient(135deg,#1a6fc4,#0f4c81)',
    color: '#fff', border: 'none', borderRadius: 8,
    padding: '7px 18px', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    letterSpacing: '.02em', transition: 'opacity .2s',
  },

  /* actions */
  actions: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },

  /* icon button */
  iconBtn: {
    width: 42, height: 42, borderRadius: 11,
    border: '1px solid #e8ecf2', background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', position: 'relative', transition: 'all .2s',
  },
  badge: {
    position: 'absolute', top: -5, right: -5,
    background: 'linear-gradient(135deg,#ff6b35,#f7431c)',
    color: '#fff', fontSize: 10, fontWeight: 700,
    width: 19, height: 19, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2px solid #fff', fontFamily: "'DM Sans', sans-serif",
  },
  priceTag: {
    fontSize: 13, fontWeight: 600, color: '#0f4c81',
    fontFamily: "'DM Sans', sans-serif", padding: '0 4px',
    whiteSpace: 'nowrap',
  },

  /* sign in btn */
  signinBtn: {
    padding: '10px 22px',
    background: 'linear-gradient(135deg,#1a6fc4,#0f4c81)',
    color: '#fff', border: 'none', borderRadius: 11,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", letterSpacing: '.02em',
    boxShadow: '0 4px 14px rgba(26,111,196,.3)',
    whiteSpace: 'nowrap', transition: 'opacity .2s',
  },

  /* user pill */
  userPill: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '6px 14px 6px 6px',
    border: '1px solid #e8ecf2', borderRadius: 11,
    background: '#fff', cursor: 'pointer', transition: 'all .2s',
  },
  avatar: {
    width: 30, height: 30, borderRadius: 8,
    background: 'linear-gradient(135deg,#1a6fc4,#0f4c81)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff',
    fontFamily: "'Sora', sans-serif",
  },
  userName: { fontSize: 13, fontWeight: 600, color: '#1a202c', fontFamily: "'DM Sans', sans-serif" },

  /* cart dropdown */
  cartDrop: {
    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
    width: 320, background: '#fff',
    border: '1px solid #e8ecf2', borderRadius: 16,
    boxShadow: '0 16px 48px rgba(0,0,0,.13)',
    zIndex: 300, overflow: 'hidden',
    animation: 'dropIn .2s ease',
  },
  cartDropHead: {
    padding: '14px 18px 12px', borderBottom: '1px solid #eef0f4',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: '#f7f9fc',
  },
  cartDropTitle: { fontSize: 14, fontWeight: 700, color: '#0f1b2d', fontFamily: "'Sora', sans-serif" },
  cartCountBadge: {
    background: '#e8f0fc', color: '#1a6fc4', fontSize: 11,
    fontWeight: 700, padding: '3px 10px', borderRadius: 20,
    fontFamily: "'DM Sans', sans-serif",
  },
  cartItem: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 18px', borderBottom: '1px solid #f0f2f5',
  },
  cartImg: {
    width: 52, height: 52, borderRadius: 10,
    objectFit: 'cover', border: '1px solid #eef0f4', flexShrink: 0,
  },
  cartItemName: { fontSize: 13, fontWeight: 600, color: '#1a202c', fontFamily: "'DM Sans', sans-serif", marginBottom: 2 },
  cartItemPrice: { fontSize: 12, color: '#64748b', fontFamily: "'DM Sans', sans-serif" },
  cartFooter: { padding: '14px 18px' },
  cartSubtotal: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, fontFamily: "'DM Sans', sans-serif",
  },
  cartSubLabel: { fontSize: 13, color: '#64748b' },
  cartSubAmt: { fontSize: 15, fontWeight: 700, color: '#0f1b2d' },
  cartBtnView: {
    width: '100%', padding: '10px', borderRadius: 9,
    border: '1.5px solid #e2e8f2', background: '#f7f9fc',
    fontSize: 13, fontWeight: 600, color: '#1a202c',
    cursor: 'pointer', marginBottom: 8, fontFamily: "'DM Sans', sans-serif",
  },
  cartBtnCheckout: {
    width: '100%', padding: '11px',
    background: 'linear-gradient(135deg,#1a6fc4,#0f4c81)',
    color: '#fff', border: 'none', borderRadius: 9,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 4px 14px rgba(26,111,196,.3)',
  },
  emptyCart: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '28px 20px', textAlign: 'center',
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: '50%',
    background: '#f0f5ff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12, fontSize: 26,
  },
  emptyTitle: { fontSize: 14, fontWeight: 600, color: '#1a202c', fontFamily: "'DM Sans', sans-serif", marginBottom: 4 },
  emptyText: { fontSize: 12, color: '#94a3b8', fontFamily: "'DM Sans', sans-serif", marginBottom: 14 },
  shopBtn: {
    padding: '9px 22px',
    background: 'linear-gradient(135deg,#1a6fc4,#0f4c81)',
    color: '#fff', border: 'none', borderRadius: 9,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
  },

  /* user dropdown */
  userDrop: {
    position: 'absolute', right: 0, top: 'calc(100% + 10px)',
    width: 210, background: '#fff',
    border: '1px solid #e8ecf2', borderRadius: 14,
    boxShadow: '0 16px 48px rgba(0,0,0,.13)',
    zIndex: 300, overflow: 'hidden',
    animation: 'dropIn .2s ease',
  },
  userDropHead: {
    padding: '14px 16px 12px', borderBottom: '1px solid #eef0f4',
    background: 'linear-gradient(135deg,#f0f5ff,#e8f0fc)',
  },
  userDropName: { fontSize: 14, fontWeight: 700, color: '#0f1b2d', fontFamily: "'Sora', sans-serif" },
  userDropEmail: { fontSize: 11, color: '#64748b', marginTop: 2, fontFamily: "'DM Sans', sans-serif" },
  udItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 16px', fontSize: 13, color: '#374151',
    cursor: 'pointer', transition: 'background .15s',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    borderBottom: '1px solid #f8f9fb',
  },
  udLogout: { color: '#e53e3e', borderBottom: 'none' },
};

// ── tiny SVG icons ─────────────────────────────────────────────────────────
const Icon = {
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  Bag: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),
  Heart: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Chevron: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Order: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
  Wishlist: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// ── component ──────────────────────────────────────────────────────────────
const Header = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCart, setShowCart]   = useState(false);
  const [showUser, setShowUser]   = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);

  const cartRef = useRef();
  const userRef = useRef();

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setShowCart(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user')));
  }, [context.isLogin]);

  const getCartData = async () => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (!u?._id) return;
    const res = await fetchDataFromApi(`/api/cart/${u._id}`);
    if (res?.items) {
      setCartItems(res.items);
      let total = 0, count = 0;
      res.items.forEach(i => { total += i.product?.price * i.quantity; count += i.quantity; });
      setTotalPrice(total);
      setCartCount(count);
    }
  };

  useEffect(() => { getCartData(); }, []);

const logout = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  await postData("/api/user/logout", {
    userId: user._id
  });

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/SignIn");
};

  const requireLogin = (path) => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (!u) {
      context.setAlertBox({ open: true, error: true, msg: 'Please Login First!' });
      navigate('/SignIn');
    } else {
      navigate(path.replace(':id', u._id));
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  return (
    <>
   

      {/* Announcement strip */}
      <div style={S.strip}>
        <span style={S.stripText}>
          Due to the <b style={S.stripBold}>COVID-19</b> epidemic, orders may be processed with a slight delay
        </span>
      </div>

      {/* Main header */}
      <div style={S.headerOuter}>
        <div style={S.headerInner}>

          {/* Logo */}
          <Link to="/" style={S.logoWrap}>
            <div style={S.logoIcon}>S</div>
            <span style={S.logoText}>Shop<span style={S.logoAccent}>Kart</span></span>
          </Link>

          {/* Country */}
          {context.countryList?.length !== 0 && (
            <div className="hdr-country" style={S.countryWrap}>
              <CountryDropdown />
            </div>
          )}

          {/* Search */}
          <div style={S.searchOuter}>
            <span style={S.searchIcon}><Icon.Search /></span>
            <input
              className="hdr-search-input"
              style={S.searchInput}
              placeholder="Search products, brands and more…"
              onChange={e => context.setSearch(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            {/* <button className="hdr-search-btn" style={S.searchBtn}>Search</button> */}
          </div>

          {/* Actions */}
          <div style={S.actions}>

            {/* Wishlist */}
            <div
              className="hdr-icon-btn"
              style={S.iconBtn}
              onClick={() => requireLogin('/Wishlist/:id')}
              title="Wishlist"
            >
              <Icon.Heart />
            </div>

            {/* Price + Cart */}
            <span style={S.priceTag}>₹ {totalPrice.toLocaleString('en-IN')}</span>

            <div ref={cartRef} style={{ position: 'relative' , zIndex: 99999 }}>
              <div
                className="hdr-icon-btn"
                style={S.iconBtn}
                onClick={() => { setShowUser(false); setShowCart(v => !v); getCartData(); }}
                title="Cart"
              >
                <Icon.Bag />
                {cartCount > 0 && <span style={S.badge}>{cartCount}</span>}
              </div>

              {showCart && (
                <div style={S.cartDrop}>
                  <div style={S.cartDropHead}>
                    <span style={S.cartDropTitle}>My Cart</span>
                    <span style={S.cartCountBadge}>{cartCount} items</span>
                  </div>

                  {cartItems.length === 0 ? (
                    <div style={S.emptyCart}>
                      <div style={S.emptyIcon}>🛒</div>
                      <p style={S.emptyTitle}>Your cart is empty</p>
                      <p style={S.emptyText}>Add items to get started</p>
                      <button style={S.shopBtn} className="hdr-cart-btn-checkout" onClick={() => navigate('/cat')}>
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item, i) => (
                        <div key={i} className="hdr-cart-item" style={S.cartItem}>
                          <img
                            src={item.product?.images?.[0]?.[0]}
                            alt={item.product?.name}
                            style={S.cartImg}
                          />
                          <div>
                            <p style={S.cartItemName}>{item.product?.name}</p>
                            <p style={S.cartItemPrice}>{item.quantity} × ₹ {item.product?.price?.toLocaleString('en-IN')}</p>
                          </div>
                        </div>
                      ))}
                      <div style={S.cartFooter}>
                        <div style={S.cartSubtotal}>
                          <span style={S.cartSubLabel}>Subtotal</span>
                          <span style={S.cartSubAmt}>₹ {totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          className="hdr-cart-btn-view"
                          style={S.cartBtnView}
                          onClick={() => { setShowCart(false); navigate(`/cart/${user?._id}`); }}
                        >
                          View Cart
                        </button>
                        <button
                          className="hdr-cart-btn-checkout"
                          style={S.cartBtnCheckout}
                          onClick={() => { setShowCart(false); navigate(`/checkout/${user?._id}`); }}
                        >
                          Checkout →
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            {context.isLogin ? (
              <div ref={userRef} style={{ position: 'relative' , zIndex: 99999 }}>
                <div
                  className="hdr-user-pill"
                  style={S.userPill}
                  onClick={() => { setShowCart(false); setShowUser(v => !v); }}
                >
                  <div style={S.avatar}>{initials}</div>
                  <span style={S.userName}>{user?.name?.split(' ')[0] || 'Account'}</span>
                  <Icon.Chevron />
                </div>

                {showUser && (
                  <div style={S.userDrop}>
                    <div style={S.userDropHead}>
                      <div style={S.userDropName}>{user?.name}</div>
                      <div style={S.userDropEmail}>{user?.email}</div>
                    </div>

                    {[
                      { icon: <Icon.User />, label: 'My Profile', path: `/profile/${user?._id}` },
                      { icon: <Icon.Order />, label: 'My Orders', path: `/myOrders/${user?._id}` },
                      { icon: <Icon.Wishlist />, label: 'Wishlist', path: `/Wishlist/${user?._id}` },
                    ].map(({ icon, label, path }) => (
                      <div
                        key={label}
                        className="hdr-ud-item"
                        style={S.udItem}
                        onClick={() => { setShowUser(false); navigate(path); }}
                      >
                        {icon} {label}
                      </div>
                    ))}

                    <div className="hdr-ud-item" style={{ ...S.udItem, ...S.udLogout }} onClick={logout}>
                      <Icon.Logout /> Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/SignIn">
                <button className="hdr-signin-btn" style={S.signinBtn}>Sign In</button>
              </Link>
            )}
          </div>

        </div>

         <Navigation />
      </div>

     
    </>
  );
};

export default Header;