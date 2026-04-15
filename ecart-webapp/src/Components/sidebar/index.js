


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';

const Sidebar = ({setFilters}) => {
    const [value, setValue] = useState([100, 60000]);

  const [categories, setCategories] = useState([]);
const [brands, setBrands] = useState([]);
  const [categoryBanners, setCategoryBanners] = useState([]);
  

  // undefined → error
  useEffect(() => {
    getCategories();
    getBrands();
      getCategoryBanners(); 
  }, []);

  const getCategories = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/subCategory");
        const data = await res.json();

        console.log("API DATA:", data);

   setCategories(data.subcategoryList || []);
    } catch (error) {
      console.log(error);
    }
  };

  const getBrands = async () => {
  const res = await fetchDataFromApi("/api/products/brands");
  setBrands(res.brands);
  };
  
  const getCategoryBanners = async () => {
 const data = await fetchDataFromApi("/api/banner?type=category&status=true");
    setCategoryBanners(data.data || []);
};

    return (
        <>
            <div className="sidebar">
               
                <div className="filterBox">
                    <h6>Product Categories</h6>
                     
                    <div className="scroll">
                   
          <ul>
  {categories?.length > 0 &&
                  categories.map((cat, index) => (
      
      <li key={index}>
        <FormControlLabel
          className="w-100"
          control={
            <Checkbox
  onChange={(e) => {
  const checked = e.target.checked;

  setFilters(prev => ({
    ...prev,
    category: null,   
    subCategory: checked
      ? [...(prev.subCategory || []), cat._id]
      : (prev.subCategory || []).filter(id => id !== cat._id)
  }));
}}
            />
          }
          label={cat.name}
        />
      </li>
    ))}
</ul>
</div>
  
                </div>
                
                  <div className="filterBox ">
                    <h6>Filter by Price</h6>
                   <RangeSlider 
  value={value} 
  onInput={(val) => {
    setValue(val);
    setFilters(prev => ({
      ...prev,
      price: val
    }));
  }}
  min={100} 
  max={60000} 
/>

<div className='d-flex pt-2 pb-2 priceRange'>
  <span>
    From: <strong className='text-success'>Rs: {value[0]}</strong>
  </span>
  <span className='ml-auto'>
    From: <strong className='text-dark'>Rs: {value[1]}</strong>
  </span>
</div>
                </div>
                <div className="filterBox">
                    <h6>Product Status</h6>
                   
          <div className="scroll">
                    <ul>
                            <li>
<FormControlLabel
  control={
    <Checkbox
      onChange={(e) =>
        setFilters(prev => ({
          ...prev,
          stock: e.target.checked
        }))
      }
    />
  }
  label="In Stock"
/>                            </li>
                             <li>
<FormControlLabel
  control={
    <Checkbox
      onChange={(e) =>
        setFilters(prev => ({
          ...prev,
          sale: e.target.checked
        }))
      }
    />
  }
  label="On Sale"
/>                            </li>
                        
                        </ul>

     </div>
                </div>

                <div className="filterBox">
                    <h6>Brands</h6>
                   
          <div className="scroll">
                   <ul>
  {brands.map((brand, index) => (
    <li key={index}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked;

              setFilters(prev => ({
                ...prev,
                  category: null,
               brand: checked
  ? [...(prev.brand || []), brand.toLowerCase()]
  : (prev.brand || []).filter(item => item !== brand.toLowerCase())
              }));
            }}
          />
        }
        label={brand}
      />
    </li>
  ))}
</ul>

     </div>
                </div>

          <br />
          <div className="sticky">
{categoryBanners?.length > 0 &&
  categoryBanners.slice(0, 2).map((banner) => {
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
          </div>
        )}
      </div>
    );
  })}
          </div>
        </div> 
             
        </>
    )
}
export default Sidebar;