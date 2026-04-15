import { MdClose, MdOutlineCompareArrows, MdVerified } from "react-icons/md";
import Dialog from "@mui/material/Dialog";
import Rating from "@mui/material/Rating";
import QuantityBox from "../QuantityBox";
import { BsCartFill } from "react-icons/bs";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { MyContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import ProductZoom from "../ProductZoom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";

const ProductModal = (props) => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem("user") && !!localStorage.getItem("token");

  useEffect(() => {
    if (context.productId) {
      setProduct(null);
      setActiveSize(null);
      setQty(1);
      axios
        .get(`http://localhost:4000/api/products/${context.productId}`)
        .then(res => setProduct(res.data))
        .catch(err => console.log(err));
    }
  }, [context.productId]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?._id) {
      fetchDataFromApi(`/api/wishlist/${user._id}`).then(res => setWishlistItems(res?.items || []));
    }
  }, []);

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
      context.setWishlistUpdated(prev => !prev);
    } catch (e) { console.error(e); }
  };

  const getVariantData = () => {
    if (!product) return { label: "", options: [] };
    if (product.productRAMS?.length > 0) return { label: "RAM", options: product.productRAMS };
    if (product.productSIZE?.length > 0) return { label: "Size", options: product.productSIZE };
    if (product.productWEIGHT?.length > 0) return { label: "Weight", options: product.productWEIGHT };
    return { label: "", options: [] };
  };
  const variantData = getVariantData();

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!isLoggedIn()) {
      navigate("/SignIn");
   context.setisOpenProductModel(false);
      
     }
    if (variantData.options.length > 0 && activeSize === null) {
      context.setAlertBox({ open: true, error: true, msg: `Please select ${variantData.label}` });
      return;
    }
    setAdding(true);
    try {
      const res = await postData("/api/cart/add", {
        userId: user._id,
        productId: product._id,
        quantity: qty,
        variant: variantData.options[activeSize] || null,
        variantType: variantData.label,
      });
      if (!res || res.error) {
        context.setAlertBox({ open: true, error: true, msg: res?.msg || "Failed to add to cart" });
        return;
      }
      context.setAlertBox({ open: true, error: false, msg: "Added to cart! 🛒" });
      context.setisOpenProductModel(false);
      navigate(`/cart/${user._id}`);
    } catch (e) {
      context.setAlertBox({ open: true, error: true, msg: "Something went wrong" });
    } finally {
      setAdding(false);
    }
  };

  const discount = product?.oldPrice && product?.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        /* ── dialog override ── */
        .pm-dialog .MuiDialog-paper {
          border-radius: 20px !important;
          max-width: 880px !important;
          width: 95vw !important;
          overflow: hidden !important;
          box-shadow: 0 24px 80px rgba(15,27,45,.22) !important;
          font-family: 'DM Sans', sans-serif !important;
          padding: 0 !important;
        }

        /* ── close button ── */
        .pm-close {
          position: absolute !important;
          top: 14px !important;
          right: 14px !important;
          width: 36px !important;
          height: 36px !important;
          min-width: 0 !important;
          padding: 0 !important;
          border-radius: 10px !important;
          background: #f1f5f9 !important;
          border: none !important;
          z-index: 10 !important;
          color: #374151 !important;
          transition: background .15s !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .pm-close:hover { background: #fee2e2 !important; color: #dc2626 !important; }

        /* ── header band ── */
        .pm-header {
          background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fc 100%);
          padding: 22px 28px 18px;
          border-bottom: 1px solid #dce8f8;
          position: relative;
        }
        .pm-name {
          font-family: 'Sora', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #0f1b2d;
          margin: 0 0 8px;
          padding-right: 44px;
          line-height: 1.35;
        }
        .pm-meta-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        .pm-brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #fff;
          color: #1a6fc4;
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          border: 1px solid #c7d9f5;
          letter-spacing: .03em;
        }
        .pm-rating-wrap { display: flex; align-items: center; gap: 5px; }
        .pm-rating-count { font-size: 12px; color: #64748b; }

        /* ── body ── */
        .pm-body { padding: 24px 28px; }

        /* price */
        .pm-price-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap;
        }
        .pm-price-new {
          font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 800; color: #0f1b2d;
        }
        .pm-price-old {
          font-size: 15px; color: #94a3b8; text-decoration: line-through; font-weight: 500;
        }
        .pm-discount {
          background: linear-gradient(135deg, #ff6b35, #f7431c);
          color: #fff; font-size: 11px; font-weight: 800;
          padding: 3px 10px; border-radius: 20px; letter-spacing: .04em;
        }

        /* stock */
        .pm-stock {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px;
        }
        .pm-stock.in { background: #dcfce7; color: #15803d; }
        .pm-stock.out { background: #fee2e2; color: #dc2626; }
        .pm-stock-dot { width: 6px; height: 6px; border-radius: 50%; }
        .pm-stock.in .pm-stock-dot { background: #16a34a; }
        .pm-stock.out .pm-stock-dot { background: #dc2626; }

        /* description */
        .pm-desc {
          font-size: 13.5px; color: #64748b; line-height: 1.7;
          margin-bottom: 14px; display: -webkit-box;
          -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }

        /* divider */
        .pm-divider { height: 1px; background: #eef0f4; margin: 14px 0; }

        /* variant */
        .pm-variant-label {
          font-size: 13px; color: #64748b; font-weight: 600; margin-bottom: 8px;
        }
        .pm-variant-label b { color: #0f1b2d; }
        .pm-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 14px; }
        .pm-tag {
          padding: 6px 16px; border-radius: 8px; border: 1.5px solid #e2e8f2;
          font-size: 12.5px; font-weight: 600; color: #374151; cursor: pointer;
          background: #f8fafc; transition: all .18s; letter-spacing: .02em;
        }
        .pm-tag:hover { border-color: #94b8e8; background: #f0f5ff; color: #1a6fc4; }
        .pm-tag.active {
          border-color: #1a6fc4; background: #1a6fc4; color: #fff;
          box-shadow: 0 4px 12px rgba(26,111,196,.28);
        }

        /* actions */
        .pm-action-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .pm-btn-cart {
          display: flex !important; align-items: center !important; gap: 8px !important;
          padding: 11px 24px !important;
          background: linear-gradient(135deg, #1a6fc4, #0f4c81) !important;
          color: #fff !important; border: none !important; border-radius: 11px !important;
          font-family: 'DM Sans', sans-serif !important; font-size: 13.5px !important;
          font-weight: 700 !important; cursor: pointer !important; text-transform: none !important;
          box-shadow: 0 6px 18px rgba(26,111,196,.32) !important;
          transition: opacity .2s, transform .15s !important; white-space: nowrap !important;
        }
        .pm-btn-cart:hover { opacity: .88 !important; transform: translateY(-1px) !important; }
        .pm-btn-cart:disabled { opacity: .6 !important; }

        .pm-icon-btn {
          width: 44px !important; height: 44px !important; min-width: 0 !important;
          border-radius: 11px !important; border: 1.5px solid #e2e8f2 !important;
          background: #f8fafc !important; display: flex !important;
          align-items: center !important; justify-content: center !important;
          cursor: pointer !important; transition: all .2s !important;
          padding: 0 !important; color: #374151 !important;
        }
        .pm-icon-btn:hover { background: #f0f5ff !important; border-color: #94b8e8 !important; color: #1a6fc4 !important; }
        .pm-icon-btn.wished { background: #fff0f0 !important; border-color: #fca5a5 !important; color: #e53e3e !important; }

        /* loading skeleton */
        .pm-skeleton {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 60px 20px; gap: 12px; text-align: center;
        }
        .pm-skeleton-spinner {
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid #e8f0fc; border-top-color: #1a6fc4;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pm-skeleton p { font-size: 13px; color: #94a3b8; margin: 0; font-family: 'DM Sans', sans-serif; }
      `}</style>

      <Dialog
        open={context.isOpenProductModel}
        className="pm-dialog"
        onClose={() => context.setisOpenProductModel(false)}
      >
        {/* Close */}
        <button className="pm-close" onClick={() => context.setisOpenProductModel(false)}>
          <MdClose size={18} />
        </button>

        {/* Loading */}
        {!product ? (
          <div className="pm-skeleton">
            <div className="pm-skeleton-spinner" />
            <p>Loading product details…</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pm-header">
              <h4 className="pm-name">{product.name}</h4>
              <div className="pm-meta-row">
                {product.brand && (
                  <span className="pm-brand-badge">
                    <MdVerified size={12} /> {product.brand}
                  </span>
                )}
                <div className="pm-rating-wrap">
                  <Rating value={product.rating || 0} readOnly size="small" precision={0.5} />
                  <span className="pm-rating-count">{product.rating || 0} / 5</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="pm-body">
              <div className="row g-4">

                {/* Left: zoom */}
                <div className="col-md-5">
                  <ProductZoom images={product.images} />
                </div>

                {/* Right: details */}
                <div className="col-md-7">

                  {/* Price */}
                  <div className="pm-price-row">
                    <span className="pm-price-new">₹{product.price?.toLocaleString("en-IN")}</span>
                    {product.oldPrice > product.price && (
                      <>
                        <span className="pm-price-old">₹{product.oldPrice?.toLocaleString("en-IN")}</span>
                        {discount > 0 && <span className="pm-discount">{discount}% OFF</span>}
                      </>
                    )}
                  </div>

                  {/* Stock */}
                  <span className={`pm-stock ${product.countInStock > 0 ? "in" : "out"}`}>
                    <span className="pm-stock-dot" />
                    {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                  {/* Description */}
                  {product.description && (
                    <p className="pm-desc">{product.description}</p>
                  )}

                  <div className="pm-divider" />

                  {/* Variants */}
                  {variantData.options.length > 0 && (
                    <>
                      <div className="pm-variant-label">
                        {variantData.label}: <b>{activeSize !== null ? variantData.options[activeSize] : "Select one"}</b>
                      </div>
                      <div className="pm-tags">
                        {variantData.options.map((opt, i) => (
                          <span
                            key={i}
                            className={`pm-tag${activeSize === i ? " active" : ""}`}
                            onClick={() => setActiveSize(i)}
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </>
                  )}

                     <QuantityBox
                      qty={qty}
                      onIncrease={() => setQty(q => q + 1)}
                      onDecrease={() => setQty(q => Math.max(1, q - 1))}
                    />
                  {/* Actions */}
                  <div className="pm-action-row mt-4">
                   

                    <button
                      className="pm-btn-cart"
                      disabled={adding || product.countInStock === 0}
                      onClick={handleAddToCart}
                    >
                      <BsCartFill size={14} />
                      {adding ? "Adding…" : "Add to Cart"}
                    </button>

                    <button
                      className={`pm-icon-btn${isInWishlist ? " wished" : ""}`}
                      title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      onClick={() => {
                        if (!isLoggedIn()) { navigate("/SignIn"); return; }
                        if (product?._id) toggleWishlist(product._id);
                      }}
                    >
                      {isInWishlist
                        ? <IoMdHeart size={18} />
                        : <IoMdHeartEmpty size={18} />
                      }
                    </button>

                    <button className="pm-icon-btn" title="Compare">
                      <MdOutlineCompareArrows size={19} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProductModal;