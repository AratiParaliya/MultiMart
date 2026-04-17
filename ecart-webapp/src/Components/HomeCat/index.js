import { Swiper, SwiperSlide } from 'swiper/react';
import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi } from '../../utils/api';

const HomeCat = () => {
  const [categories, setCategories] = useState([]);
const navigate = useNavigate();
  useEffect(() => {
    getCategories();
  }, []);

const getCategories = async () => {
  try {
    const data = await fetchDataFromApi("/api/category/all");

    if (Array.isArray(data)) {
      setCategories(data);
    } else if (data.categoryList) {
      setCategories(data.categoryList);
    } else if (data.categories) {
      setCategories(data.categories);
    } else {
      setCategories([]);
    }

  } catch (error) {
    console.log(error);
  }
};

  return (
    <section className='homeCat'>
      <div className='container'>
        <h3 className='mb-3'>Featured Categories</h3>

        <Swiper
          slidesPerView={8}
          spaceBetween={8}
          navigation={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 },
            1200: { slidesPerView: 6 },
          }}
          modules={[Navigation]}
          className="mySwiper"
        >
          {categories.length > 0 &&
            categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <div
                  className='item text-center cursor'
                  style={{ background: cat.color || "#f5f5f5" }}
                  onClick={() => navigate(`/cat/${cat._id}`)}
                >
                  <img
                    src={cat.images?.[0]?.[0] || "https://via.placeholder.com/100"}
                    alt={cat.name}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <h6>{cat.name}</h6>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>

      </div>
    </section>
  );
};

export default HomeCat;