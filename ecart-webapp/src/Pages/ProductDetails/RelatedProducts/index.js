import Button from "react-bootstrap/Button";
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductItem from "../../../Components/ProductItem";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchDataFromApi, postData } from "../../../utils/api";
 

const RelatedProducts = ( {title, productId, type}) => {

    const [products, setProducts] = useState([]);

  useEffect(() => {
    if (productId) {
      getRelatedProducts();
    }
  }, [productId]);

useEffect(() => {
    if (type === "related" && productId) {
      getRelatedProducts();
    } else if (type === "recent") {
      getRecentProducts();
    }
  }, [productId, type]);

const getRelatedProducts = async () => {
  try {
    const data = await fetchDataFromApi(`/api/products/related/${productId}`);
    setProducts(data.products);
  } catch (error) {
    console.log(error);
  }
};

const getRecentProducts = async () => {
  try {
    const ids = JSON.parse(localStorage.getItem("recentProducts")) || [];

    if (ids.length === 0) return;

    const data = await postData("/api/products/by-ids", { ids });

    setProducts(data.products);

  } catch (error) {
    console.log(error);
  }
  };
  
  
    return (
        <>
              <div className='d-flex align-items-center mt-3'>
                            <div className='info w-75'>
                    <h3 className='mb-3 hd'>{title}</h3>
                            </div>
                           
                          </div>
                          
                          <div className='product_row w-100 mt-0'>
                             <Swiper
                    slidesPerView={5}
                    spaceBetween={10}
                    navigation={true}
                    slidesPerGroup={3}
            
                    modules={[Navigation]}
                    className="mySwiper"
                            >
                              {products.length > 0 ? (
            products.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductItem item={item} />
              </SwiperSlide>
            ))
          ) : (
         <div className="d-flex flex-column align-items-center justify-content-center text-center py-4">

  {/* ICON */}
  <div
    className="mb-3 d-flex align-items-center justify-content-center"
    style={{
      width: "80px",
      height: "80px",
      background: "#f1f3f5",
      borderRadius: "50%"
    }}
  >
    <img
      src="https://cdn-icons-png.flaticon.com/128/4076/4076549.png"
      alt="no products"
      style={{ width: "40px" }}
    />
  </div>

  {/* TITLE */}
  <h6 className="text-muted mb-1">No Related Products</h6>

  {/* SUBTEXT */}
  <p className="text-muted small mb-2">
    We couldn’t find similar items right now.
  </p>

</div>
          )}
              </Swiper>
            
                          </div>
        </>
    )
}

export default RelatedProducts;