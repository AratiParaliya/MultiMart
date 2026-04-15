import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { Navigation, Autoplay } from "swiper/modules";

import slider1 from "../../assets/images/watch-07.png";
import slider2 from "../../assets/images/phone-08.png";
import slider3 from "../../assets/images/hero-img.png";
import slider4 from "../../assets/images/wireless-01.png";

const HomeBanner = () => {

  const sliderData = [
    {
       title: "50% Off For Your First Shopping",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
      
      img: slider1
    },
    {
      title: "50% Off For Your First Shopping",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
      img: slider2
    },
    {
           title: "50% Off For Your First Shopping",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
      img: slider3
    },
    {
      title: "50% Off For Your First Shopping",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis lobortis consequat eu, quam etiam at quis ut convallis.",
      img: slider4
    },
  ];

  return (
   <div className="homeBannerSection mt-2">
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
    {sliderData.map((item, index) => (
      <SwiperSlide key={index}>
        <div className="banner-slide">

          <div className="container">
            <div className="row align-items-center">

              {/* LEFT */}
              <div className="col-md-6">
                <div className="banner-content">
                  <h1>{item.title}</h1>
                  <p>{item.desc}</p>
                  <button>Visit Collections</button>
                </div>
              </div>

              {/* RIGHT */}
              <div className="col-md-6 text-center">
                <div className="banner-img">
                  <img src={item.img} alt="" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
  );
};

export default HomeBanner;