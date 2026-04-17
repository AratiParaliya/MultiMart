import React from 'react'
import HomeBanner from "../../Components/HomeBanner";
import Button from "react-bootstrap/Button";
import { IoIosArrowRoundForward } from 'react-icons/io';
import { IoMailOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from "axios";
import { useEffect, useState } from "react";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import ProductItem from "../../Components/ProductItem";
import HomeCat from '../../Components/HomeCat';
import banner2 from '../../assets/images/banner2.jpg';

import coupon from '../../assets/images/coupon.jpg';
import Services from '../../Components/services';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';
import { useRef } from "react";

const Home = () => {
const [products, setProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const context = useContext(MyContext);
  const [offerBanners, setOfferBanners] = useState([]);
  const [sideBanners, setSideBanners] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [showNoTrendingMsg, setShowNoTrendingMsg] = useState(false);


const trendingRef = useRef(null);


useEffect(() => {
  getBestSellers();   // always run
  getNewProducts();
  getOfferBanners(); 
  getSidebannerBanners();
}, [context.selectedCountry]);

  
  useEffect(() => {
  if (context.selectedCountry && trendingProducts.length > 0) {
    setTimeout(() => {
      trendingRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 500);
  }
}, [trendingProducts]);
  

useEffect(() => {
  if (context.selectedCountry) {
    fetchDataFromApi(
      `/api/products/trending-by-country?country=${context.selectedCountry}`
    ).then((res) => {
      if (res?.success && res.products.length > 0) {
        setTrendingProducts(res.products);
        setShowNoTrendingMsg(false);
      } else {
        setTrendingProducts([]);
        setShowNoTrendingMsg(true);

        // ⏳ hide after 3 sec
        setTimeout(() => {
          setShowNoTrendingMsg(false);
        }, 3000);
      }
    });
  }
}, [context.selectedCountry]);
  
const getNewProducts = async () => {
  try {
    const data = await fetchDataFromApi("/api/products/new");
    setNewProducts(data.products || []);
  } catch (error) {
    console.log(error);
  }
};
  const getOfferBanners = async () => {
  try {
    const data = await fetchDataFromApi("/api/banner?type=offer&status=true");
    setOfferBanners(data.data || []);
  } catch (err) {
    console.log(err);
  }
};

  const getSidebannerBanners = async () => {
  try {
    const data = await fetchDataFromApi("/api/banner?type=side-banner&status=true");
    setSideBanners(data.data || []);
  } catch (err) {
    console.log(err);
  }
};
  
const getBestSellers = async () => {
  try {
    const url = context.selectedCountry
      ? `/api/products/best-sellers?country=${context.selectedCountry}`
      : `/api/products/best-sellers`;

    const data = await fetchDataFromApi(url);

    setBestProducts(data.products || []);

  } catch (err) {
    console.log(err);
  }
};



  return (
    <>
      
      <HomeBanner />
<Services/>
     <HomeCat/>
      <section className='homeProducts'>
        <div className='container'>
          <div className='row'>
             <div className='col-md-3 '>
  <div className="sticky">
  {sideBanners?.length > 0 &&
    sideBanners.slice(0, 5).map((banner) => {

      const hasContent = banner.title || banner.desc;

      return (
        <div
          className={`side-banner ${hasContent ? "has-content" : ""}`}
          key={banner._id}
        >
          <img src={banner.images?.[0]} alt={banner.title} />

          {hasContent && (
            <div className="side-banner-content">
              
              {banner.title && <h5>{banner.title}</h5>}
              
              {banner.desc && <p>{banner.desc}</p>}

              {/* ✅ SHOW BUTTON ONLY IF DESC EXISTS */}
              {banner.desc && (
                <button className="shop-btn">Shop Now</button>
              )}

            </div>
          )}
        </div>
      );
    })}
</div>
             </div> 
            <div className='col-md-9 productRow '>

{showNoTrendingMsg && (
  <section ref={trendingRef} className="homeProducts">
  <div className="container ">
    <div className="alert alert-warning text-center">
      No trending products available in {context.selectedCountry}
    </div>
                  </div>
                  </section>
)}
{context.selectedCountry && trendingProducts.length > 0 && (
<section ref={trendingRef} className="homeProducts">
    <div className="container">

      {/* HEADER SAME AS BEST SELLER */}
      <div className="d-flex align-items-center">
        <div className="info w-75">
          <h3 className="mb-0 hd">
            🔥 Trending in {context.selectedCountry}
          </h3>
          <p className="text-light text-sml mb-0">
            Most popular products in your selected location
          </p>
        </div>

      
      </div>

      {/* SWIPER LIKE BEST SELLER */}
      <div className="product_row w-100 mt-4">
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          navigation={true}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
          }}
          modules={[Navigation]}
        >
          {trendingProducts.map((item, index) => (
            <SwiperSlide key={index}>
              <ProductItem item={item.product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  </section>
              )}
         

              <div className='d-flex align-items-center'>
                <div className='info w-75'>
                  <h3 className='mb-0 hd'>BEST SELLERS</h3>
                  <p className='text-light text-sml mb-0'> Do not miss the current offers untill the end of March</p>
                </div>
                <Link to ="/cat">
                <Button className="btn-blue btn ml-auto">
                  View All <IoIosArrowRoundForward/>
                </Button></Link>
              </div>
              
              <div className='product_row w-100 mt-4'>
                 <Swiper
        slidesPerView={4}
                  spaceBetween={10}
                  navigation={true}
                   breakpoints={{
    320: { slidesPerView: 1 },
    576: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    992: { slidesPerView: 4 }
  }}
        
        modules={[Navigation]}
        className="mySwiper"
                >
                 {Array.isArray(bestProducts) && bestProducts.length > 0 ? (
    bestProducts.map((item) => (
      <SwiperSlide key={item._id}>
        <ProductItem item={item} />
      </SwiperSlide>
    ))
  ) : (
      <div className="card shadow-sm border-0 w-100">
  <div className="card-body text-center py-5">
    
    <div className="mb-3">
      <i className="bi bi-search text-muted" style={{ fontSize: "40px" }}></i>
    </div>

    <h5 className="text-muted mb-2">Loading....</h5>
    
   
  </div>
</div>
  )}
                  
  </Swiper>

              </div>




 <div className='d-flex align-items-center mt-4'>
                <div className='info w-75'>
                  <h3 className='mb-0 hd'>New Products</h3>
                  <p className='text-light text-sml mb-0'> New products with updated stocks.</p>
                </div>
               <Link to ="/cat">
                <Button className="btn btn-blue ml-auto">
                  View All <IoIosArrowRoundForward/>
                </Button></Link>
              </div>
              
             <div className='product_row productRow2 w-100 mt-4 d-flex'>
  {newProducts.length > 0 ? (
    newProducts.map((item) => (
      <ProductItem key={item._id} item={item} />
    ))
  ) : (
      <div className="card shadow-sm border-0 w-100">
  <div className="card-body text-center py-5">
    
    <div className="mb-3">
      <i className="bi bi-search text-muted" style={{ fontSize: "40px" }}></i>
    </div>

    <h5 className="text-muted mb-2">No Products Found</h5>
    
  </div>
</div>
  )}
</div>
<div className='d-flex mt-5 bannerSec'>
  {offerBanners.slice(0, 2).map((banner, index) => (
    <div className='banner-b' key={banner._id}>
      
      <img src={banner.images[0]} alt={banner.title} />

      <div className={`banner-content ${index === 0 ? "left" : "center"}`}>
        <h3>{banner.title}</h3>
        <p className="p">{banner.desc}</p>
        <button className="shop-btn">Shop Now</button>
      </div>

    </div>
  ))}
</div>

            </div>

          </div>
          
</div>

      </section>

      <section className='newsLetterSection mt-3 mb-3'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <p className='text-white mb-1'>
                $20 discount for your first order</p>
              <h4 className='text-white'>join our newsletter and get...</h4>
<p className='text-light'>Join our email subscription now to get updates on promotions and coupons.

              </p>
              
              <form>
                <IoMailOutline/>
                <input type="text" placeholder=' Your Email Address'></input>
                <Button>Subscribe</Button>
              </form>
            </div>

             <div className='col-md-6'>
              <img src={coupon}></img>
            </div>
          </div>
        </div>

      </section>

     
    </>
  )
}

export default Home;
