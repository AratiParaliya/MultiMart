import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { editData, fetchDataFromApi } from "../../utils/api";
import { Button, Chip, Divider, CircularProgress, Alert, AlertTitle } from "@mui/material";
import {
  LocalShippingOutlined, CheckCircleRounded, Inventory2Outlined,
  HomeOutlined, CancelOutlined, CloudDownloadOutlined, ReplayRounded,
  LocationOnOutlined, AccessTimeOutlined
} from "@mui/icons-material";
import RelatedProducts from "../ProductDetails/RelatedProducts";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelNote, setCancelNote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getOrder();
    const interval = setInterval(getOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  const getOrder = async () => {
    const res = await fetchDataFromApi(`/api/orders/${id}`);
    if (res?.success) setOrder(res.order);
  };

  const normalizedStatus = order?.status?.toLowerCase();

  const steps = [
    { label: "Ordered", icon: <Inventory2Outlined fontSize="small" />, key: "ordered" },
    { label: "Shipped", icon: <LocalShippingOutlined fontSize="small" />, key: "shipped" },
    { label: "Out for Delivery", icon: <LocalShippingOutlined fontSize="small" />, key: "out for delivery" },
    { label: "Delivered", icon: <HomeOutlined fontSize="small" />, key: "delivered" },
  ];

  const getStepIndex = () => {
    const statusMap = { "ordered": 0, "pending": 0, "shipped": 1, "out for delivery": 2, "delivered": 3 };
    return statusMap[normalizedStatus] ?? 0;
  };

  const canCancelOrder = () => ["pending", "ordered", "processing"].includes(normalizedStatus);

  const getStatusDetails = () => {
    const statusMap = {
      "Ordered": { text: "Order confirmed & being prepared", icon: "📦", severity: "info", time: "Processing" },
      "Shipped": { text: "Your order is on its way", icon: "🚚", severity: "info", time: "In Transit" },
      "Out for Delivery": { text: "Your order arrives today!", icon: "🏠", severity: "warning", time: "By 9:00 PM" },
      "Delivered": { text: "Order delivered successfully", icon: "✅", severity: "success", time: "Completed" },
      "Cancelled": { text: "This order was cancelled", icon: "❌", severity: "error", time: "Refund Processed" },
    };
    return statusMap[order?.status] || { text: "Processing your order", icon: "⚙️", severity: "info", time: "" };
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) return;
    const res = await editData(`/api/orders/cancel/${order._id}`, { reason: cancelReason, note: cancelNote });
    if (res?.success) { setOpenCancel(false); getOrder(); }
    else alert(res?.msg || "Cancel failed");
  };

  const downloadInvoice = async () => {
    const element = document.getElementById("invoice");
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`invoice_${order._id}.pdf`);
  };

  if (!order) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <CircularProgress size={36} style={{ color: "var(--primary)" }} />
        <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-muted)" }}>Loading order details...</p>
      </div>
    </div>
  );

  const statusInfo = getStatusDetails();

  return (
    <div className="order-management-container py-5">
     <div className="orderPage">
  <div className="orderCard container">
      <div className="container">

        <div className="orderHeader mb-4">
        {/* HEADER */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "32px",
          paddingBottom: "24px",
          borderBottom: "1px solid var(--border)"
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Order Details</h2>
              <span style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "3px 10px",
                fontFamily: "var(--font-heading)",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "0.5px"
              }}>
                #{order._id?.slice(-8).toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Placed on {new Date(order.dateCreated).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <Button
              startIcon={<CloudDownloadOutlined />}
              variant="outlined"
              disabled={normalizedStatus === "cancelled"}
              onClick={downloadInvoice}
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                textTransform: "none",
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                borderRadius: "var(--radius-md)"
              }}
            >
              Invoice
            </Button>
            {normalizedStatus === "cancelled" && (
              <Button
                startIcon={<ReplayRounded />}
                variant="contained"
                style={{
                  background: "var(--success)",
                  textTransform: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  borderRadius: "var(--radius-md)"
                }}
                onClick={() => navigate(`/product/${order.orderItems[0].productId}`)}
              >
                Buy Again
              </Button>
            )}
            {canCancelOrder() && (
              <Button
                variant="contained"
                style={{
                  background: "var(--error)",
                  textTransform: "none",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  borderRadius: "var(--radius-md)"
                }}
                onClick={() => setOpenCancel(true)}
              >
                Cancel Order
              </Button>
            )}
          </div>
        </div>
