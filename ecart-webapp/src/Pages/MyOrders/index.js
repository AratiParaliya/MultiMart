import { useEffect, useState } from "react";
import { editData, fetchDataFromApi, postFormData, putFormData } from "../../utils/api";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";

const statusConfig = {
  Pending:    { bg: "#fff8e1", color: "#f59e0b", border: "#fde68a", dot: "#f59e0b" },
  Processing: { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe", dot: "#3b82f6" },
  Shipped:    { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", dot: "#16a34a" },
  Delivered:  { bg: "#f0fdf4", color: "#15803d", border: "#86efac", dot: "#15803d" },
  Cancelled:  { bg: "#fef2f2", color: "#dc2626", border: "#fecaca", dot: "#dc2626" },
  Paid:       { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", dot: "#1d4ed8" },
};

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { bg: "#f3f4f6", color: "#6b7280", border: "#e5e7eb", dot: "#9ca3af" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
      borderRadius: 20, padding: "4px 10px",
      fontSize: 11, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [reviewMap, setReviewMap] = useState({});
  const navigate = useNavigate();

  const [openReview, setOpenReview] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);
  const [existingReview, setExistingReview] = useState(null);

  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [selectedOrderForAddress, setSelectedOrderForAddress] = useState(null);
  const [addressData, setAddressData] = useState({
    firstName: "", lastName: "", address1: "", address2: "",
    city: "", state: "", zipCode: "", country: "", phone: "",
  });

  useEffect(() => { getOrders(); }, []);

  const getOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetchDataFromApi(`/api/orders/user/${user._id}`);
    if (res?.success) {
      setOrders(res.orders);
      const map = {};
      for (let order of res.orders) {
        for (let item of order.orderItems) {
          const r = await fetchDataFromApi(
            `/api/reviews/user-review?userId=${user._id}&productId=${item.productId}&orderId=${order._id}`
          );
          if (r?.review) map[`${item.productId}_${order._id}`] = r.review;
        }
      }
      setReviewMap(map);
    }
  };

  const handleReviewClick = (item, order) => {
    setSelectedProduct(item);
    setSelectedOrder(order);
    setImages([]);
    const key = `${item.productId}_${order._id}`;
    const review = reviewMap[key];
    if (review) { setExistingReview(review); setRating(review.rating); setReviewText(review.reviewText); }
    else { setExistingReview(null); setRating(0); setReviewText(""); }
    setOpenReview(true);
  };

  const submitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("productId", selectedProduct.productId);
    formData.append("orderId", selectedOrder._id);
    formData.append("rating", rating);
    formData.append("reviewText", reviewText);
    images.forEach((img) => formData.append("images", img));
    const res = existingReview
      ? await putFormData(`/api/reviews/update/${existingReview._id}`, formData)
      : await postFormData(`/api/reviews/add`, formData);
    if (res?.success) {
      alert(existingReview ? "Review updated!" : "Review submitted!");
      setOpenReview(false); setExistingReview(null); setRating(0); setReviewText(""); setImages([]);
      getOrders();
    } else { alert(res?.msg || "Something went wrong"); }
  };

  const canEditAddress = (order) => {
    const diff = (new Date() - new Date(order.dateCreated)) / (1000 * 60 * 60);
    return diff <= 24 && order.status !== "Shipped";
  };

  const handleEditAddress = (order) => {
    setSelectedOrderForAddress(order);
    setAddressData(order.shippingAddress || {});
    setOpenAddressModal(true);
  };

  const updateAddress = async () => {
    const res = await editData(`/api/orders/update-address/${selectedOrderForAddress._id}`, addressData);
    if (!res?.error) { alert("Address updated!"); setOpenAddressModal(false); getOrders(); }
    else alert("Failed to update address");
  };

  return (
    <>
      <style>{`

      `}</style>

      <div className="mo-page">
        {/* header */}
        <div className="mo-page-header">
          <h1>My Orders</h1>
          <p>{orders.length > 0 ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed` : "Track and manage your orders"}</p>
        </div>

        {/* empty state */}
        {orders.length === 0 && (
          <div className="mo-empty">
            <div className="mo-empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders. Start shopping to see them here.</p>
            <button className="mo-empty-btn" onClick={() => navigate("/")}>
              Browse products →
            </button>
          </div>
        )}

        {/* order cards */}
        {orders.map((order) => (
          <div className="mo-order" key={order._id}>

            {/* ── header ── */}
            <div className="mo-order-header">
              <div className="mo-order-meta">
                <div className="mo-order-meta-item">
                  <span className="label">Order ID</span>
                  <span className="value" style={{ fontFamily: "monospace", fontSize: 12 }}>#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="mo-order-meta-item">
                  <span className="label">Placed on</span>
                  <span className="value">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
                <div className="mo-order-meta-item">
                  <span className="label">Total</span>
                  <span className="value">₹{order.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="mo-order-meta-item">
                  <span className="label">Payment</span>
                  <span className="value">{order.paymentMethod}</span>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* ── body ── */}
            <div className="mo-order-body">

              {/* items */}
              <div className="mo-items">
                {order.orderItems.map((item, idx) => {
                  const key = `${item.productId}_${order._id}`;
                  const hasReview = reviewMap[key];
                  return (
                    <div className="mo-item" key={idx}>
                      <img
                        className="mo-item-img"
                        src={item.image || "https://via.placeholder.com/72"}
                        alt={item.name}
                      />
                      <div className="mo-item-info">
                        <div className="mo-item-name">{item.name}</div>
                        <div className="mo-item-meta">Qty: {item.quantity}</div>
                        <div className="mo-item-price">₹{(item.price * (item.quantity || 1)).toLocaleString()}</div>

                        {order.status === "Delivered" && (
                          <button
                            className={`mo-review-btn ${hasReview ? "has-review" : ""}`}
                            onClick={() => handleReviewClick(item, order)}
                          >
                            {hasReview ? "✏ Edit review" : "★ Write a review"}
                          </button>
                        )}

                        {hasReview?.images?.length > 0 && (
                          <>
                            <div className="mo-review-imgs">
                              {hasReview.images.map((img, i) => (
                                <img
                                  key={i}
                                  src={img.startsWith("http") ? img : `http://localhost:4000/${img}`}
                                  alt="review"
                                />
                              ))}
                            </div>
                            <div className="mo-verified">✔ Verified purchase</div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* address */}
              <div className="mo-address">
                <div className="mo-address-header">
                  <span className="mo-address-title">Delivery address</span>
                  {canEditAddress(order) && (
                    <button className="mo-address-edit" onClick={() => handleEditAddress(order)}>Edit</button>
                  )}
                </div>
                <div className="mo-address-name">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </div>
                <div className="mo-address-line">
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.address2 && `, ${order.shippingAddress.address2}`}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} – {order.shippingAddress?.zipCode}
                  <br />
                  {order.shippingAddress?.country}
                </div>
                <div className="mo-address-phone">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {order.shippingAddress?.phone}
                </div>
              </div>
            </div>

            {/* ── footer ── */}
            <div className="mo-order-footer">
              <button className="mo-view-btn" onClick={() => navigate(`/orderdetails/${order._id}`)}>
                View details →
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* ── REVIEW MODAL ── */}
      <Dialog open={openReview} onClose={() => setOpenReview(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 0 }}>
          {existingReview ? "Update your review" : "Write a review"}
        </DialogTitle>
        <DialogContent>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.5)", marginBottom: 14, marginTop: 4 }}>
            {selectedProduct?.name}
          </p>

          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(0,0,0,0.4)", marginBottom: 6 }}>
            Your rating
          </p>
          <Rating value={rating} onChange={(e, v) => setRating(v)} size="large" />

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Share your experience with this product..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            sx={{ mt: 2 }}
          />

          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "rgba(0,0,0,0.4)", margin: "16px 0 8px" }}>
            Add photos (optional)
          </p>
          <input type="file" multiple onChange={(e) => setImages([...e.target.files])} style={{ fontSize: 13 }} />

          {images.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {Array.from(images).map((file, i) => (
                <img key={i} src={URL.createObjectURL(file)} alt="preview"
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
              ))}
            </div>
          )}

          {existingReview?.images?.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
              {existingReview.images.map((img, i) => (
                <img key={i} src={img.startsWith("http") ? img : `http://localhost:4000/${img}`} alt="existing"
                  style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid #e5e7eb" }} />
              ))}
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenReview(false)} sx={{ color: "rgba(0,0,0,0.5)" }}>Cancel</Button>
          <Button variant="contained" onClick={submitReview}
            sx={{ background: "#1a237e", borderRadius: "8px", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { background: "#283593" } }}>
            {existingReview ? "Update review" : "Submit review"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── EDIT ADDRESS MODAL ── */}
      <Dialog open={openAddressModal} onClose={() => setOpenAddressModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontSize: 16, fontWeight: 700, pb: 0 }}>Edit delivery address</DialogTitle>
        <DialogContent>
          <p style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginTop: 4, marginBottom: 16 }}>
            You can edit this address within 24 hours of placing your order.
          </p>
          <div className="mo-modal-row">
            <TextField label="First name" fullWidth value={addressData.firstName || ""} onChange={(e) => setAddressData({ ...addressData, firstName: e.target.value })} size="small" />
            <TextField label="Last name" fullWidth value={addressData.lastName || ""} onChange={(e) => setAddressData({ ...addressData, lastName: e.target.value })} size="small" />
          </div>
          <TextField className="mo-modal-field" label="Address line 1" fullWidth value={addressData.address1 || ""} onChange={(e) => setAddressData({ ...addressData, address1: e.target.value })} size="small" />
          <TextField className="mo-modal-field" label="Address line 2 (optional)" fullWidth value={addressData.address2 || ""} onChange={(e) => setAddressData({ ...addressData, address2: e.target.value })} size="small" />
          <div className="mo-modal-row">
            <TextField label="City" fullWidth value={addressData.city || ""} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })} size="small" />
            <TextField label="State" fullWidth value={addressData.state || ""} onChange={(e) => setAddressData({ ...addressData, state: e.target.value })} size="small" />
          </div>
          <div className="mo-modal-row">
            <TextField label="PIN / ZIP code" fullWidth value={addressData.zipCode || ""} onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })} size="small" />
            <TextField label="Country" fullWidth value={addressData.country || ""} onChange={(e) => setAddressData({ ...addressData, country: e.target.value })} size="small" />
          </div>
          <TextField label="Phone" fullWidth value={addressData.phone || ""} onChange={(e) => setAddressData({ ...addressData, phone: e.target.value })} size="small" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenAddressModal(false)} sx={{ color: "rgba(0,0,0,0.5)" }}>Cancel</Button>
          <Button variant="contained" onClick={updateAddress}
            sx={{ background: "#1a237e", borderRadius: "8px", textTransform: "none", fontWeight: 700, px: 3, "&:hover": { background: "#283593" } }}>
            Save address
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyOrders;