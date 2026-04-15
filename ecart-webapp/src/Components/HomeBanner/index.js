import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaRegImages } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Navigation, Autoplay } from "swiper/modules";
import { fetchDataFromApi } from "../../utils/api";

const HomeBanner = () => {

  const [banners, setBanners] = useState([]);

  
useEffect(() => {
  fetchDataFromApi("/api/banner?type=home&status=true").then((res) => {

    const bannerData = res?.data || res?.banners || [];

    const activeBanners = bannerData.filter(
      (item) => item.status === true
    );

    setBanners(activeBanners);
  });
}, []);

return (
  <div className="homeBannerSection mt-2">
    
    {banners.length > 0 ? (
      <Swiper
        slidesPerView={1}
        navigation={true}
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Autoplay]}
      >

        {banners.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="banner-slide">
              <div className="container">
                <div className="row align-items-center">

                  <div className="col-md-7">
                      <div className="banner-content">
                    <h1>{item.title}</h1>
                      <p>{item.desc}</p>
                        <button>Visit Collections</button>
                      </div>
                  </div>

                  <div className="col-md-5 text-center">
                        <div className="banner-img">
                      <img src={item.images[0]} alt="banner" />
                      </div>
                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

      </Swiper>
    ) : (
  <div className="no-banner d-flex align-items-center justify-content-center">
  <div className="text-center content">
    <FaRegImages className="icon" />
    <h2>No Banners Available</h2>
    <p>Looks like there are no active banners right now.</p>
    <button className="shop-btn">Explore Products</button>
  </div>
</div>
    )}

  </div>
);
};

export default HomeBanner;