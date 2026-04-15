import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import React, { useRef } from "react";
import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import {BiSolidCategoryAlt} from "react-icons/bi"
import LinearProgress from "@mui/material/LinearProgress";
import UserAvatarImg from "../../../components/userAvatarimg"
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { FaReply } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDataFromApi, postData } from "../../../utils/api";

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



const ProductDetails = () => {

const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeReplyId, setActiveReplyId] = useState(null);


useEffect(() => {
  fetchDataFromApi(`/api/products/${id}`).then((res) => {
    setProduct(res);
  });
}, [id]);
  
useEffect(() => {
  fetchDataFromApi(`/api/reviews/product/${id}`).then((res) => {
    setReviews(res.reviews);
  });
}, [id]);  
  
  const images = product?.images?.flat() || [];

var productSliderOptions = {
    dots: false,
    infinite:false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:false
    };
    
    var productSliderSmlOptions = {
    dots: false,
    infinite:false,
    speed: 500,
    slidesToShow: 4,
        slidesToScroll: 1,
    arrows:false
    };
    
  const productSliderBig = useRef();
    const productSliderSml = useRef();

  const goToSlide = (index) => {
    productSliderBig.current.slickGoTo(index)
    productSliderSml.current.slickGoTo(index)
  }
  
const handleReply = (reviewId) => {
  if (!replyText.trim()) return;

  const user = JSON.parse(localStorage.getItem("user")); // ✅ get user

  postData(`/api/reviews/reply/${reviewId}`, {
    userId: user._id,
    userName: user.name,
    userImage: user.image,
    text: replyText
  }).then(() => {
    setReplyText("");
    setActiveReplyId(null);

    fetchDataFromApi(`/api/reviews/product/${id}`).then((res) => {
      setReviews(res.reviews);
    });
  });
};
       return (

         <>
           
            <div className="right-content w-100">
                  <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Product view</h5>

  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

                           <StyledBreadcrumb                           
                               label="Products"
                                component="a"
                                 href="#"
                           />
                            <StyledBreadcrumb                              
                               label="Products view"                              
                           />
                           

                       </Breadcrumbs>
                       
                </div>
               <div className="card productDetailsSection">
                   <div className="row">
                       <div className="col-md-5">
                               <div className="slideWrapper pt-3 pb-3 pl-4 pr-4">
                                   <h6 className="mb-4">Product Gallery</h6>
                    <Slider {...productSliderOptions} ref={productSliderBig} className="sliderBig mb-2">
  {
    images.map((img, index) => (
      <div className="item" key={index}>
        <img src={img} className="w-100" />
      </div>
    ))
  }
</Slider>
                               
              <Slider {...productSliderSmlOptions} ref={productSliderSml} className="sliderSml">
  {
    images.map((img, index) => (
      <div className="item" key={index} onClick={() => goToSlide(index)}>
        <img src={img} className="w-100" />
      </div>
    ))
  }
</Slider>
                 </div>
                       </div>
                        <div className="col-md-7">
                               <div className="slideWrapper pt-3 pb-3 pl-4 pr-4">
                                   <h6 className="mb-4">Product Details</h6>
<h4>{product?.name}</h4>
                                   <div className="productInfo mt-">
                                       <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Brand</span>
                                           </div>
                                           <div className="col-sm-9">
                                         :      <span>{product?.brand}</span>
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <BiSolidCategoryAlt/>
                                               </span>
                                                <span className="name">Category :</span>
                                           </div>
                                           <div className="col-sm-9">
                                          :      <span> {product?.brand}</span>
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Tags</span>
                                           </div>
                                           <div className="col-sm-9">
                           :   <span>
                             <ul className="list list-inline tags sml">
                               <li className="list-inline-item">
                                 <span> SUITE</span>
                               </li>
                                <li className="list-inline-item">
                                 <span> PARTY</span>
                               </li>
                                <li className="list-inline-item">
                                 <span> DRESS</span>
                               </li>
                                <li className="list-inline-item">
                                 <span> SMART</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>MAN</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>STYLES</span>
                               </li>
                           </ul>
                           </span> 
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Color</span>
                                           </div>
                                           <div className="col-sm-9">
                                            :    <span> <ul className="list list-inline tags sml">
                               <li className="list-inline-item">
                                 <span>RED</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>BLUE</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>GREEN</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>YELLOW</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>PURPLE</span>
                               </li>
                               
                           </ul>
                           </span> 
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Size</span>
                                           </div>
                                           <div className="col-sm-9">
                                            : <span> <ul className="list list-inline tags sml">
                               <li className="list-inline-item">
                                 <span>SM</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>MD</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>LG</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>XL</span>
                               </li>
                                <li className="list-inline-item">
                                 <span>XXL</span>
                               </li>
                                
                           </ul>
                           </span>   
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Price</span>
                                           </div>
                                           <div className="col-sm-9">
                                            :  <span className="old">₹{product?.oldPrice}</span>
<span className="new text-danger"> ₹{product?.price} </span>
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Stock</span>
                                           </div>
                                           <div className="col-sm-9">
                                            :    <span>({product?.countInStock}) Piece</span>
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Review</span>
                                           </div>
                                           <div className="col-sm-9">
                                           :  <Rating value={product?.rating || 0} precision={0.5} readOnly />
                                            </div>
                                       </div>
                                         <div className="row mb-3">
                                           <div className="col-sm-3 d-flex align-items-center">
                                               <span className="icon">
                                                   <MdBrandingWatermark/>
                                               </span>
                                                <span className="name">Published</span>
                                           </div>
                                           <div className="col-sm-9">
                                          :     <span>02 Feb 2020</span>
                                            </div>
                                       </div>
                                   </div>

                           </div>
                       </div>
                       
               </div> 
               

               <div className="p-4">
                  <h6 className="mt-4 mb-3">Product Description</h6>
                 <p>{product?.description}</p>
                 <br />
                 
                 <h6 className="mt-4 mb-3">Rating Analytics</h6>
   <div className="reviewsSection">
{
  reviews.length > 0 ? (
    reviews.map((item) => (

         <div className="reviewsRow" key={item._id}>

  <div className="reviewCard p-3 shadow-sm rounded bg-white">

    {/* USER + REVIEW */}
    <div className="d-flex justify-content-between">

      <div className="d-flex">
        <UserAvatarImg
          img={
            item.userId?.image
              ? item.userId.image
              : `https://ui-avatars.com/api/?name=${item.userId?.name || "User"}`
          }
                
     
          lg={true}
        />

        <div className="pl-3">
          <h6 className="mb-0">{item.userId?.name}</h6>
          <span className="text-muted small">Just now</span>
          <Rating value={item.rating} precision={0.5} readOnly />
        </div>
      </div>

      <Button
        className="btn-blue btn-sm"
        onClick={() =>
          setActiveReplyId(
            activeReplyId === item._id ? null : item._id
          )
        }
      >
        <FaReply /> Reply
      </Button>
    </div>

    <p className="mt-2">{item.reviewText}</p>

    {/* REVIEW IMAGES */}
    <div className="d-flex gap-2">
      {item.images?.map((img, i) => (
        <img key={i} src={img} width="60" height="60" />
      ))}
    </div>

  </div>

  {/* ✅ REPLIES SECTION (SEPARATE CARD STYLE) */}
  <div className="replyWrapper mt-2 pl-5">
    {item.replies?.map((reply, i) => (
      
      <div className="replyCard p-2 mb-2 bg-light rounded" key={i}>
        
        <div className="d-flex align-items-center">

       <UserAvatarImg
  img={
    reply?.userImage ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      reply?.userName || "User"
    )}`
  }
  onError={(e) => {
    e.target.src = `https://ui-avatars.com/api/?name=User`;
  }}
  sm={true}
/>

          <div className="pl-2">
            <h6 className="mb-0 small">
              {reply.userName}
              <span className="badge badge-info ml-2">Admin</span>
            </h6>

            <span className="text-muted small">
              {reply.createdAt
                ? new Date(reply.createdAt).toLocaleString()
                : "Just now"}
            </span>
          </div>
        </div>

        <p className="mb-0 mt-1 small">{reply.text}</p>
      </div>

    ))}
  </div>

  {/* Reply Input */}
  {activeReplyId === item._id && (
    <div className="replyInputBox mt-2 pl-5">
      <textarea
        className="form-control"
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder="Write reply..."
      />

      <Button
        className="btn-blue btn-sm mt-2"
        onClick={() => handleReply(item._id)}
      >
        Submit Reply
      </Button>
    </div>
  )}

</div>
    ))
  ) : (
 <div className="noReviewsBox text-center p-5">
  <img
    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
    alt="no reviews"
    width="120"
    className="mb-3"
  />

  <h5 className="mb-2">No Reviews Yet</h5>

  <p className="text-muted mb-3">
    This product hasn’t received any reviews yet.
  </p>

  <Button variant="outlined" className="btn-blue">
    Be the first to review
  </Button>
</div>
  )
}
</div>
              
                 
              
                   

              
              </div>
                   </div>
                    </div>
        </>
    )
}
export default ProductDetails;