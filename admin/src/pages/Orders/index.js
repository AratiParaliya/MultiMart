import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MdOutlineModeEdit } from "react-icons/md";
import DashboardBox from "../Dashboard/components/dashboardBox";

import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { useContext, useEffect} from "react";
import { fetchDataFromApi, deleteData, editData, editData1 } from "../../utils/api";
import { MyContext } from "../../App";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
            : theme.palette.grey[800];
    
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,

    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },

    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});
    
 
const Orders = () => {
    
  
      const context = useContext(MyContext);
const [openDialog, setOpenDialog] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
const [status, setStatus] = useState("");
const [isPaid, setIsPaid] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalOrders, setTotalOrders] = useState(0); 
const [totalRevenue, setTotalRevenue] = useState(0);
const { searchQuery } = useContext(SearchContext);

  const navigate = useNavigate();


  
const filteredData = orderData?.filter((order) => {
  const query = searchQuery.toLowerCase();

  return (
    order._id?.toLowerCase().includes(query) ||
    order.userId?.name?.toLowerCase().includes(query) ||
    order.userId?.email?.toLowerCase().includes(query) ||
    order.paymentMethod?.toLowerCase().includes(query) ||
    order.status?.toLowerCase().includes(query) ||
    order.orderItems?.some(item =>
      item.name?.toLowerCase().includes(query)
    )
  );
});
  
  const dataToShow = searchQuery ? filteredData : orderData;
  
const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-success";
    case "Cancelled": return "bg-danger";
    case "Processing": return "bg-info";
    case "Shipped": return "bg-primary";
    default: return "bg-warning";
  }
};

  const handleEditOrder = (order) => {
  setSelectedOrder(order);
  setStatus(order.status);
  setIsPaid(order.isPaid);
  setOpenDialog(true);
  };
  
  

const updateOrder = async () => {
  try {
    // ✅ FRONTEND VALIDATION (simple)
    if (!status) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please select status",
      });
      return;
    }

    // ✅ CALL API USING editData
    const res = await editData1(
      `/api/orders/${selectedOrder._id}`,
      { status, isPaid }
    );

    
    console.log("UPDATE RES:", res);

    if (!res.success) {
      throw new Error(res.msg || "Update failed");
    }

    // ✅ UPDATE UI
    setOrderData((prev) =>
      prev.map((item) =>
        item._id === selectedOrder._id
          ? { ...item, status, isPaid }
          : item
      )
    );

    setOpenDialog(false);

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Order updated successfully",
    });

  } catch (err) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: err.message,
    });
  }
  };
  

useEffect(() => {
  fetchOrders(1);
}, []);

 const fetchOrders = (pageNo = 1) => {
  context.setProgress(40);

  fetchDataFromApi(`/api/orders?page=${pageNo}&limit=10`)
    .then((res) => {
      setOrderData(res.orders || []);
      setTotalPages(res.totalPages || 1);
      setPage(res.page || 1);
      setTotalOrders(res.totalOrders || 0);

      setTotalRevenue(res.totalRevenue || 0); // ✅ FIX HERE

      context.setProgress(100);
    })
    .catch(() => context.setProgress(100));
};
  
  const handleChange = (event, value) => {
  setPage(value);
  fetchOrders(value);
};
  
const deleteOrder = (id) => {
  deleteData(`/api/orders/${id}`).then(() => {

    // ✅ remove deleted item instantly
    setOrderData((prev) => prev.filter(order => order._id !== id));

    context.setAlertBox({
      open: true,
      error: false,
      msg: "Order deleted successfully",
    });

  }).catch(() => {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Failed to delete order",
    });
  });
};

    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Orders List</h5>

  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Orders"
      deleteIcon={<ExpandMoreIcon />}
    />

  </Breadcrumbs>
                </div>
<div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
  <div className="col-md-12">
    <div className="dashboardBoxWrapper d-flex">

<DashboardBox
  color={["#1da256", "#48d483"]}
  icon={<FaUserCircle />}
  title="Total Orders"
  value={totalOrders}   
/>

<DashboardBox
  color={["#c012e2", "#eb64fe"]}
  icon={<IoMdCart />}
  title="Total Revenue"
  value={`₹${totalRevenue}`}
