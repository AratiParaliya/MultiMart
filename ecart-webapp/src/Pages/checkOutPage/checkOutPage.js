import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../App";
import { deleteData } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const CheckOut = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState("standard");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    country: "India",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "UPI",
    orderNotes: "",
  });

  /* ─── data fetching ─── */
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: formData.country }),
    })
      .then((r) => r.json())
      .then((d) => setStates(d.data?.states || []));
  }, [formData.country]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;
    fetch(`http://localhost:4000/api/cart/${user._id}`)
      .then((r) => r.json())
      .then((d) => setCartData(d.items || d.cartItems || d || []));
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;
    fetch(`http://localhost:4000/api/user/${user._id}`)
      .then((r) => r.json())
      .then((d) => {
        const u = d.user || d;
        if (u)
          setFormData((p) => ({
            ...p,
            firstName: u.firstName || u.name || "",
            lastName: u.lastName || "",
            phone: u.phone || "",
            email: u.email || "",
            address1: u.address1 || "",
            address2: u.address2 || "",
            city: u.city || "",
            state: u.state || "",
            zipCode: u.zipCode || "",
            country: u.country || "India",
          }));
      });
  }, []);

  /* ─── calculations ─── */
  const subtotal = cartData.reduce(
    (s, i) => s + i.price * (i.quantity || 1),
    0
  );
  const shippingCost = selectedShipping === "standard" ? 50 : 0;
  const totalAmount = subtotal + shippingCost;

  /* ─── helpers ─── */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const alert = (msg, error = true) =>
    context.setAlertBox({ open: true, error, msg });

