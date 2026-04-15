import Rating from "@mui/material/Rating";
import Button from "react-bootstrap/Button";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { useContext, useEffect, useState } from "react";

import { MyContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";
import { deleteData, fetchDataFromApi, postData } from "../../utils/api";


const ProductItem = ({ item, itemView  }) => {

  const context = useContext(MyContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();


  
  useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?._id) {
    fetchDataFromApi(`/api/wishlist/${user._id}`).then((res) => {
      setWishlistItems(res?.items || []);
    });
  }
  }, []);
  
const toggleWishlist = async (productId) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please login first!"
    });
    navigate("/SignIn");
    return;
  }

  try {
    const exists = wishlistItems.find((item) => {
      const id = item.product?._id || item.product;
      return id.toString() === productId.toString();
    });

    let res;

    if (exists) {
      res = await deleteData("/api/wishlist/remove", {
        userId: user._id,
        productId
      });

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Removed from Wishlist"
      });

    } else {
      res = await postData("/api/wishlist/add", {
        userId: user._id,
        productId
      });

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Added to Wishlist"
      });
    }

    // ✅ IMPORTANT: refresh state
    const updated = await fetchDataFromApi(`/api/wishlist/${user._id}`);
    setWishlistItems(updated?.items || []);

  } catch (error) {
    console.error("Wishlist Error:", error);

    context.setAlertBox({
      open: true,
      error: true,
      msg: "Something went wrong!"
    });
  }
};

 const viewProductDetails = (id) => {
  context.setisOpenProductModel(true);
  context.setProductId(id); // ✅ store selected product id
};

   const [hover, setHover] = useState(false);
  const [index, setIndex] = useState(0);

  const images = item?.images?.flat() || [];

  // 🔥 Auto slide on hover
  useEffect(() => {
    let interval;

    if (hover && images.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 800); // speed
    }

    return () => clearInterval(interval);
  }, [hover, images]);

const isInWishlist = wishlistItems.some((w) => {
  const id = w.product?._id || w.product;
  return id.toString() === item._id.toString();
});

  return (
    <div className={`productItem ${itemView}`}   onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setIndex(0); // reset
      }}>
      
      <div className="imgWrapper">
       <Link to={`/product/${item?._id}`}>
          <img
            src={images[index]}
            className="w-100"
            alt={item?.name}
          />
        </Link>
        {item?.oldPrice && (
          <span className="badgee badge-primary">
            {Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)}%
          </span>
        )}

        <div className="actions">
          <Button onClick={() => viewProductDetails(item._id)}>
            <TfiFullscreen />
          </Button>
{/* 
          <Button  onClick={() => toggleWishlist(item._id)}>
 {isInWishlist ? <IoMdHeart color="red" /> : <IoMdHeartEmpty />}
</Button> */}
          <Button onClick={() => {
  console.log("Clicked ❤️");
  toggleWishlist(item._id);
          }}>{isInWishlist ? <IoMdHeart color="red" /> : <IoMdHeartEmpty />}</Button>
        </div>
      </div>

      <div className="info">
        <h4>{item?.name}</h4>

        <span className="text-success d-block">
          {item?.countInStock > 0 ? "In Stock" : "Out of Stock"}
        </span>

        <Rating
          value={item?.rating || 0}
          readOnly
          size="small"
          precision={0.5}
        />

        <div className="d-flex">
          <span className="oldPrice">${item?.oldPrice}</span>
          <span className="netPrice text-danger ml-2">${item?.price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;