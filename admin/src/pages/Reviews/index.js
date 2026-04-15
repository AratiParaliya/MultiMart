import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DashboardBox from "../Dashboard/components/dashboardBox";

import { FaUserCircle } from "react-icons/fa";

import { useState } from "react";

import { MdDelete } from "react-icons/md";

import Button from "@mui/material/Button";

import { useContext, useEffect} from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import { MyContext } from "../../App";



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
    
 
const Reviews = () => {
    
  
      const context = useContext(MyContext);
 const [reviewData, setReviewData] = useState([]);



useEffect(() => {
  context.setProgress(40);

  fetchDataFromApi("/api/reviews")
    .then((res) => {
      console.log("REVIEW DATA:", res);
      setReviewData(res.reviews || []);
      context.setProgress(100);
    })
    .catch(() => context.setProgress(100));
}, []);

const deleteReview = (id) => {
  deleteData(`/api/reviews/delete/${id}`)
    .then(() => {
      setReviewData((prev) =>
        prev.filter((review) => review._id !== id)
      );

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Review deleted successfully",
      });
    })
    .catch(() => {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Failed to delete review",
      });
    });
};

    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Reviews List</h5>

  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Review"
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
  title="Total Reviews"
  value={reviewData.length}
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
    <th>Product</th>
    <th>Rating</th>
    <th>Review</th>
    <th>Images</th>
    <th>Date</th>
    <th>Action</th>
  </tr>
</thead>

        <tbody>
  {reviewData?.length > 0 ? (
    reviewData.map((review, index) => (
      <tr key={review._id}>
        <td>{index + 1}</td>

        {/* USER */}
        <td>{review.userId?.name}</td>

        {/* PRODUCT */}
        <td>{review.productId?.name}</td>

        {/* RATING */}
        <td>⭐ {review.rating}</td>

        {/* TEXT */}
        <td>{review.reviewText}</td>

        {/* IMAGES */}
        <td>
          {review.images?.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:5000/${img}`}
              alt=""
              width="40"
              className="me-2"
            />
          ))}
        </td>

        {/* DATE */}
        <td>
          {new Date(review.createdAt).toLocaleDateString()}
        </td>

        {/* ACTION */}
        <td className="actions d-flex align-items-center">
          <Button
            className="error"
            color="error"
            onClick={() => deleteReview(review._id)}
          >
            <MdDelete />
          </Button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="text-center">
        No Reviews Found 😔
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

export default Reviews;