import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import QuantityBox from "../../Components/QuantityBox";
import { MdClose } from "react-icons/md";
import Button from "@mui/material/Button";
import { IoCartSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import { useContext, useEffect } from "react";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";

const Cart = () => {
  const context = useContext(MyContext);
  const user = JSON.parse(localStorage.getItem("user"));

  const total = context.cartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const totalItems = context.cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    fetchDataFromApi(`/api/cart/${user._id}`).then((res) => {
      context.setCartItems(res?.items || []);
    });
  }, []);

  const updateQty = async (productId, variant, action) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await editData("/api/cart/update", { userId: user._id, productId, variant, action });
    if (!res?.error) context.setCartItems(res.items);
  };

  const removeItem = async (productId, variant) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await deleteData("/api/cart/remove", { userId: user._id, productId, variant });
    if (!res?.error) context.setCartItems(res.items);
  };

  return (
    <section className="cartPage section">
      <div className="container">

        {/* Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <h2 className="hd mb-1">Shopping Cart</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            {totalItems > 0
              ? <>You have <strong style={{ color: "var(--primary)" }}>{totalItems}</strong> {totalItems === 1 ? "item" : "items"} in your cart</>
              : "Your cart is empty"}
          </p>
        </div>

        <div className="row">
          {/* Cart Table */}
          <div className="col-md-9 pr-5">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th width="38%">Product</th>
                    <th width="18%">Unit Price</th>
                    <th width="20%">Quantity</th>
                    <th width="14%">Subtotal</th>
                    <th width="10%"></th>
                  </tr>
                </thead>
                <tbody>
                  {context.cartItems.length === 0 ? (
                    <tr>
                      <td colSpan="5">
                        <div className="emptyState" style={{ padding: "48px 24px" }}>
                          <div className="emptyIcon">
                            <img
                              src="https://cdn-icons-png.flaticon.com/128/2038/2038854.png"
                              alt="empty cart"
                              style={{ width: "40px", opacity: 0.5 }}
                            />
                          </div>
                          <h5>Your cart is empty</h5>
                          <p>Looks like you haven't added anything yet.</p>
                          <Link to="/">
                            <Button className="btn-blue btn-sm">
                              Continue Shopping
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    context.cartItems.map((item) => (
                      <tr key={`${item.product?._id}-${item.variant}`}>
                        <td width="38%">
                          <div className="d-flex align-items-center cartItemimgWrapper" style={{ gap: "14px" }}>
                            <div className="imgWrapper">
                              <img src={item.product?.images?.[0]?.[0]} alt={item.product?.name} />
                            </div>
                            <div className="info">
                              <h6>{item.product?.name}</h6>
                              <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                                {item.variant || "Default"}
                              </p>
                              <Rating value={item.rating || 0} readOnly size="small" />
                            </div>
                          </div>
                        </td>

                        <td>
                          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)" }}>
                            ${item.price}
                          </span>
                        </td>

                        <td>
                          <QuantityBox
                            qty={item.quantity || 1}
                            onIncrease={() => updateQty(item.product._id, item.variant, "inc")}
                            onDecrease={() => updateQty(item.product._id, item.variant, "dec")}
                          />
                        </td>

                        <td>
                          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--primary)", fontSize: "15px" }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </td>

                        <td>
                          <span
                            className="remove"
                            onClick={() => removeItem(item.product._id, item.variant)}
                            title="Remove item"
                          >
                            <MdClose size={15} />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="col-md-3">
            <div className="cartdetails">
              <h4>Order Summary</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="d-flex align-items-center">
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Subtotal ({totalItems} items)</span>
                  <span className="ml-auto" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "14px" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Shipping</span>
                  <span className="ml-auto" style={{ fontSize: "13px", color: "var(--success)", fontWeight: 600 }}>
                    Free
                  </span>
                </div>

                <div className="d-flex align-items-center">
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Estimate For</span>
                  <span className="ml-auto" style={{ fontSize: "13px", fontWeight: 500 }}>🇬🇧 UK</span>
                </div>

                <div style={{
                  borderTop: "1px solid var(--border-light)",
                  paddingTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span style={{ fontWeight: 600, fontSize: "15px" }}>Total</span>
                  <span style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "var(--primary)"
                  }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {user && context.cartItems.length > 0 && (
                <Link to={`/checkOut/${user._id}`} style={{ display: "block", marginTop: "20px" }}>
                  <Button
                    className="btn-blue btn-red w-100"
                    style={{ gap: "8px", padding: "13px 24px !important" }}
                  >
                    <IoCartSharp size={18} />
                    Proceed to Checkout
                  </Button>
                </Link>
              )}

              <Link to="/" style={{ display: "block", marginTop: "10px" }}>
                <Button
                  variant="outlined"
                  className="w-100"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    textTransform: "none",
                    fontFamily: "var(--font-body)",
                    borderRadius: "var(--radius-md)",
                    padding: "10px"
                  }}
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;