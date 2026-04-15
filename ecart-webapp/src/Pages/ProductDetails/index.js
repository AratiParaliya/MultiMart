import ProductZoom from "../../Components/ProductZoom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { MdOutlineCompareArrows, MdVerified, MdLocalShipping, MdSecurity } from "react-icons/md";
import { BsCartFill, BsBagCheckFill } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaShareAlt } from "react-icons/fa";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useState, useContext, useEffect } from "react";
import RelatedProducts from "./RelatedProducts";
import { MyContext } from "../../App";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [activeSize, setActiveSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeTabs, setActiveTabs] = useState(0);
  const [product, setProduct] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [addingCart, setAddingCart] = useState(false);

  useEffect(() => { if (id) { getProductDetails(); fetchReviews(); } }, [id]);

  useEffect(() => {
    if (product?._id) {
      let recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
      recent = recent.filter(i => i !== product._id);
      recent.unshift(product._id);
      if (recent.length > 10) recent = recent.slice(0, 10);
      localStorage.setItem("recentProducts", JSON.stringify(recent));
    }
  }, [product]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      fetchDataFromApi(`/api/wishlist/${user._id}`).then(res => setWishlistItems(res?.items || []));
    }
  }, []);

  const fetchReviews = async () => {
    const res = await fetchDataFromApi(`/api/reviews/product/${id}`);
    setReviews(res?.reviews || []);
  };

  const getProductDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/products/${id}`);
      setProduct(res.data);
    } catch (e) { console.log(e); }
  };

  const isLoggedIn = () => !!localStorage.getItem("user") && !!localStorage.getItem("token");

  const isInWishlist = wishlistItems.some(w => {
    const wId = w.product?._id || w.product;
    return wId?.toString() === product?._id?.toString();
  });

  const toggleWishlist = async (productId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/SignIn"); return; }
    try {
      const exists = wishlistItems.find(item => (item.product?._id || item.product)?.toString() === productId.toString());
      if (exists) {
        await deleteData("/api/wishlist/remove", { userId: user._id, productId });
        context.setAlertBox({ open: true, error: false, msg: "Removed from Wishlist" });
      } else {
        await postData("/api/wishlist/add", { userId: user._id, productId });
        context.setAlertBox({ open: true, error: false, msg: "Added to Wishlist ❤️" });
      }
      const updated = await fetchDataFromApi(`/api/wishlist/${user._id}`);
      setWishlistItems(updated?.items || []);
    } catch (e) {
      context.setAlertBox({ open: true, error: true, msg: "Something went wrong!" });
    }
  };

  const getVariantData = () => {
    if (!product) return { label: "", options: [] };
    if (product.productRAMS?.length > 0) return { label: "RAM", options: product.productRAMS };
    if (product.productSIZE?.length > 0) return { label: "Size", options: product.productSIZE };
    if (product.productWEIGHT?.length > 0) return { label: "Weight", options: product.productWEIGHT };
    return { label: "", options: [] };
  };
  const variantData = getVariantData();

  const handleAddToCart = async (goToCart = false) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn()) { navigate("/SignIn"); return; }
    if (variantData.options.length > 0 && activeSize === null) {
      context.setAlertBox({ open: true, error: true, msg: `Please select ${variantData.label}` });
      return;
    }
    setAddingCart(true);
    try {
      const selectedVariant = variantData.options.length > 0 ? variantData.options[activeSize] : null;
      const res = await postData("/api/cart/add", {
        userId: user._id,
        productId: product._id,
        quantity: qty,
        variant: selectedVariant,
        variantType: variantData.label,
      });
      if (!res || res.error) {
        context.setAlertBox({ open: true, error: true, msg: res?.msg || "Failed to add to cart" });
        return;
      }
      context.setAlertBox({ open: true, error: false, msg: "Added to cart successfully! 🛒" });
      if (goToCart) navigate(`/cart/${user._id}`);
    } catch (e) {
      context.setAlertBox({ open: true, error: true, msg: "Something went wrong" });
    } finally {
      setAddingCart(false);
    }
  };

  const discount = product?.oldPrice && product?.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : product?.rating || 0;

  return (
    <>
    

      <section className="pd-page">
        <div className="container">

          {/* Breadcrumb */}
          <div className="pd-breadcrumb pd-fade">
            <span onClick={() => navigate("/")}>Home</span> /
            <span onClick={() => navigate("/cat")}>Shop</span> /
            <span style={{ color: '#374151' }}>{product?.name || "Product"}</span>
          </div>

          {/* ── Main product card ── */}
          <div className="pd-card pd-fade">
            <div className="row g-4">

              {/* LEFT — images */}
              <div className="col-md-5">
                <ProductZoom images={product?.images} />
              </div>

              {/* RIGHT — info */}
              <div className="col-md-7">

                <h1 className="pd-title">{product?.name}</h1>

                {/* Brand + Rating */}
                <div className="pd-meta-row">
                  {product?.brand && (
                    <span className="pd-brand-badge">
                      <MdVerified size={13} /> {product.brand}
                    </span>
                  )}
                  <div className="pd-rating-wrap">
                    <Rating value={Number(avgRating)} readOnly precision={0.5} size="small" />
                    <span className="pd-rating-count" onClick={() => setActiveTabs(2)}>
                      {avgRating} ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="pd-price-row">
                  <span className="pd-price-new">₹{product?.price?.toLocaleString("en-IN")}</span>
                  {product?.oldPrice > product?.price && (
                    <>
                      <span className="pd-price-old">₹{product?.oldPrice?.toLocaleString("en-IN")}</span>
                      {discount > 0 && <span className="pd-discount-pill">{discount}% OFF</span>}
                    </>
                  )}
                </div>

                {/* Stock */}
                <span className={`pd-stock ${product?.countInStock > 0 ? "in" : "out"}`}>
                  <span className="pd-stock-dot" />
                  {product?.countInStock > 0
                    ? `In Stock (${product.countInStock} available)`
                    : "Out of Stock"}
                </span>

                <div className="pd-divider" />

                {/* Color */}
                {product?.color && (
                  <div className="pd-attr-row">
                    <span className="pd-attr-label">Color</span>
                    <span
                      className="pd-color-swatch"
                      style={{ background: product.color?.toLowerCase() }}
                      title={product.color}
                    />
                    <span className="pd-attr-val">{product.color}</span>
                  </div>
                )}

                {/* Variants */}
                {variantData.options.length > 0 && (
                  <div className="pd-variant-wrap">
                    <div className="pd-variant-label">
                      {variantData.label}: <b>{activeSize !== null ? variantData.options[activeSize] : "Select one"}</b>
                    </div>
                    <div className="pd-tags">
                      {variantData.options.map((opt, i) => (
                        <span
                          key={i}
                          className={`pd-tag${activeSize === i ? " active" : ""}`}
                          onClick={() => setActiveSize(i)}
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Actions */}
                <div className="pd-action-row">
                  <QuantityBox
                    qty={qty}
                    onIncrease={() => setQty(q => q + 1)}
                    onDecrease={() => setQty(q => Math.max(1, q - 1))}
                  />

                  <button
                    className="pd-btn-cart"
                    disabled={addingCart || product?.countInStock === 0}
                    onClick={() => handleAddToCart(true)}
                  >
                    <BsCartFill size={15} />
                    {addingCart ? "Adding…" : "Add to Cart"}
                  </button>

                  <button
                    className="pd-btn-buy"
                    disabled={product?.countInStock === 0}
                    onClick={() => handleAddToCart(true)}
                  >
                    <BsBagCheckFill size={15} />
                    Buy Now
                  </button>

                  <button
                    className={`pd-icon-btn${isInWishlist ? " wished" : ""}`}
                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                    onClick={() => {
                      if (!isLoggedIn()) { navigate("/SignIn"); return; }
                      if (product?._id) toggleWishlist(product._id);
                    }}
                  >
                    {isInWishlist
                      ? <FaHeart size={17} />
                      : <FaRegHeart size={17} />
                    }
                  </button>

                  <button className="pd-icon-btn" title="Compare">
                    <MdOutlineCompareArrows size={19} />
                  </button>

                  <button className="pd-icon-btn" title="Share">
                    <FaShareAlt size={15} />
                  </button>
                </div>

                {/* Trust strip */}
                <div className="pd-trust-strip">
                  <div className="pd-trust-item">
                    <MdLocalShipping size={20} />
                    <b>Free Delivery</b>
                    On orders over ₹500
                  </div>
                  <div className="pd-trust-item">
                    <MdSecurity size={20} />
                    <b>Secure Payment</b>
                    100% protected
                  </div>
                  <div className="pd-trust-item">
                    <HiOutlineBadgeCheck size={20} />
                    <b>Easy Returns</b>
                    7-day return policy
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ── Tabs card ── */}
          <div className="pd-tabs-card pd-fade" style={{ animationDelay: '.12s' }}>
            <div className="pd-tabs-header">
              {["Description", "Specifications", `Reviews (${reviews.length})`].map((label, i) => (
                <button
                  key={i}
                  className={`pd-tab-btn${activeTabs === i ? " active" : ""}`}
                  onClick={() => setActiveTabs(i)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pd-tab-content">

              {/* Description */}
              {activeTabs === 0 && (
                <div className="pd-description">
                  <p>{product?.description || "No description available for this product."}</p>
                </div>
              )}

              {/* Specs */}
              {activeTabs === 1 && (
                product?.specifications?.length > 0 ? (
                  <table className="pd-specs-table">
                    <tbody>
                      {product.specifications.map((spec, i) => (
                        <tr key={i}>
                          <th>{spec.key}</th>
                          <td>{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="pd-empty">
                    <img src="https://cdn-icons-png.flaticon.com/128/7486/7486804.png" width="60" alt="no data" />
                    <h6>No Specifications Available</h6>
                    <p>Nothing to show right now</p>
                  </div>
                )
              )}

              {/* Reviews */}
              {activeTabs === 2 && (
                <div className="row">
                  <div className="col-md-8">

                    {/* Rating summary */}
                    {reviews.length > 0 && (
                      <div className="pd-rating-summary">
                        <div className="pd-rating-big">{avgRating}</div>
                        <Rating value={Number(avgRating)} readOnly precision={0.5} />
                        <div className="pd-rating-total">Based on {reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
                      </div>
                    )}

                    <h5 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 700, color: '#0f1b2d', marginBottom: 18, fontSize: 17 }}>
                      Customer Reviews
                    </h5>

                    {reviews.length > 0 ? reviews.map((rev, i) => (
                      <div key={i} className="pd-review-item">
                        <div className="pd-review-header">
                          <img
                            src={rev.userId?.image
                              ? rev.userId.image
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.userId?.name || "User")}&background=e8f0fc&color=1a6fc4&bold=true`
                            }
                            className="pd-review-avatar"
                            alt="avatar"
                          />
                          <div>
                            <p className="pd-review-name">{rev.userId?.name || "Anonymous"}</p>
                            <span className="pd-review-date">
                              {new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>
                        </div>

                        <div className="pd-review-rating">
                          <Rating value={rev.rating} readOnly size="small" />
                          <span className="pd-review-rating-num">⭐ {rev.rating}.0</span>
                        </div>

                        <p className="pd-review-text">{rev.reviewText}</p>

                        <div className="pd-review-actions">
                          <span className="pd-review-action-btn">👍 Helpful</span>
                          <span className="pd-review-action-btn">💬 Reply</span>
                        </div>

                        {rev.replies?.length > 0 && (
                          <div className="pd-reply-wrap">
                            {rev.replies.map((reply, j) => (
                              <div key={j} className="pd-reply-item">
                                <img
                                  src={reply.userImage
                                    ? `http://localhost:4000/${reply.userImage}`
                                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.userName || "User")}&background=f0f5ff&color=1a6fc4`
                                  }
                                  className="pd-reply-avatar"
                                  alt="reply-avatar"
                                />
                                <div>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span className="pd-reply-name">{reply.userName}</span>
                                    <span className="pd-reply-date">
                                      {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : "Just now"}
                                    </span>
                                  </div>
                                  <p className="pd-reply-text">{reply.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="pd-empty">
                        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" width="80" alt="no reviews" />
                        <h6>No Reviews Yet</h6>
                        <p>Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          
          <div className="pd-card mt-3" >
          {/* Related & Recent */}
          <RelatedProducts title="RELATED PRODUCTS" productId={product?._id} type="related" />
          <RelatedProducts title="RECENTLY VIEWED" type="recent" />
</div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;