/>
    

    </div>
  </div>
                </div>

              <div className="card shadow border-0 p-3 mt-4 w-100">

  <div className="table-responsive mt-3" style={{ overflowX: "auto" }}>
    
    <table 
      className="table table-striped table-bordered v-align"
      style={{ minWidth: "1300px" }}
    >
          <thead className="thead-dark">
            <tr>
              <th>#</th>
             <th>Order ID</th>
<th>User</th>
<th>Email</th>
<th style={{width:"200px"}}>Items</th>

<th>Total</th>
<th style={{width:"180px"}}>Payment Method and Status</th>
                    <th>Address</th>

<th>Status</th>
                    <th style={{width:"100px"}}>Cancel Reason </th>                                    
<th>Date</th>
<th>Action</th>
            </tr>
          </thead>

          <tbody>
            {dataToShow?.length > 0 ? (
    dataToShow.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
<td>{order._id.slice(-6).toUpperCase()}</td>
                  {/* USER */}
                  <td>{order.userId?.name || "User"}</td>
                  <td>{order.userId?.email}</td>
                     <td>
                    {order.orderItems.map((item, i) => (
                      <div key={i}>
                        {item.name} × {item.quantity}
                      </div>
                    ))}
                  </td>
                
                  <td>₹{order.totalPrice}</td>
                  <td>{order.paymentMethod}
                    
                  
                    {order.isPaid ? (
                      <span className="badge bg-success ml-3">Paid</span>
                    ) : (
                      <span className="badge bg-danger ml-3">Pending</span>
                    )}
                  
</td>
                
               
                  <td>
  {order.shippingAddress?.city}, {order.shippingAddress?.country}
</td>


                  {/* STATUS */}
                  <td>
                    <span className={`badge ${getStatusColor(order.status)}`}>
  {order.status}
</span>
                  </td>
<td>
  {order.status === "Cancelled"
    ? order.cancelDetails?.reason || "N/A"
    : "-"}
</td>
                  {/* DATE */}
                  <td>
                    {new Date(order.dateCreated).toLocaleDateString()}
                  </td>

                  {/* ACTION */}
                  <td className="actions d-flex align-items-center">
                    <div className="actions d-flex align-items-center">
                     <Button onClick={() => navigate(`/order/${order._id}`)}>
  <FaEye />
</Button>
<Button
  className="secondary"
  onClick={() => handleEditOrder(order)}
>
  <MdOutlineModeEdit />
</Button>
                      <Button
                        className="error"
                        color="error"
                        onClick={() => deleteOrder(order._id)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4 w-100">
                  <h5>No Orders Found 😔</h5>
                </td>
              </tr>
            )}
          </tbody>
              </table>
              <div className="d-flex justify-content-between align-items-center mt-3">
  <p>
    Showing <b>{page}</b> of <b>{totalPages}</b> pages
  </p>

  <Pagination
    count={totalPages}
    page={page}
    onChange={handleChange}
    color="primary"
    showFirstButton
    showLastButton
  />
</div>
      </div>
   


          </div>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>

  <DialogTitle>Update Order</DialogTitle>

  <DialogContent>

    {/* STATUS */}
    <TextField
      select
      label="Order Status"
      fullWidth
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="mt-2"
    >
                <MenuItem value="Pending">Pending</MenuItem>
                 <MenuItem value="Ordered">Ordered</MenuItem>
      <MenuItem value="Processing">Processing</MenuItem>
                <MenuItem value="Shipped">Shipped</MenuItem>
                 <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
      <MenuItem value="Delivered">Delivered</MenuItem>
      <MenuItem value="Cancelled">Cancelled</MenuItem>
    </TextField>

    {/* PAYMENT */}
    <TextField
      select
      label="Payment Status"
      fullWidth
      value={isPaid ? "Paid" : "Pending"}
      onChange={(e) => setIsPaid(e.target.value === "Paid")}
      className="mt-3"
    >
      <MenuItem value="Paid">Paid</MenuItem>
      <MenuItem value="Pending">Pending</MenuItem>
    </TextField>

  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>

    <Button variant="contained" onClick={updateOrder}>
      Update
    </Button>
  </DialogActions>

</Dialog>
          
                </div>
        </>
    )
}

export default Orders;