import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
 import { MenuItem, Select, Card, CardContent, Typography } from "@mui/material";
const UpdateOrder = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:4000/api/orders/${id}`)
      .then(res => res.json())
    .then(data => {
  if (!data.order) return;

  setOrder(data.order);
  setStatus(data.order.status || "Pending");
  setIsPaid(data.order.isPaid || false);
});
  }, [id]);

  const updateStatus = async () => {
    const res = await fetch(`http://localhost:4000/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, isPaid })
    });

    const data = await res.json();

    if (data.success) {
      alert("Order Updated ✅");
    } else {
      alert("Update Failed ❌");
    }
  };

  if (!order) return <h3>Loading...</h3>;


return (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "#f5f5f5"
    }}
  >
    <Card style={{ width: "400px", padding: "20px", textAlign: "center" }}>
      <CardContent>

        <Typography variant="h5" gutterBottom>
          Update Order Status
        </Typography>

        <Typography variant="body1">
          <b>Order:</b> {order._id}
        </Typography>

        <Typography variant="body1" gutterBottom>
          <b>User:</b> {order.userId?.name}
        </Typography>

        {/* STATUS DROPDOWN */}
        <Select
          fullWidth
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginTop: "20px" }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Ordered">Ordered</MenuItem>
          <MenuItem value="Processing">Processing</MenuItem>
          <MenuItem value="Shipped">Shipped</MenuItem>
          <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
          <MenuItem value="Delivered">Delivered</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>

        {/* PAYMENT DROPDOWN */}
        <Select
          fullWidth
          value={isPaid ? "Paid" : "Pending"}
          onChange={(e) => setIsPaid(e.target.value === "Paid")}
          style={{ marginTop: "20px" }}
        >
          <MenuItem value="Paid">Paid</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
        </Select>

        {/* BUTTON */}
        <button
          onClick={updateStatus}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Update Status
        </button>

      </CardContent>
    </Card>
  </div>
);
};

export default UpdateOrder;