</div>
        {/* ITEMS */}
        <div className="glass-card p-4 mb-4">
          <h6 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, marginBottom: "16px", fontSize: "14px" }}>
            Items Ordered ({order.orderItems.length})
          </h6>
          {order.orderItems.map((item, i) => (
            <div key={i} style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              paddingBottom: "16px",
              marginBottom: i < order.orderItems.length - 1 ? "16px" : 0,
              borderBottom: i < order.orderItems.length - 1 ? "1px solid var(--border-light)" : "none"
            }}>
              <img
                src={item.image}
                width={64} height={64}
                style={{ borderRadius: "var(--radius-md)", objectFit: "cover", border: "1px solid var(--border)" }}
                alt={item.name}
              />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: "14px", margin: "0 0 3px", color: "var(--text-primary)" }}>{item.name}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
                  Qty: {item.quantity} · ₹{item.price} each
                </p>
              </div>
              <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "15px", color: "var(--primary)" }}>
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-8">

            {/* STATUS ALERT */}
            <div className="glass-card mb-4" style={{ overflow: "hidden" }}>
              <div style={{
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: normalizedStatus === "delivered" ? "var(--success-bg)"
                  : normalizedStatus === "cancelled" ? "var(--error-bg)"
                  : "var(--info-bg)",
                borderBottom: "1px solid var(--border-light)"
              }}>
                <span style={{ fontSize: "28px" }}>{statusInfo.icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "15px", margin: "0 0 2px", color: "var(--text-primary)" }}>
                    {statusInfo.text}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>{statusInfo.time}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{
                    padding: "5px 14px",
                    borderRadius: "var(--radius-full)",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "var(--font-heading)",
                    background: "var(--primary)",
                    color: "var(--white)"
                  }}>
                    {order.status}
                      </span>
                      
                    </div>
                    {order.status === "Cancelled" && order.isPaid && (
  <div style={{
    marginTop: "12px",
    padding: "10px",
    background: "#fff3cd",
    border: "1px solid #ffeeba",
    borderRadius: "8px"
  }}>
    <p style={{ margin: 0, fontSize: "13px", fontWeight: 600 }}>
      💰 Refund Amount: ₹{order.refundDetails?.amount}
    </p>
    <p style={{ margin: 0, fontSize: "12px", color: "#856404" }}>
      Status: {order.refundDetails?.status}
    </p>
  </div>
)}
              </div>
            </div>

            {/* STEP TRACKER */}
            <div className="glass-card p-4 mb-4">
              <h6 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, marginBottom: "24px", fontSize: "14px" }}>
                Order Progress
              </h6>
              <div className="stepper-horizontal">
                {steps.map((step, idx) => {
                  const isCompleted = idx <= getStepIndex() && normalizedStatus !== "cancelled";
                  const isCurrent = idx === getStepIndex() && normalizedStatus !== "cancelled";
                  return (
                    <div key={idx} className={`step-node ${isCompleted ? 'active' : ''} ${isCurrent ? 'pulse' : ''}`}>
                      <div className="node-icon">
                        {normalizedStatus === "cancelled"
                          ? <CancelOutlined fontSize="small" />
                          : isCompleted && idx < getStepIndex()
                          ? <CheckCircleRounded fontSize="small" />
                          : step.icon}
                      </div>
                      <span className="node-label">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* TIMELINE */}
            <div className="glass-card p-4 mb-4">
              <h6 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                marginBottom: "20px",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <AccessTimeOutlined fontSize="small" style={{ color: "var(--primary)" }} />
                Shipment History
              </h6>
              <div className="vertical-timeline">
                {steps.map((step, idx) => {
                  if (idx > getStepIndex() || normalizedStatus === "cancelled") return null;
                  return (
                    <div key={idx} className="timeline-item completed">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <p className="fw-bold">{step.label}</p>
                        <p className="extra-small">{new Date(order.dateCreated).toLocaleDateString("en-IN")} — Update confirmed</p>
                      </div>
                    </div>
                  );
                })}
                {normalizedStatus === "cancelled" && (
                  <div className="timeline-item error">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <p className="fw-bold" style={{ color: "var(--error)" }}>Order Cancelled</p>
                      <p className="extra-small">Cancellation request processed</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="col-lg-4">
            {/* Address */}
            <div className="glass-card p-4 mb-4">
              <h6 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                marginBottom: "14px",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "var(--text-muted)"
              }}>
                <LocationOnOutlined fontSize="small" /> Delivery Address
              </h6>
              <div style={{
                padding: "14px",
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)"
              }}>
                <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "4px" }}>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 2px" }}>
                  {order.shippingAddress.address1}, {order.shippingAddress.city}
                </p>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
                  📞 {order.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="glass-card p-4">
              <h6 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                marginBottom: "16px",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.6px",
                color: "var(--text-muted)"
              }}>
                Payment Summary
              </h6>

              {[
                { label: "Items Subtotal", value: `₹${order.itemsPrice}` },
                { label: "Shipping", value: "FREE", valueStyle: { color: "var(--success)", fontWeight: 600 } },
              ].map(({ label, value, valueStyle }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>
                  <span style={{ fontSize: "13px", ...valueStyle }}>{value}</span>
                </div>
              ))}

              <Divider style={{ borderColor: "var(--border-light)", margin: "14px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "14px" }}>Total Paid</span>
                <span style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "var(--primary)"
                }}>
                  ₹{order.totalPrice}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED */}
        <div style={{ marginTop: "48px" }}>
          <h5 style={{ fontWeight: 700, marginBottom: "24px", fontFamily: "var(--font-heading)" }}>
            Recently View product
          </h5>
          <RelatedProducts type="recent" />
        </div>
      </div>
