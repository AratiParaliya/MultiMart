import { FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import Header from "../../components/Header";
import DashboardBox from "./components/dashboardBox";
import { IoMdCart } from "react-icons/io";
import { MdDelete, MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi"
import Button from "@mui/material/Button";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import { IoIosTimer } from "react-icons/io";
import { HiDotsVertical, } from "react-icons/hi";
import { Chart } from "react-google-charts";

import Productlist from "../../components/Productlist";


export const options = {
    'backgroundColor': 'transparent',
    'chartArea':{'width':'100%' , 'height' : '80%'}
 

};

const Dashboard = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [revenueData, setRevenueData] = useState([]);
const [orderVsPaymentData, setOrderVsPaymentData] = useState([]);
const [stats, setStats] = useState({
  users: 0,
  orders: 0,
  products: 0,
  revenue: 0
});
  
const chartData = [
  ["Type", "Amount"],
  ["Revenue", stats.revenue],
  ["Remaining", 100000 - stats.revenue] // demo limit
];
const [recentReceipts, setRecentReceipts] = useState([]);
    
    const open = Boolean(anchorEl);
      const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

    useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [usersRes, ordersRes, productsRes, receiptsRes] = await Promise.all([
        fetch("http://localhost:4000/api/user"),
        fetch("http://localhost:4000/api/orders"),
        fetch("http://localhost:4000/api/products"),
        fetch("http://localhost:4000/api/receipts")
      ]);

      const users = await usersRes.json();
      const orders = await ordersRes.json();
      const products = await productsRes.json();
      const receipts = await receiptsRes.json();

      const totalRevenue = receipts.receipts.reduce(
        (sum, r) => sum + r.amountPaid,
        0
      );

    const usersData = users?.data || users?.users || users;
const ordersData = orders?.data || orders?.orders || orders;
const productsData = products?.data || products?.products || products;


setStats({
  users: usersData.length || 0,
  orders: ordersData.length || 0,
    products: products.totalProducts || 0, 
  revenue: totalRevenue
});
        setRecentReceipts(receipts.receipts.slice(0, 5));
      
      // 📈 DAILY REVENUE GROUPING
const revenueMap = {};

receipts.receipts.forEach((r) => {
  const date = new Date(r.issuedAt).toLocaleDateString();

  if (!revenueMap[date]) {
    revenueMap[date] = 0;
  }

  revenueMap[date] += r.amountPaid;
});

const revenueChartData = [
  ["Date", "Revenue"],
  ...Object.keys(revenueMap).map((date) => [date, revenueMap[date]])
];

setRevenueData(revenueChartData);


// 📊 ORDERS vs PAYMENTS
const ordersD = orders?.data || orders?.orders || [];

console.log("ORDERS DATA:", ordersData);

const totalOrders = ordersD.length;

const paidOrders = ordersD.filter(
  (o) => ["Paid", "delivered", "success"].includes(o.status?.toLowerCase())
).length;

const pendingOrders = ordersD.filter(
   (o) => ["Pending", "Processing"].includes(o.status?.toLowerCase())
).length;

const cancelledOrders = ordersD.filter(
  (o) => o.status?.toLowerCase() === "Cancelled"
).length;

console.log("Paid:", paidOrders);
console.log("Pending:", pendingOrders);
console.log("Cancelled:", cancelledOrders);

const orderPaymentChart = [
  ["Type", "Count"],
  ["Paid Orders", paidOrders || 0],
  ["Pending Orders", pendingOrders || 0],
  ["Cancelled Orders", cancelledOrders || 0]
];

setOrderVsPaymentData(orderPaymentChart);



    } catch (err) {
      console.log(err);
    }
        };
        

  fetchDashboardData();
}, []);
  const handleClose = () => {
    setAnchorEl(null);
    };
    const ITEM_HEIGHT = 48;


 
 useEffect(() => {
    if (window.name) {
        const data = JSON.parse(window.name);

        // ✅ Save in admin localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Clear after use (important)
        window.name = "";
    }
}, []);

    return (
        <>
            <div className="right-content w-100">
                <div className="row dashboardBoxWrapperRow">
                    <div className="col-md-8">
                        <div className="dashboardBoxWrapper d-flex">
                       <DashboardBox
  color={["#1da256", "#48d483"]}
  icon={<FaUserCircle />}
  title="Total Users"
  value={stats.users}
  grow
/>

<DashboardBox
  color={["#c012e2", "#eb64fe"]}
  icon={<IoMdCart />}
  title="Total Orders"
  value={stats.orders}
/>

<DashboardBox
  color={["#2c78e5", "#60aff5"]}
  icon={<MdShoppingBag />}
  title="Products"
  value={stats.products}
/>

<DashboardBox
  color={["#e1950e", "#f3cd29"]}
  icon={<GiStarsStack />}
  title="Revenue"
  value={`₹${stats.revenue}`}
/>
                        </div>
                    </div>
                    <div className="col-md-4 pl-0">
                        <div className="graphBox box" >
 <div className="d-flex align-items-center w-100 bottomEle">
                <h6 className="text-white mb-0 mt-0">Last Sales</h6>
                <div className="ml-auto">
                    <Button className="ml-auto toggleIcon" onClick={handleClick}><HiDotsVertical />  </Button>
                     <Menu
                   className="boxDropdown_menu"
                    MenuListProps={{
'aria-labelledby':'long-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width:'20ch'
                        },
                    }}

      >
                    
                    <MenuItem onClick={handleClose}>
               <IoIosTimer/> Last Day
                    </MenuItem> 
                    <MenuItem  onClick={handleClose}>
               <IoIosTimer/>  Last week
                            </MenuItem> 
                             <MenuItem  onClick={handleClose}>
               <IoIosTimer/>  Last month
                        </MenuItem> 
                   <MenuItem  onClick={handleClose}>
                <IoIosTimer/> Last year
                        </MenuItem> 

                        </Menu>
                  
                </div>
                            </div>
                             
        <h3 className="text-white font-weight-bold">
  ₹{stats.revenue}
