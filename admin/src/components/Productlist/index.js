import { FaDivide, FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";

import { MdDelete, MdShoppingBag } from "react-icons/md";

import Button from "@mui/material/Button";

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";

import { useLocation } from "react-router-dom";


const Productlist = () => {

    const context = useContext(MyContext);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [showBy, setshowBy] = useState('')
    
    const [catBy, setCatBy] = useState('');
 const [productData, setProductData] = useState([]);
  const [categories, setCategories] = useState([]);
 
const searchQuery = context.searchQuery;

    

useEffect(() => {
  context.setProgress(40);

  let url = `/api/products?page=1&limit=${showBy || 10}`;

  if (catBy) {
    url += `&category=${catBy}`;
  }

  // ✅ INSTANT SEARCH
  if (searchQuery && searchQuery.trim() !== "") {
    url += `&search=${searchQuery}`;
  }

  console.log("FINAL API URL:", url);

  fetchDataFromApi(url).then((res) => {
    setProductData(res);
    context.setProgress(100);
  });

}, [showBy, catBy, searchQuery]); 


 useEffect(() => {
  fetchDataFromApi("/api/category/all").then((res) => {
    console.log("FULL RESPONSE:", res);
    setCategories(res);
  });
}, []);
    

const handleShowBy = (value) => {
  setshowBy(value);
};

const handleCategoryBy = (value) => {
  setCatBy(value);
  };
  

const handleChange = (event, value) => {
  context.setProgress(40);

  fetchDataFromApi(
    `/api/products?page=${value}&limit=${showBy || 10}&category=${catBy || ""}&search=${searchQuery || ""}`
  ).then((res) => {
    setProductData(res);
    context.setProgress(100);
  });
};

        const deleteProduct = (id) => {
            
             deleteData(`/api/products/${id}`).then((res) => {
fetchDataFromApi(`/api/products?page=${productData?.page || 1}`).then((res)=>{
    setProductData(res);
     context.setAlertBox({
        open: true,
        error:false,
        msg: 'The Product deleted successfully',
      });
                    
            })
             })
    }

   const products = Array.isArray(productData?.products)
  ? productData.products
  : [];
    return (
        <>

                    <h3 className="hd">Best Selling Products</h3>
                    <div className="row cardFilters mt-3">
                        <div className='col-md-3'>
                            <h4>Show By</h4>
                               <FormControl  size="small" className="w-100">
                             <Select
          value={showBy}
          onChange={(e) => handleShowBy(e.target.value)}
          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                
                                
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Show 10</MenuItem>
    <MenuItem value={20}>Show 20</MenuItem>
    <MenuItem value={30}>Show 30</MenuItem>
    <MenuItem value={50}>Show 50</MenuItem>
                                </Select>
                                </FormControl>
                            
                        </div>

                         <div className='col-md-3'>
                            <h4>CATEGORY BY</h4>
                          <FormControl size="small" className="w-100">
  <Select
    value={catBy}
    onChange={(e) => handleCategoryBy(e.target.value)}
    displayEmpty
    className="w-100"
  >
    <MenuItem value="">
      <em>All</em>
    </MenuItem>

    {categories?.map((cat, index) => (
      <MenuItem key={index} value={cat._id}>
        {cat.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
                            
                        </div>


                    </div>


                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered v-align">
                            <thead className="thead-dark">
                                <tr >
                                    <th>UID</th>
                                    <th style={{width:"300px"}}>Product</th>
                <th>Category</th>
                <th>SubCategory</th>
                                   <th>Brand</th>                                    
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Product Color</th>                                  
                                    <th>Order</th>
                                    <th>Sales</th>
                                     <th>Action</th>
                                </tr>
                            </thead>
                    <tbody>
                        
                        {

                           products?.length > 0 ? (
      products.map((item, index) => (
                               
                                    <tr key={item._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <Checkbox{...label} />     <span> {index + 1}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex productBox align-items-center">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                      <img
  src={
    Array.isArray(item.images)
      ? (Array.isArray(item.images[0]) ? item.images[0][0] : item.images[0])
      : item.images
  }
  className="w-100"
/>
                                                    </div>
                                                </div>

                                                <div className="info">
                                                    <h6>{ item.description}</h6>
                                               
                                              
                                                </div>
                                            </div>
                                       
                                    
                                        </td>
          <td>{item.category?.name}</td>
       <td>{item.subCategory?.name}</td>
                                        <td>{item.brand}</td>
                                        <td>
                                            <div style={{ width: '70p' }}>
                                                <span className="old">{ item.oldPrice}</span>
                                                <span className="new text-danger"> {item.price} </span>
                                            </div>
                                        </td>
                                        <td>{ item.countInStock}</td>
                                        <td>{item.color}
                                           </td>
          <td>{ item.totalOrder}</td>
          <td>{item.totalSales} </td>
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                               <Link to={`/product/details/${item._id}`}>
                                                    <Button className="secondary" color="secondary"><FaEye /></Button>
                                        
              </Link>
                   <Link to={`/product/upload/${item._id}`}>
                                                                    <Button className="success" color="success" ><FaPencilAlt/></Button></Link>

                                            <Button className="error" color="error" onClick={()=>deleteProduct(item._id)}><MdDelete/></Button>
                                            </div>
                                        </td>

                                    </tr>
                                
                           )
                           )): (
      <tr>
        <td colSpan="11" className="text-center py-4">
          <h5 className="text-muted">No Products Found 😔</h5>
        </td>
      </tr>
    )
                            
                        }
                       
                              
                                </tbody>                                                    

                        </table>
                         <div className="d-flex tableFooter">
<p>showing <b>{products.length}</b> of <b>{productData?.totalProducts}</b> products</p>                                                   <Pagination count={productData?.totalPages} color="primary" className="pagination" onChange={handleChange}
                                                   showFirstButton showLastButton/>
                       </div>
                    </div>

 
                
        </>
    )
}
export default Productlist;