</div>
        </div>
      
      {/* CANCEL MODAL */}
      {openCancel && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(26,31,60,0.55)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "var(--white)",
            borderRadius: "var(--radius-xl)",
            padding: "32px",
            maxWidth: "440px",
            width: "100%",
            boxShadow: "var(--shadow-xl)",
            border: "1px solid var(--border)"
          }}>
            <h5 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "20px" }}>
              Cancel Order
            </h5>

            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Please let us know why you're cancelling this order.
            </p>

            <select
              className="form-select mb-3"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", marginBottom: "12px" }}
            >
              <option value="">Select a reason</option>
              <option>Ordered by mistake</option>
              <option>Found cheaper elsewhere</option>
              <option>Delivery is too late</option>
              <option>Other</option>
            </select>

            <textarea
              className="form-control mb-3"
              placeholder="Additional notes (optional)..."
              value={cancelNote}
              onChange={(e) => setCancelNote(e.target.value)}
              rows={3}
              style={{ width: "100%", marginBottom: "20px" }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button
                onClick={() => setOpenCancel(false)}
                style={{
                  color: "var(--text-secondary)",
                  textTransform: "none",
                  fontFamily: "var(--font-body)"
                }}
              >
                Keep Order
              </Button>
              <Button
                onClick={handleCancelSubmit}
                variant="contained"
                disabled={!cancelReason}
                style={{
                  background: "var(--error)",
                  textTransform: "none",
                  fontFamily: "var(--font-body)",
                  borderRadius: "var(--radius-md)"
                }}
              >
                Cancel Order
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN INVOICE */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <div id="invoice" style={{ width: "800px", padding: "50px", background: "#fff", fontFamily: "'Sora', sans-serif", color: "#1a1f3c" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "40px" }}>
            <div>
              <h1 style={{ margin: 0, color: "#1a1f3c", fontSize: "28px", fontWeight: "700" }}>MaltiMart</h1>
              <p style={{ color: "#9094ab", fontSize: "13px", marginTop: "4px" }}>www.maltimart.com</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>INVOICE</h2>
              <p style={{ margin: 0, color: "#9094ab", fontFamily: "monospace" }}>#{order._id?.toUpperCase().slice(-8)}</p>
            </div>
          </div>
          <hr style={{ border: "0", borderTop: "1.5px solid #eceae5", marginBottom: "30px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
            <div>
              <p style={{ fontSize: "11px", color: "#9094ab", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Billed To</p>
              <p style={{ margin: "0 0 4px", fontWeight: "700" }}>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p style={{ margin: "0", fontSize: "13px", color: "#5a5e7a" }}>{order.shippingAddress.address1}, {order.shippingAddress.city}</p>
              <p style={{ margin: "0", fontSize: "13px", color: "#5a5e7a" }}>{order.shippingAddress.phone}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "11px", color: "#9094ab", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Order Details</p>
              <p style={{ margin: "0 0 3px", fontSize: "13px" }}><strong>Date:</strong> {new Date(order.dateCreated).toLocaleDateString()}</p>
              <p style={{ margin: "0 0 3px", fontSize: "13px" }}><strong>Payment:</strong> {order.paymentMethod || "Online"}</p>
              <p style={{ margin: "0", fontSize: "13px" }}><strong>Status:</strong> {order.status}</p>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px" }}>
            <thead>
              <tr style={{ background: "#f4f3f0" }}>
                {["Description", "Qty", "Price", "Amount"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "Description" ? "left" : "right", fontSize: "12px", borderBottom: "2px solid #e0ded8", textTransform: "uppercase", letterSpacing: "0.5px", color: "#9094ab" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: "14px 16px", fontSize: "13px", borderBottom: "1px solid #eceae5" }}><strong>{item.name}</strong></td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", borderBottom: "1px solid #eceae5" }}>{item.quantity}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", borderBottom: "1px solid #eceae5" }}>₹{item.price}</td>
                  <td style={{ padding: "14px 16px", textAlign: "right", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #eceae5" }}>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "260px" }}>
              {[["Subtotal", `₹${order.itemsPrice}`], ["Shipping", "FREE"], ["Tax (GST)", `₹${(order.totalPrice * 0.12).toFixed(0)}`]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ color: "#9094ab", fontSize: "13px" }}>{l}</span>
                  <span style={{ fontSize: "13px", color: l === "Shipping" ? "#1a7a4a" : "#1a1f3c" }}>{v}</span>
                </div>
              ))}
              <div style={{ background: "#1a1f3c", color: "#fff", padding: "16px", borderRadius: "10px", display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                <span style={{ fontWeight: "600" }}>Total Amount</span>
                <span style={{ fontSize: "18px", fontWeight: "800" }}>₹{order.totalPrice}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: "60px", textAlign: "center", borderTop: "1px solid #eceae5", paddingTop: "20px" }}>
            <p style={{ margin: "0 0 4px", color: "#9094ab", fontSize: "12px" }}>Thank you for shopping with MaltiMart!</p>
            <p style={{ margin: "0", color: "#9094ab", fontSize: "12px" }}>support@maltimart.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;