import { useContext, useEffect, useState } from "react";
import jsPDF from "jspdf";
import { ImDownload2 } from "react-icons/im";
import html2canvas from "html2canvas";
import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FaEye, FaPencilAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import { MdDelete } from "react-icons/md";
import QRCode from "qrcode";
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

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState(null); // ✅ FIX
const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  

  const { searchQuery } = useContext(SearchContext);
  

  // ✅ FILTER LOGIC
  const filteredReceipts = receipts.filter((item) => {
    const matchesSearch =
      item.receiptNumber?.toLowerCase().includes(search.toLowerCase()) ||
      item.userId?.name?.toLowerCase().includes(search.toLowerCase());

    const matchesPayment = paymentFilter
      ? item.paymentMethod === paymentFilter
      : true;

    const matchesDate = dateFilter
      ? new Date(item.issuedAt).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true;

    return matchesSearch && matchesPayment && matchesDate;
  });

  const filteredData = filteredReceipts?.filter((item) =>
         item.receiptNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase())

  );
  
  const dataToShow = searchQuery ? filteredData : filteredReceipts;



  // ✅ PDF GENERATE


const generatePDF = async (receipt) => {
  const orderId = receipt.orderId?._id || receipt.orderId;
  if (!orderId) { alert("Order ID not found ❌"); return; }

  const qrUrl = `http://localhost:3001/update-order/${orderId}`;
  const qrImage = await QRCode.toDataURL(qrUrl);

 const element = document.createElement("div");

element.style.position = "fixed";
element.style.top = "-9999px";   // hide from screen
element.style.left = "0";
element.style.width = "100%";
element.style.display = "flex";
element.style.justifyContent = "center"; // ✅ center horizontally

element.style.padding = "40px 0"; // spacing like real UI
  element.innerHTML = `


<div class="inv-wrap">

  <div class="inv-header">
    <div>
      <div class="inv-brand">My<span>Store</span></div>
      <div style="font-size:12px;color:#64748b;margin-top:4px;">MyStore Pvt Ltd</div>
      <div class="inv-badge">TAX INVOICE</div>
    </div>
    <div class="inv-header-meta">
      <strong>Receipt #${receipt.receiptNumber}</strong><br/>
      Order: ${receipt.orderId?._id || receipt.orderId}<br/>
      Date: ${new Date(receipt.issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}<br/>
      GSTIN: XXXXXXXX
    </div>
  </div>

  <div class="inv-body">
    <div>
      <div class="label">Bill To</div>
      <div class="inv-addr">
        <strong>${receipt.billingDetails.firstName} ${receipt.billingDetails.lastName}</strong>
        ${receipt.billingDetails.address1}<br/>
        ${receipt.billingDetails.city}, ${receipt.billingDetails.state}<br/>
        ${receipt.billingDetails.country} — ${receipt.billingDetails.zipCode}<br/>
        +${receipt.billingDetails.phone}
      </div>
    </div>
    <div>
      <div class="label">Scan to Track Order</div>
      <div class="inv-qr-box">
        <img src="${qrImage}" width="100" height="100" style="border-radius:6px;border:4px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.1);"/>
        <div class="inv-qr-label">Scan to view & update<br/>your order status</div>
        <div class="inv-method">${receipt.paymentMethod}</div>
      </div>
    </div>
  </div>

  <div style="height:1px;background:#f0f0f0;margin:0 36px;"></div>

  <div class="inv-table-wrap">
    <table class="inv-table">
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${receipt.items.map(item => `
          <tr>
            <td><span class="inv-prod-name">${item.name}</span></td>
            <td style="text-align:center;"><span class="inv-pill">${item.quantity}</span></td>
            <td>₹${item.price.toLocaleString("en-IN")}</td>
            <td>₹${(item.quantity * item.price).toLocaleString("en-IN")}</td>
          </tr>
        `).join("")}
      </tbody>
      <tfoot>
        <tr class="inv-total-row">
          <td colspan="3">AMOUNT PAID</td>
          <td>₹${receipt.amountPaid.toLocaleString("en-IN")}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="inv-footer">
    <div class="inv-footer-left">
      <strong>Sold by:</strong> MyStore Pvt Ltd &nbsp;|&nbsp; <strong>GSTIN:</strong> XXXXXXXX<br/>
      This is a computer generated invoice. No signature required.
    </div>
    <div class="inv-status">
      <div class="inv-dot"></div>
      ${receipt.paymentStatus}
    </div>
  </div>

</div>
`;

  document.body.appendChild(element);
const invoice = element.querySelector(".inv-wrap");

const canvas = await html2canvas(invoice, {
  scale: 2,
  useCORS: true
});
  const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF("p", "px", "a4"); // ✅ standard size

const imgWidth = 595; // A4 width in px
const imgHeight = (canvas.height * imgWidth) / canvas.width;

pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save(`receipt-${receipt.receiptNumber}.pdf`);
  document.body.removeChild(element);
};

  // ✅ FETCH
 const fetchReceipts = async (pageNo = 1) => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/receipts?page=${pageNo}&limit=10`
    );

    const data = await res.json();

    setReceipts(data.receipts || []);
    setPage(data.page || 1);
    setTotalPages(data.totalPages || 1);

  } catch (err) {
    console.log(err);
  }
};

  // ✅ DELETE
  const deleteReceipt = async (id) => {
    if (!window.confirm("Delete this receipt?")) return;

    try {
      await fetch(`http://localhost:4000/api/receipts/${id}`, {
        method: "DELETE",
      });

      fetchReceipts();
    } catch (err) {
      console.log(err);
    }
  };

