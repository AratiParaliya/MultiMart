import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import { IoIosMenu } from 'react-icons/io';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation as SwiperNavigation, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { fetchDataFromApi } from '../../utils/api';

const Navigation = () => {
  const [isOpenSidebarVal, setisOpenSidebarVal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [activeCat, setActiveCat] = useState(null);
  const [submenuPos, setSubmenuPos] = useState({ left: 0, top: 0 });
  const navPart2Ref = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const CAT_META = {
  Fashion:        { icon: '👗', accent: '#fce7f3' },
  Electronics:    { icon: '📱', accent: '#dbeafe' },
  'Home & Living':{ icon: '🏠', accent: '#fef9c3' },
  Beauty:         { icon: '💄', accent: '#ede9fe' },
  Sports:         { icon: '⚽', accent: '#dcfce7' },
  Books:          { icon: '📚', accent: '#fef3c7' },
  Toys:           { icon: '🧸', accent: '#fce7f3' },
  Grocery:        { icon: '🛒', accent: '#d1fae5' },
  Travel:         { icon: '✈️', accent: '#e0f2fe' },
  Automotive:     { icon: '🚗', accent: '#fee2e2' },
};
const getMeta = (name = '') => CAT_META[name] || { icon: '🏷️', accent: '#f1f5f9' };
  
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const catRes = await fetchDataFromApi("/api/category/all");
      const subRes = await fetchDataFromApi("/api/subCategory/all");

      const categories = catRes?.data || catRes || [];
      const subCategories = subRes?.data || subRes || [];

      const finalData = categories.map(cat => ({
        ...cat,
        subcategories: subCategories.filter(
          sub => sub.category?._id === cat._id
        )
      }));

      setCategories(finalData);

    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);

  return (
    <>
      

      <nav>
        <div className="container">
          <div className="row d-flex align-items-center">
            
            {/* Sidebar Toggle Area */}
            <div className="navPart1 col-sm-3">
              <div className="catWrapper" style={{ position: 'relative' }}>
                <Button 
                  className="allCatTab" 
                  onClick={() => setisOpenSidebarVal(!isOpenSidebarVal)}
                >
                  <IoIosMenu style={{ fontSize: '20px', marginRight: '8px' }} />
                  ALL CATEGORIES
                  <FaAngleDown style={{ fontSize: '12px', marginLeft: 'auto' }} />
                </Button>

                <div className={`sidebarNav shadow-lg ${isOpenSidebarVal ? 'open' : ''}`}>
                     <ul>
                <li>
                  <button className="sidebar-btn" onClick={() => { setSidebarOpen(false); navigate('/cat'); }}>
                    <span className="sidebar-icon" style={{ background: '#e8f0fc' }}>🏪</span>
                    View All
                    <svg className="sidebar-arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </li>
                <li><div className="sidebar-divider" /></li>

                {categories.map((cat, i) => {
                  const { icon, accent } = getMeta(cat.name);
                  return (
                    <li key={i}>
                      <button
                        className="sidebar-btn"
                        onClick={() => { setSidebarOpen(false); navigate(`/cat/${cat._id}`); }}
                      >
                        <span className="sidebar-icon" style={{ background: accent }}>{icon}</span>
                        {cat.name}
                        {cat.subcategories?.length > 0 && (
                          <svg className="sidebar-arr" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                        )}
                      </button>
                    </li>
                  );
                })}

                <li>
                  <span className="sidebar-view-all" onClick={() => { setSidebarOpen(false); navigate('/cat'); }}>
                    BROWSE ALL →
                  </span>
                </li>
              </ul>
                </div>
              </div>
            </div>

            {/* Main Swiper Navigation */}
            <div className="navPart2 col-sm-9 d-flex align-items-center" ref={navPart2Ref}>
              <div className="swiperWrapper" style={{ width: '100%' }}>
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={0}
                  freeMode={true}
                  modules={[SwiperNavigation, FreeMode]}
                  navigation={true}
                  className="categorySwiper"
                >
                  <SwiperSlide style={{ width: "auto" }}>
                    <Link to="/"><Button className="nav-link-btn">HOME</Button></Link>
                  </SwiperSlide>

                  {categories?.map((cat, index) => (
                    <SwiperSlide key={index} style={{ width: "auto" }}>
                      <div
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const parentRect = navPart2Ref.current.getBoundingClientRect();
                          setActiveCat(cat);
                          setSubmenuPos({
                            left: rect.left - parentRect.left + rect.width / 2,
                            top: rect.bottom - parentRect.top
                          });
                        }}
                        onMouseLeave={() => setActiveCat(null)}
                      >
                        <Link to={`/cat/${cat._id}`}>
                          <Button className="nav-link-btn">
                            {cat.name}
                            {cat.subcategories?.length > 0 && <FaAngleDown style={{ fontSize: '10px', marginLeft: '5px' }} />}
                          </Button>
                        </Link>
                      </div>
                    </SwiperSlide>
                  ))}

                  <SwiperSlide style={{ width: "auto" }}>
                    <Link to="/contact"><Button className="nav-link-btn">CONTACT</Button></Link>
                  </SwiperSlide>
                </Swiper>
              </div>

              {/* Dynamic Submenu */}
              {activeCat?.subcategories?.length > 0 && (
                <div
                  className="submenu-floating shadow-lg"
                  style={{
                    position: "absolute",
                    top: submenuPos.top,
                    left: submenuPos.left,
                    transform: "translateX(-50%)"
                  }}
                  onMouseEnter={() => setActiveCat(activeCat)}
                  onMouseLeave={() => setActiveCat(null)}
                >
                  {activeCat.subcategories.map((sub, i) => (
                    <Link key={i} to={`/subcat/${sub._id}`}>
                      <Button>{sub.name}</Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;