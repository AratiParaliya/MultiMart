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
import { SearchContext } from "../../context/SearchContext";
import { Pagination } from "@mui/material";



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
const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
const [totalAmount, setTotalAmount] = useState(0);
  const { searchQuery } = useContext(SearchContext);
  
const filteredData = paymentData?.filter((item) => {
  const query = searchQuery.toLowerCase();

  return (
    item.userId?.name?.toLowerCase().includes(query) ||
    item.paymentMethod?.toLowerCase().includes(query) ||
    item.status?.toLowerCase().includes(query) ||
    item._id?.toLowerCase().includes(query)
  );
});
  
  const dataToShow = searchQuery ? filteredData : paymentData;


const handleChange = (event, value) => {
  fetchPayments(value);
};
useEffect(() => {
  fetchPayments(1);
}, []);

const fetchPayments = (pageNo) => {
  context.setProgress(40);

  fetchDataFromApi(`/api/payment?page=${pageNo}&limit=10`)
    .then((res) => {

      const paidOnly = (res.payments || []).filter(
        (p) => p.status?.toLowerCase() === "paid"
      );

      setPaymentData(paidOnly);

      setPage(res.page);
      setTotalPages(res.totalPages);

      setTotalPayments(res.total || 0);       // ✅ FIX
      setTotalAmount(res.totalAmount || 0);   // ✅ FIX

      context.setProgress(100);
    })
    .catch(() => context.setProgress(100));
};

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
    <th>Payment ID</th> {/* NEW */}
    <th>Amount</th>
    <th>Method</th>
    <th>Razorpay ID</th> {/* NEW */}
    <th>Status</th>
    
    <th>Date</th>
    <th>Action</th>
  </tr>
</thead>

   <tbody>
  {dataToShow?.length > 0 ? (
    dataToShow.map((payment, index) => (
      <tr key={payment._id}>
        <td>{index + 1}</td>

        {/* USER */}
        <td>{payment.userId?.name || "N/A"}</td>

        {/* PAYMENT ID */}
        <td>{payment._id.slice(-6).toUpperCase()}</td>

        {/* AMOUNT */}
        <td>₹{payment.amount}</td>

        {/* METHOD */}
        <td>{payment.paymentMethod}</td>

        {/* RAZORPAY ID */}
        <td>
          {payment.razorpay_payment_id
            ? payment.razorpay_payment_id
            : "COD"}
        </td>

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

      

        {/* DATE */}
        <td>
          {new Date(payment.createdAt).toLocaleDateString("en-IN")}
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
      <td colSpan="10" className="text-center">
        No Payments Found 😔
      </td>
    </tr>
  )}
</tbody>
              </table>
  <div className="d-flex tableFooter">
             <p>
  showing <b>{page}</b> of <b>{totalPages}</b>
</p>

             <Pagination
  className="pagination"
  count={totalPages}
  page={page}
  color="primary"
  onChange={handleChange}
  showFirstButton
  showLastButton
/>
            </div>
      </div>
   


          </div>
    
          
                </div>
        </>
    )
}

export default Payments;