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
        const catRes = await axios.get("http://localhost:4000/api/category/all");
        const subRes = await axios.get("http://localhost:4000/api/subCategory/all");
        const finalData = catRes.data.map(cat => ({
          ...cat,
          subcategories: subRes.data.filter(sub => sub.category?._id === cat._id)
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');

        nav {
          background: #fff;
          border-bottom: 1px solid #f1f1f1;
          font-family: 'DM Sans', sans-serif;
        }

        /* Category Button Design */
        .allCatTab {
          background: #233a95 !important;
          color: #fff !important;
          border-radius: 30px !important;
          padding: 10px 25px !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          text-transform: uppercase !important;
        }

        /* Sidebar dropdown styling */
        .sidebarNav {
          position: absolute;
          top: 110%;
          left: 0;
          width: 250px;
          background: #fff;
          border: 1px solid #f1f1f1;
          border-radius: 10px;
          z-index: 1000;
          transition: all 0.3s ease;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
        }
        .sidebarNav.open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .sidebarNav ul li {
          list-style: none;
          border-bottom: 1px solid #f1f1f1;
        }
        .sidebarNav button {
          width: 100% !important;
          justify-content: flex-start !important;
          padding: 12px 20px !important;
          color: #343a40 !important;
          font-weight: 500 !important;
          text-transform: capitalize !important;
        }
        .sidebarNav button:hover {
          background: #f8f9fa !important;
          color: #233a95 !important;
        }

        /* Swiper Links Design */
        .nav-link-btn {
          color: #343a40 !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          padding: 15px 20px !important;
          transition: all 0.3s !important;
          position: relative;
        }
        .nav-link-btn:hover {
          color: #233a95 !important;
        }
        
        /* Animated underline for nav items */
        .nav-link-btn::after {
          content: '';
          position: absolute;
          bottom: 10px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #233a95;
          transition: 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link-btn:hover::after {
          width: 40%;
        }

        /* Submenu (Floating outside swiper) */
        .submenu-floating {
          background: #fff;
          border-radius: 8px;
          padding: 10px 0;
          min-width: 180px;
          z-index: 2000;
          border: 1px solid #eee;
          transition: 0.2s ease-in-out;
        }
        .submenu-floating button {
          width: 100% !important;
          justify-content: flex-start !important;
          padding: 8px 20px !important;
          color: #666 !important;
          font-size: 13px !important;
          font-weight: 500 !important;
        }
        .submenu-floating button:hover {
          background: #f0f2f5 !important;
          color: #233a95 !important;
        }

        .categorySwiper .swiper-button-next, 
        .categorySwiper .swiper-button-prev {
          width: 30px !important;
          height: 30px !important;
          background: #fff !important;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .categorySwiper .swiper-button-next::after, 
        .categorySwiper .swiper-button-prev::after {
          font-size: 12px !important;
          font-weight: bold;
          color: #000;
        }
      `}</style>

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