</h3>
<p>Live revenue from receipts</p>
                       <Chart
  chartType="PieChart"
  width="100%"
  height="170px"
  data={chartData}
  options={options}
/>
                        </div>
                    </div>
                    
                   

                </div>
                
               
                <div className="card shadow border-0 p-3 mt-4 w-100">
                    <Productlist/>
                </div>

             <div className="row mt-4">

  {/* 📈 REVENUE LINE CHART */}
  <div className="col-md-8">
    <div className="card shadow border-0 p-3 h-100">
      <h5 className="mb-3">📈 Daily Revenue</h5>

      <Chart
        chartType="LineChart"
        width="100%"
        height="300px"
        data={revenueData}
        options={{
          backgroundColor: "transparent",
          chartArea: { width: "85%", height: "70%" },
          hAxis: { title: "Date" },
          vAxis: { title: "Revenue" }
        }}
      />
    </div>
  </div>

  {/* 📊 ORDERS vs PAYMENTS */}
  <div className="col-md-4">
    <div className="card shadow border-0 p-3 h-100">
      <h5 className="mb-3">📊 Orders vs Payments</h5>

     {orderVsPaymentData.length > 1 && (
  <Chart
    chartType="PieChart"
    width="100%"
    height="300px"
    data={orderVsPaymentData}
    options={{
      backgroundColor: "transparent",
      chartArea: { width: "90%", height: "80%" }
    }}
  />
)}
    </div>
  </div>

</div>
<div className="card shadow  mt-4">
  <div className="card-header bg-white d-flex justify-content-between border-0 pb-0">
    <h5 className="mb-0">🧾 Recent Receipts</h5>
  </div>

  <div className="card-body">

  <table className="table ">
    <thead>
      <tr>
        <th>Receipt</th>
        <th>User</th>
        <th>Amount</th>
        <th>Payment</th>
        <th>Date</th>
      </tr>
    </thead>

                            <tbody>
                                {recentReceipts.length === 0 && (
  <tr>
    <td colSpan="5" className="text-center">
      No receipts found 😕
    </td>
  </tr>
)}
      {recentReceipts.map((r) => (
        <tr key={r._id}>
          <td>{r.receiptNumber}</td>
          <td>{r.userId?.name}</td>
          <td>₹{r.amountPaid}</td>
          <td>{r.paymentMethod}</td>
          <td>{new Date(r.issuedAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
                    </div>
                    </div>
            </div> 
           
        </>
   ) 
}
export default Dashboard ;