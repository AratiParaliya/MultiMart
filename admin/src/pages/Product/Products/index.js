import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import DashboardBox from "../../Dashboard/components/dashboardBox";

import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";

import { useState } from "react";

import Productlist from "../../../components/Productlist";




const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
            : theme.palette.grey[800];
    
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,

    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },

    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});
    
    
const Products = () => {
    

  const [stats, setStats] = useState({
  orders: 0,
    Category: 0,
 SubCategory:0
});

  useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    const [productsRes, categoryRes, subCategoryRes] = await Promise.all([
     fetch("http://localhost:4000/api/products"),
      fetch("http://localhost:4000/api/category/all"),
      fetch("http://localhost:4000/api/subCategory/all"),
    ]);

   const products = await productsRes.json();
    const categoryData = await categoryRes.json();
    const subCategoryData = await subCategoryRes.json();

    setStats({
     products: products.totalProducts || 0, 
      category: categoryData?.length || 0,
      subCategory: subCategoryData?.length || 0,
    });

  } catch (err) {
    console.log(err);
  }
};
        
    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Product List</h5>

  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Products"
      deleteIcon={<ExpandMoreIcon />}
    />

  </Breadcrumbs>
                </div>
<div className="row dashboardBoxWrapperRow dashboardBoxWrapperRowV2">
  <div className="col-md-12">
    <div className="productdashboardBoxWrapper d-flex">

  <DashboardBox
    color={["#2c78e5", "#60aff5"]}
    icon={<MdShoppingBag />}
    title="Products"
    value={stats.products}
  />

<DashboardBox
  color={["#c012e2", "#eb64fe"]}
  icon={<IoMdCart />}
  title="Total Category"
  value={stats.category}
/>

<DashboardBox
  color={["#1da256", "#48d483"]}
  icon={<MdShoppingBag />}
  title="Total SubCategory"
  value={stats.subCategory}
/>

    </div>
  </div>
                </div>

                <div className="card shadow border-0 p-3 mt-4 w-100">
                 <Productlist/>
                </div>
                </div>
        </>
    )
}

export default Products;