useEffect(() => {
  fetchReceipts(1);
}, []);
  
  const handleChange = (event, value) => {
  fetchReceipts(value);
};

  return (
  
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Receipt List</h5>
 <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Receipt"
      deleteIcon={<ExpandMoreIcon />}
    />

        </Breadcrumbs>
        </div>
      {/* FILTERS */}
       <div className="card shadow border-0 p-3 mt-4 w-100">
      <div className="row mb-3">

        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by receipt or user..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="COD">COD</option>
            <option value="UPI">UPI</option>
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <button
            className="btn btn-blue  w-100"
            onClick={() => {
              setSearch("");
              setPaymentFilter("");
              setDateFilter("");
            }}
          >
            Reset
          </button>
        </div>
      </div>

        {/* TABLE */}
         <div className="table-responsive mt-3">
      <table className="table table-striped table-bordered v-align ">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Receipt No</th>
            <th>User</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
              {dataToShow?.length > 0 ? (
    dataToShow.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.receiptNumber}</td>
              <td>{item.userId?.name || "User"}</td>
              <td>₹{item.amountPaid}</td>
              <td>{item.paymentMethod}</td>
              <td>{item.paymentStatus}</td>
              <td>{new Date(item.issuedAt).toLocaleDateString()}</td>

              <td className="actions d-flex align-items-center">
                <Button className="secondary" color="secondary" 
                  onClick={() => setSelectedReceipt(item)}
                >
                <FaEye />
                </Button>

                 <Button className="success" color="success" onClick={() => generatePDF(item)} >
                <ImDownload2 />
                </Button>

               <Button className="error" color="error" 
                  onClick={() => deleteReceipt(item._id)}
                >
                <MdDelete/>
                </Button>
              </td>
            </tr>
              ))
       ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <h5>No Receipt Found 😔</h5>
                </td>
              </tr>
            )}
        </tbody>
          </table>


          <div className="d-flex justify-content-between align-items-center mt-3">
  <p>
    showing <b>{page}</b> of <b>{totalPages}</b>
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
      {/* ✅ MODAL FIXED */}
      {selectedReceipt && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content p-3">

              <h5>Receipt Details</h5>

              <p><b>Receipt:</b> {selectedReceipt.receiptNumber}</p>
              <p><b>User:</b> {selectedReceipt.userId?.name}</p>
              <p><b>Amount:</b> ₹{selectedReceipt.amountPaid}</p>

              <h6>Items:</h6>
              {(selectedReceipt.items || []).map((item, i) => (
                <div key={i}>
                  {item.name} × {item.quantity}
                </div>
              ))}

              <button
                className="btn btn-secondary mt-3"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
   
   
  );
};

export default Receipts;