const validateForm = () => {
  const { firstName, lastName, email, phone, address1, city, state, zipCode, country } = formData;

  if (!String(firstName).trim()) return alert("First name is required"), false;
  if (!String(lastName).trim()) return alert("Last name is required"), false;
  if (!String(email).trim()) return alert("Email is required"), false;
  if (!String(phone).trim()) return alert("Phone number is required"), false;
  if (!String(address1).trim()) return alert("Address is required"), false;
  if (!String(city).trim()) return alert("City is required"), false;
  if (!String(state).trim()) return alert("State is required"), false;
  if (!String(zipCode).trim()) return alert("ZIP Code is required"), false;
  if (!String(country).trim()) return alert("Country is required"), false;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))
    return alert("Invalid email format"), false;

  if (!/^[0-9]{10}$/.test(String(phone)))
    return alert("Phone must be 10 digits"), false;

  if (!/^[0-9]{6}$/.test(String(zipCode)))
    return alert("ZIP Code must be 6 digits"), false;

  if (!agree) return alert("Please accept terms & conditions"), false;

  return true;
};

  const clearCart = async (userId) => {
    try {
      await deleteData(`/api/cart/clear/${userId}`);
      context.setCartItems([]);
    } catch (e) { console.log(e); }
  };

  const createReceipt = async (payload) => {
    try {
      await fetch("http://localhost:4000/api/receipts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.log(e); }
  };

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return alert("Please login first");
    if (!validateForm()) return;
    if (cartData.length === 0) return alert("Cart is empty");

    const orderItems = cartData.map((i) => ({
      productId: i.product?._id,
      name: i.product?.name,
      quantity: i.quantity || 1,
      price: i.price,
      image: i.product?.images?.[0]?.[0] || "",
    }));
    const total = subtotal;
    const checkoutData = { ...formData };

    try {
      if (formData.paymentMethod === "UPI") {
        const res = await fetch("http://localhost:4000/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total + shippingCost, userId: user._id }),
        });
        const data = await res.json();
        if (!data.success) return alert("Payment init failed");

        const options = {
          key: "rzp_test_SVXTx4nc4AWLH2",
          amount: data.amount,
          currency: "INR",
          name: "Your Store",
          description: "Order Payment",
          order_id: data.orderId,
          handler: async (response) => {
            const paymentId = data.paymentId;
            const verifyRes = await fetch("http://localhost:4000/api/payment/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                paymentId,
              }),
            });
            const verifyResult = await verifyRes.json();
            if (!verifyResult.success) return alert("Payment verification failed");

            const orderRes = await fetch("http://localhost:4000/api/orders/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userId: user._id, orderItems, shippingAddress: checkoutData,
                paymentMethod: "UPI", itemsPrice: total,
                shippingPrice: shippingCost, totalPrice: total + shippingCost,
                paymentId, isPaid: true, status: "Paid",
              }),
            });
            const orderResult = await orderRes.json();
            if (orderResult.success) {
              alert("Payment successful & order placed!", false);
              await createReceipt({ userId: user._id, orderId: orderResult.order._id, paymentId, items: orderItems, billingDetails: checkoutData, paymentMethod: "UPI", amountPaid: total + shippingCost });
              navigate(`/myOrders/${user._id}`);
              await clearCart(user._id);
            } else { alert("Order save failed"); }
          },
        };
        new window.Razorpay(options).open();
      } else {
        const orderRes = await fetch("http://localhost:4000/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user._id, orderItems, shippingAddress: checkoutData,
            paymentMethod: formData.paymentMethod, itemsPrice: total,
            shippingPrice: shippingCost, totalPrice: total + shippingCost,
          }),
        });
        const data = await orderRes.json();
        if (data.success) {
          alert("Order placed successfully!", false);
          await createReceipt({ userId: user._id, orderId: data.order._id, paymentId: null, items: orderItems, billingDetails: checkoutData, paymentMethod: formData.paymentMethod, amountPaid: total + shippingCost });
          navigate(`/myOrders/${user._id}`);
          await clearCart(user._id);
        } else { alert("Order failed"); }
      }
    } catch (e) {
      console.log(e);
      alert("Something went wrong");
    }
  };

  /* ─── render ─── */
  return (
    <>
      

      <div className="co-page">
        {/* ── STEPS ── */}
        <div className="co-steps">
          <div className="co-step done">
            <div className="co-step-dot">✓</div>
            <span>Cart</span>
          </div>
          <div className="co-step-line" />
          <div className="co-step active">
            <div className="co-step-dot">2</div>
            <span>Checkout</span>
          </div>
          <div className="co-step-line" />
          <div className="co-step">
            <div className="co-step-dot">3</div>
            <span>Confirmation</span>
          </div>
        </div>

        <div className="co-grid">
          {/* ── LEFT: BILLING FORM ── */}
          <div>
            {/* Contact */}
            <div className="co-card">
              <div className="co-card-title">
                <span className="title-icon">👤</span>
                Contact information
              </div>
              <div className="co-field-row">
                <div className="co-field">
                  <label>First name<span className="req">*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
                </div>
                <div className="co-field">
                  <label>Last name<span className="req">*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
              </div>
              <div className="co-field">
                <label>Company name <span style={{ color: "rgba(0,0,0,0.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Acme Inc." />
              </div>
              <div className="co-field-row">
                <div className="co-field">
                  <label>Phone<span className="req">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={10} placeholder="10-digit number" />
                </div>
                <div className="co-field">
                  <label>Email<span className="req">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className="co-card">
              <div className="co-card-title">
                <span className="title-icon">📦</span>
                Shipping address
              </div>

              <div className="co-field">
                <label>Country / Region<span className="req">*</span></label>
                <select name="country" value={formData.country} onChange={handleChange}>
                  {context.countryList?.length > 0
                    ? context.countryList.map((item, i) => (
                        <option key={i} value={item.country}>{item.country}</option>
                      ))
                    : <option value="India">India</option>}
                </select>
              </div>

              <div className="co-field">
                <label>Street address<span className="req">*</span></label>
                <input type="text" name="address1" value={formData.address1} onChange={handleChange} placeholder="House number and street name" />
                <input type="text" name="address2" value={formData.address2} onChange={handleChange} placeholder="Apartment, suite, unit (optional)" />
              </div>

              <div className="co-field-row">
                <div className="co-field">
                  <label>Town / City<span className="req">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Mumbai" />
                </div>
                <div className="co-field">
                  <label>State<span className="req">*</span></label>
                  <select name="state" value={formData.state} onChange={handleChange}>
                    <option value="">Select state</option>
                    {states.map((s, i) => <option key={i} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="co-field" style={{ maxWidth: 160 }}>
                <label>PIN / ZIP code<span className="req">*</span></label>
                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} maxLength={6} placeholder="400001" />
              </div>

              <div className="co-sep"><span>Additional options</span></div>

              <div className="co-check">
                <input type="checkbox" id="diff-addr" />
                <label htmlFor="diff-addr">Ship to a different address</label>
              </div>
              <div className="co-check">
                <input type="checkbox" id="create-acc" />
                <label htmlFor="create-acc">Create an account for faster checkout</label>
              </div>

              <div className="co-field" style={{ marginTop: 14 }}>
                <label>Order notes <span style={{ color: "rgba(0,0,0,0.3)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <textarea name="orderNotes" value={formData.orderNotes} onChange={handleChange} placeholder="Special delivery instructions…" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div>
            <div className="co-summary">
              <div className="co-sum-header">
                <h2>Order summary</h2>
                <span>{cartData.length} item{cartData.length !== 1 ? "s" : ""}</span>
              </div>

              {/* items */}
              <div className="co-items">
                {cartData.length > 0 ? cartData.map((item, i) => (
                  <div className="co-item" key={i}>
                    <div className="co-item-left">
                      <div className="co-item-thumb">
                        {item.product?.images?.[0]?.[0]
                          ? <img src={item.product.images[0][0]} alt={item.product?.name} />
                          : <span style={{ fontSize: 18 }}>🛒</span>}
                      </div>
                      <div>
                        <div className="co-item-name">{item.product?.name}</div>
                        <div className="co-item-qty">× {item.quantity || 1}</div>
                      </div>
                    </div>
                    <div className="co-item-price">₹{(item.price * (item.quantity || 1)).toLocaleString()}</div>
                  </div>
                )) : (
                  <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", textAlign: "center", padding: "16px 0" }}>Your cart is empty</p>
                )}
              </div>

              {/* shipping */}
              <div className="co-shipping">
                <p className="co-section-label">Shipping method</p>
                <div
                  className={`co-ship-opt ${selectedShipping === "standard" ? "selected" : ""}`}
                  onClick={() => setSelectedShipping("standard")}
                >
                  <input type="radio" name="ship" readOnly checked={selectedShipping === "standard"} />
                  <span className="co-ship-opt-name">Standard delivery</span>
                  <span className="co-ship-opt-price">₹50</span>
                </div>
                <div
                  className={`co-ship-opt ${selectedShipping === "pickup" ? "selected" : ""}`}
                  onClick={() => setSelectedShipping("pickup")}
                >
                  <input type="radio" name="ship" readOnly checked={selectedShipping === "pickup"} />
                  <span className="co-ship-opt-name">Local pickup</span>
                  <span className="co-ship-opt-price" style={{ color: "#2e7d32" }}>Free</span>
                </div>
              </div>

              {/* totals */}
              <div className="co-totals">
                <div className="co-total-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="co-total-row">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span style={{ color: "#2e7d32", fontWeight: 600 }}>Free</span> : `₹${shippingCost}`}</span>
                </div>
                <div className="co-total-row grand">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* payment */}
              <div className="co-payment">
                <p className="co-section-label">Payment method</p>
                {[
                  { value: "UPI", label: "UPI / Razorpay", desc: "PhonePe, GPay, Paytm & more", bg: "#e8eaf6", color: "#1a237e", abbr: "UPI" },
                  { value: "checkPayment", label: "Cheque payment", desc: "Offline bank transfer", bg: "#e8f5e9", color: "#1b5e20", abbr: "CHQ" },
                  { value: "COD", label: "Cash on delivery", desc: "Pay when your order arrives", bg: "#fff3e0", color: "#e65100", abbr: "COD" },
                ].map((p) => (
                  <div
                    key={p.value}
                    className={`co-pay-opt ${formData.paymentMethod === p.value ? "selected" : ""}`}
                    onClick={() => setFormData({ ...formData, paymentMethod: p.value })}
                  >
                    <input type="radio" name="paymentMethod" readOnly checked={formData.paymentMethod === p.value} />
                    <div className="co-pay-icon" style={{ background: p.bg, color: p.color }}>{p.abbr}</div>
                    <div>
                      <div className="co-pay-name">{p.label}</div>
                      <div className="co-pay-desc">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="co-cta">
                <div className="co-terms">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <label htmlFor="agree">
                    I agree to the <a href="#">terms &amp; conditions</a> and <a href="#">privacy policy</a>
                  </label>
                </div>

                <button className="co-place-btn" onClick={placeOrder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                  </svg>
                  Place order — ₹{totalAmount.toLocaleString()}
                </button>

                <div className="co-secure">
                  <svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <rect x="1" y="5" width="10" height="8" rx="2"/><path d="M4 5V3.5a2 2 0 014 0V5"/>
                  </svg>
                  SSL secured — safe &amp; encrypted checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOut;