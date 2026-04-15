import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import QRCode from "qrcode";
const OrderDetails = () => {

  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder();
  }, []);

    
    const navigate = useNavigate();
const [qrCode, setQrCode] = useState("");

useEffect(() => {
  if (order && order.paymentMethod === "COD") {
    generateQR();
  }
}, [order]);

const generateQR = async () => {
  const qrData = `
  Pay ₹${order.totalPrice}
  Order: ${order._id}
  Name: ${order.userId?.name}
  `;

  const url = await QRCode.toDataURL(qrData);
  setQrCode(url);
};

const downloadInvoice = async () => {
  const element = document.getElementById("invoice");

  await waitForImages(); // ✅ IMPORTANT

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(`invoice_${order._id}.pdf`);
  };
  
    const waitForImages = async () => {
  const images = document.querySelectorAll("#invoice img");

  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();

    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  await Promise.all(promises);
};
  const getOrder = async () => {
      const res = await fetchDataFromApi(`/api/orders/${id}`);
    
    if (res?.success) {
      setOrder(res.order);
    }
  };

  if (!order) {
    return <h5 className="text-center mt-5">Loading...</h5>;
  }

    return (
        <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4">
                <h5 className="mb-0">Order Detail</h5>
                </div>
                 <div className="card shadow border-0 p-3 mt-4 w-100">
    <section className="container mt-4">

      {/* HEADER */}
      <div className="card shadow p-4 mb-4">
        <h4>Order Details</h4>
        <p className="text-muted">
          Order ID: #{order._id}
        </p>

        <div className="d-flex justify-content-between flex-wrap">
          <div>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.dateCreated).toLocaleString()}</p>
          </div>

          <div>
            <p><strong>Payment:</strong> {order.isPaid ? "Paid ✅" : "Pending ❌"}</p>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* USER + ADDRESS */}
      <div className="row">

        {/* USER */}
        <div className="col-md-6">
          <div className="card shadow p-3 mb-4">
            <h5>User Info</h5>
            <p><strong>Name:</strong> {order.userId?.name}</p>
            <p><strong>Email:</strong> {order.userId?.email}</p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="col-md-6">
          <div className="card shadow p-3 mb-4">
            <h5>Shipping Address</h5>
            <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
            <p>{order.shippingAddress?.address1}</p>
            <p>{order.shippingAddress?.address2}</p>
            <p>
              {order.shippingAddress?.city}, {order.shippingAddress?.state}
            </p>
            <p>
              {order.shippingAddress?.country} - {order.shippingAddress?.zipCode}
            </p>
            <p>📞 {order.shippingAddress?.phone}</p>
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="card shadow p-4 mb-4">
        <h5>Order Items</h5>

        {order.orderItems.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center border-bottom py-3"
          >
            <img
              src={item.image}
              alt="product"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />

            <div className="ml-3 flex-grow-1">
              <h6>{item.name}</h6>
              <p>Qty: {item.quantity}</p>
            </div>

            <div>
              <h6>₹{item.price}</h6>
            </div>
          </div>
        ))}
      </div>

      {/* PRICE SUMMARY */}
      <div className="card shadow p-4 mb-4">
        <h5>Price Details</h5>

        <div className="d-flex justify-content-between">
          <span>Items Price</span>
          <span>₹{order.itemsPrice}</span>
        </div>

        <div className="d-flex justify-content-between">
          <span>Shipping</span>
          <span>₹{order.shippingPrice}</span>
        </div>

        <hr />

        <div className="d-flex justify-content-between">
          <strong>Total</strong>
          <strong>₹{order.totalPrice}</strong>
        </div>
      </div>

      {/* TRACKING */}
      <div className="card shadow p-4 mb-4">
        <h5>Order Tracking</h5>

        {order.trackingHistory?.length > 0 ? (
          order.trackingHistory.map((track, i) => (
            <div key={i} className="d-flex justify-content-between border-bottom py-2">
              <span>{track.status}</span>
              <span>{new Date(track.date).toLocaleString()}</span>
            </div>
          ))
        ) : (
          <p>No tracking available</p>
        )}
      </div>

      {/* CANCEL INFO */}
      {order.status === "Cancelled" && (
        <div className="card shadow p-4 mb-4 bg-light">
          <h5>Cancellation Details</h5>
          <p><strong>Reason:</strong> {order.cancelDetails?.reason}</p>
          <p><strong>Note:</strong> {order.cancelDetails?.note}</p>
        </div>
      )}

      {/* ACTIONS */}
      <div className="text-end">
      <Button
  variant="contained"
  color="primary"
  className="mr-2"
  onClick={downloadInvoice}
>
  Download Invoice
</Button>

                        <Button onClick={() => navigate("/orders")} variant="outlined" color="error" >
       Back
        </Button>
      </div>

            </section>
            </div>
     <div id="invoice" className="invoice-container">

  {/* HEADER */}
  <div className="invoice-header">
    <div className="logo-section">
      <img src="/logo.png" alt="logo" />
      <h2>MaltiMart</h2>
    </div>
    <div className="invoice-title">INVOICE</div>
  </div>

  {/* INFO */}
  <div className="invoice-info">
    <div>
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Date:</b> {new Date(order.dateCreated).toLocaleDateString()}</p>
    </div>

    <div>
      <p><b>Status:</b> {order.status}</p>
      <p><b>Payment:</b> {order.paymentMethod}</p>
    </div>
  </div>

  {/* CUSTOMER */}
  <div className="invoice-customer">
    <h4>Billing To:</h4>
    <p>{order.userId?.name}</p>
    <p>{order.userId?.email}</p>
    <p>{order.shippingAddress?.address1}</p>
    <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
  </div>

  {/* TABLE */}
  <table className="invoice-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Product</th>
        <th>Image</th>
        <th>Price</th>
        <th>Qty</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {order.orderItems.map((item, i) => (
        <tr key={i}>
          <td>{i + 1}</td>
          <td>{item.name}</td>
          <td>
            <img src={item.image} width="40" />
          </td>
          <td>₹{item.price}</td>
          <td>{item.quantity}</td>
          <td>₹{item.price * item.quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* TOTAL SECTION */}
  <div className="invoice-bottom">

    {/* PRICE */}
    <div className="invoice-total">
      <p>Items: ₹{order.itemsPrice}</p>
      <p>Shipping: ₹{order.shippingPrice}</p>

      {/* GST */}
      <p>GST (18%): ₹{Math.round(order.totalPrice * 0.18)}</p>

      {/* DISCOUNT */}
      <p>Discount: ₹100</p>

      <h3>Total: ₹{order.totalPrice}</h3>
    </div>

    {/* QR CODE (ONLY COD) */}
    {order.paymentMethod === "COD" && qrCode && (
      <div className="qr-section">
        <p>Scan to Pay</p>
        <img src={qrCode} width="120" />
      </div>
    )}
  </div>

  {/* FOOTER */}
  <div className="invoice-footer">
    <p>Authorized Signature</p>
  </div>

</div>
        </div>
        
  );
};

export default OrderDetails;