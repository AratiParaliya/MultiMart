import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button"; 
import { Link } from "react-router-dom";
import Banner from "../../Components/banner";
import { useEffect, useState } from "react";
import { fetchDataFromApi, deleteData } from "../../utils/api"; 
import ProductItem from "../../Components/ProductItem";


const Wishlist = () => {
    

const [products, setProducts] = useState([]);
const [page, setPage] = useState(1);

const itemsPerPage = 16;   // ✅ MOVE HERE FIRST

const indexOfLast = page * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;

const currentProducts = products.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(products.length / itemsPerPage);

const handlePageChange = (event, value) => {
  setPage(value);
    };
    

    
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
  const getWishlist = async () => {
    if (!user?._id) return;

    const res = await fetchDataFromApi(`/api/wishlist/${user._id}`);

    if (!res.error) {
      // backend gives: { items: [{product: {...}}] }
      const productList = res.items.map(item => item.product);
      setProducts(productList);
    }
  };

  getWishlist();
    }, []);
    

    return (
        <>
               <div className="product_Listing_Page">
                <div className="container">

                       <Banner title="My Wishlist"></Banner>
                       
                       
                       
                       
{products.length > 0 ? (
  <div className="wishlistproductListing mt-4"> {/* ✅ ONLY ONE GRID */}
    {currentProducts.map((item) => (
      item && item._id && (
        <div key={item._id}>
          <ProductItem item={item} />
        </div>
      )
    ))}
  </div>
) : (
  <div className="card shadow-sm border-0 w-100 mt-4">
  <div className="card-body text-center py-5">

    {/* IMAGE ICON */}
    <div className="mb-3">
      <img
        src="https://cdn-icons-png.flaticon.com/128/4689/4689916.png"
        alt="empty wishlist"
        style={{ width: "80px", opacity: 0.8 }}
      />
    </div>

    {/* TITLE */}
    <h5 className="text-muted mb-2">Your Wishlist is Empty</h5>

    {/* SUBTEXT */}
    <p className="text-muted small mb-3">
      Save items you love to your wishlist and find them easily later.
    </p>

    {/* BUTTON */}
    <Link to="/">
      <Button className="btn-blue btn-sm" variant="outlined">
        Continue Shopping
      </Button>
    </Link>

  </div>
</div>
    
    )
  }
</div>
<div className="d-flex align-items-center justify-content-center mt-5">
  <Pagination
    count={totalPages}
    page={page}
    onChange={handlePageChange}
    color="primary"
    size="large"
  />
</div>

                      
                        
            
    
             </div> 
        </>
    )
}
export default Wishlist;