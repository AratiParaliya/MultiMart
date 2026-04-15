import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardBox from "../Dashboard/components/dashboardBox";

import { FaUserCircle } from "react-icons/fa";

import { useState } from "react";

import { MdDelete, MdOutlinePayments } from "react-icons/md";

import Button from "@mui/material/Button";

import { useContext, useEffect} from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { MyContext } from "../../App";
import { IoMdCart } from "react-icons/io";



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
    
 
const Payments = () => {
    
  
      const context = useContext(MyContext);
const [paymentData, setPaymentData] = useState([]);

  
  

const totalPayments = paymentData.length;

const totalAmount = paymentData.reduce(
  (sum, item) => sum + item.amount,
  0
);

useEffect(() => {
  context.setProgress(40);

  fetchDataFromApi("/api/payment")
    .then((res) => {
      console.log("PAYMENT DATA:", res);
      setPaymentData(res.payments || []);
      context.setProgress(100);
    })
    .catch(() => context.setProgress(100));
}, []);

const deletePayment = (id) => {
  deleteData(`/api/payment/delete/${id}`)
    .then(() => {
      setPaymentData((prev) =>
        prev.filter((item) => item._id !== id)
      );

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Payment deleted successfully",
      });
    })
    .catch(() => {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Failed to delete payment",
      });
    });
};

    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Payment List</h5>

  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Payment"
      deleteIcon={<ExpandMoreIcon />}
    />

  </Breadcrumbs>
                </div>
<div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
  <div className="col-md-12">
    <div className="dashboardBoxWrapper d-flex">

    <DashboardBox
  color={["#1da256", "#48d483"]}
  icon={<MdOutlinePayments />}
  title="Total Payments"
  value={totalPayments}
/>

<DashboardBox
  color={["#c012e2", "#eb64fe"]}
  icon={<IoMdCart />}
  title="Total Amount"
  value={`₹${totalAmount}`}
/>

    

    </div>
  </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4 w-100">


      <div className="table-responsive mt-3">
        <table className="table table-striped table-bordered v-align">
         <thead className="thead-dark">
  <tr>
    <th>#</th>
    <th>User</th>
    <th>Amount</th>
    <th>Method</th>
    <th>Status</th>
    <th>Order</th>
    <th>Date</th>
    <th>Action</th>
  </tr>
</thead>

     <tbody>
  {paymentData?.length > 0 ? (
    paymentData.map((payment, index) => (
      <tr key={payment._id}>
        <td>{index + 1}</td>

        {/* USER */}
        <td>{payment.userId?.name}</td>

        {/* AMOUNT */}
        <td>₹{payment.amount}</td>

        {/* METHOD */}
        <td>{payment.paymentMethod}</td>

        {/* STATUS */}
        <td>
          <span
            className={`badge ${
              payment.status === "Paid"
                ? "bg-success"
                : payment.status === "Failed"
                ? "bg-danger"
                : "bg-warning"
            }`}
          >
            {payment.status}
          </span>
        </td>

        {/* ORDER */}
       <td>
  {payment.orderId?.orderItems?.map((item, i) => (
    <div key={i}>
      {item.name} × {item.quantity}
    </div>
  )) || "N/A"}
</td>

        {/* DATE */}
        <td>
          {new Date(payment.createdAt).toLocaleDateString()}
        </td>

        {/* ACTION */}
        <td>
          <Button
            className="error"
            color="error"
            onClick={() => deletePayment(payment._id)}
          >
            <MdDelete />
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center">
        No Payments Found 😔
      </td>
    </tr>
  )}
</tbody>
        </table>
      </div>
   


          </div>
    
          
                </div>
        </>
    )
}

export default Payments;