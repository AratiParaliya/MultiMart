import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useEffect, useRef, useState } from "react";
import Rating from "@mui/material/Rating";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from "@mui/material/Button";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import {  IoIosClose } from "react-icons/io"
import CircularProgress from "@mui/material/CircularProgress";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useParams } from "react-router-dom";
import { MyContext } from "../../../App";
import {  useNavigate } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../../utils/api";

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

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 230,
    }
    ,
  },
}


const ProductUpload = () => {

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState();

  const [isLoading, setIsLoading] = useState(false);

  const [productImagesArr, setProductImagesArr] = useState([]);
  const productImages = useRef();
  const [imgFiles, setImgFiles] = useState();
const [previews, setpreviews] = useState([]);
  const [subcategoryVal, setSubCategoryVal] = useState('');
  const [subCategory, setSubCategory] = useState([]);

  const { id } = useParams(); // 👈 get product id
  const isEditMode = Boolean(id);
  
 const [formFields, setFormFields] = useState({
  name: '',
  description: '',
   images: [],
  color:'',
  brand: '',
  price: "",
  oldPrice: "",
  category: '',
  subCategory: '', // ✅ ADD THIS
  countInStock: "",
  rating: "",
   isFeatured: null,
   discount: "",
    specifications: [
    { key: "", value: "" }
  ],
   productRAMS: [],
   productSIZE: [],
  productWEIGHT:[],
 });
  

  
useEffect(() => {
  if (id !== undefined) {
    fetchDataFromApi(`/api/products/${id}`).then((res) => {

      const categoryId = res.category?._id || res.category;
      const subCategoryId = res.subCategory?._id || res.subCategory;

      setFormFields({
        name: res.name,
        description: res.description,
        images: res.images || [],
        color: res.color,
        brand: res.brand,
        price: res.price,
        oldPrice: res.oldPrice,
        category: categoryId,
        subCategory: subCategoryId,
        countInStock: res.countInStock,
        isFeatured: res.isFeatured,
        discount: res.discount || "",
        productRAMS: res.productRAMS || [],
        productSIZE: res.productSIZE || [],
        productWEIGHT: res.productWEIGHT || [],
        specifications: res.specifications?.length
          ? res.specifications
          : [{ key: "", value: "" }]
      });

      // ✅ ADD THIS LINE
  setProductImagesArr(res.images?.flat() || []);

    });
  }
}, [id]);

useEffect(() => {
  fetchDataFromApi("/api/category/all").then((res) => {
    console.log("CATEGORY API:", res);

    const data =
      res?.categoryList ||
      res?.data?.categoryList ||
      (Array.isArray(res) ? res : []);

    setCategories(data);
  });
}, []);

  useEffect(() => {
  if (formFields.category) {
    fetchDataFromApi(`/api/subcategory?category=${formFields.category}`)
      .then((res) => {
        setSubCategory(res?.subcategoryList || []);
      });
  }
}, [formFields.category]);

  useEffect(() => {

    if (!imgFiles) return;

    let tmp = [];
    for (let i = 0; i < imgFiles.length; i++){
      tmp.push(URL.createObjectURL(imgFiles[i]));
    }
    const objectUrls = tmp;
    setpreviews(objectUrls);

    return () => {
  objectUrls.forEach(url => URL.revokeObjectURL(url));
};
  },[imgFiles])

  const context = useContext(MyContext);


const removeImg = (index) => {
  const updated = productImagesArr.filter((_, i) => i !== index);

  setProductImagesArr(updated);

  setFormFields({
    ...formFields,
    images: updated
  });
};

const handleChangeCategory = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    category: value,
    subCategory: ""
  }));

  setSubCategoryVal(""); // reset UI

  fetchDataFromApi(`/api/subcategory?category=${value}`).then((res) => {
    setSubCategory(res?.subcategoryList || []);
  });
};

 const handleSubChangeCategory = (event) => {
  setFormFields((prev) => ({
    ...prev,
    subCategory: event.target.value
  }));
};

const handleChangeisFeaturedValue = (event) => {
  setFormFields((prev) => ({
    ...prev,
    isFeatured: event.target.value === "true"
  }));
};

const handleChangeProductWeight = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productWEIGHT: value
  }));
};

 const handleChangeProductSize = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productSIZE: value
  }));
};
const handleChangeProductRams = (event) => {
  const value = event.target.value;

  setFormFields((prev) => ({
    ...prev,
    productRAMS: value   // ✅ array directly
  }));
};
  
  
  const navigate = useNavigate();

    const inputChange = (e)=> {
    setFormFields(() => ({
    ...formFields,
      [e.target.name]:e.target.value
  }))
  }
  

  const handleSubmit = (e) => {
     
    e.preventDefault();
      setIsLoading(true);

    if (formFields.name === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Name',
      });
    return false;
    }

     if (formFields.description === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product description',
      });
     return false;
    }
    if (productImagesArr.length === 0) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Image',
      });
     return false;
    }
  
    if (formFields.brand === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Brand',
      });
     return false;
    }
     if (formFields.discount === 0 || formFields.discount === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Discount',
      });
     return false;
    }
    if (formFields.price === 0 || formFields.price === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product Price',
      });
     return false;
    }
    if (formFields.oldPrice === 0 || formFields.oldPrice === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please add Product OldPrice',
      });
     return false;
    }
 if (formFields.category === "") {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please select the product category',
  });
  return false;
    }
    if (formFields.subCategory === "") {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please select the product subcategory',
  });
  return false;
}
   if (formFields.isFeatured === null || formFields.isFeatured === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please select the product is a featured or not',
      });
     return false;
    }
if (formFields.countInStock === "" || formFields.countInStock === 0) {
  context.setAlertBox({
    open: true,
    error: true,
    msg: 'Please add stock',
  });
  return false;
}
    // if (!formFields.rating) {
    //   context.setAlertBox({
    //     open: true,
    //     error: true,
    //     msg: 'Please add Rating'
    //   });
    //  return false;
    // }
    
      
    const data = {
  ...formFields,
  images: productImagesArr
    };
     if (isEditMode) {
    editData(`/api/products/${id}`, data).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product Updated Successfully",
      });

      setIsLoading(false);
      navigate('/products');
    });

  } else {
    // ✅ ADD MODE
    postData('/api/products/create', data).then((res) => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product Created Successfully",
      });

      setIsLoading(false);
      navigate('/products');
       setFormFields({
      name: '',
      description: '',
      images: [],
      color:'',
      brand: '',
      price: "",
      oldPrice: "",
      category: '',
      subCategory: '',
      countInStock: "", 
      isFeatured: "",
       discount: "",
   productRAMS: [],
   productSIZE: [],
         productWEIGHT: [],
  
    })
    });
  }
 


  };
  
const onChangeFile = async (e) => {
  try {
    const files = e.target.files;

     const formdata = new FormData();

    for (let i = 0; i < files.length; i++) {
       formdata.append("images", files[i]);
    }
    console.log(files);        // should show selected files
console.log(formdata.getAll("images")); // VERY IMPORTANT

    setUploading(true);

 const res = await postData('/api/products/upload', formdata);
    console.log("UPLOAD RESPONSE:", res);
    

if (res?.images) {
  setProductImagesArr(prev => {
    const updated = [...prev, ...res.images];

    setFormFields((prevFields) => ({
      ...prevFields,
      images: updated
    }));

    return updated;
  });
}

    setUploading(false);

  } catch (error) {
    // console.log(error);
    setUploading(false);
  }
  };
  

// add new row
const addSpecification = () => {
  setFormFields(prev => ({
    ...prev,
    specifications: [...prev.specifications, { key: "", value: "" }]
  }));
};

// remove row
const removeSpecification = (index) => {
  const updated = formFields.specifications.filter((_, i) => i !== index);

  setFormFields(prev => ({
    ...prev,
    specifications: updated
  }));
};

// handle change
const handleSpecChange = (index, field, value) => {
  const updated = [...formFields.specifications];
  updated[index][field] = value;

  setFormFields(prev => ({
    ...prev,
    specifications: updated
  }));
};

    return (
        <>
                 <div className="right-content w-100">
                        <div className="card shadow border-0 w-100 flex-row p-4">
           <h5 className="mb-0">
  {isEditMode ? "Edit Product" : "Product Upload"}
</h5>
            
              <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                
                <StyledBreadcrumb
                  component="a"
                  href="#"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
            
                        <StyledBreadcrumb
                             component="a"
                            label="Products"
                             href="#"
                  deleteIcon={<ExpandMoreIcon />}
                        />
                        
                        <StyledBreadcrumb
                            label="Product Upload"
                  deleteIcon={<ExpandMoreIcon />}
                />
            
              </Breadcrumbs>
                            </div>
            
          <form className="form"  onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="card p-4 mt-0">
                  <h5 className="mb-4">Basic Information</h5>
                  
                  <div className="form-group">
                    <h6>Product Name</h6>
                    <input type="text" name="name" value={formFields.name} onChange={inputChange} placeholder="type here...."/>
                  </div>

                   <div className="form-group">
                    <h6>Description</h6>
                    <textarea rows={5} cols={10} value={formFields.description} name="description" onChange={inputChange} />
                  </div>

                  <div className="row">     
                <div className="col">
                  <div className="form-group">
                   <h6>CATEGORY</h6>
                   <Select
          value={formFields.category}
          onChange={handleChangeCategory}
 MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 250,   // 👈 controls dropdown height
        overflowY: "auto" // 👈 enables scroll
      }
    }
  }}
          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
           <MenuItem value="">
    <em>Select</em>
  </MenuItem>

                          {
                           categories?.map((cat) => (
  <MenuItem key={cat._id} value={cat._id}>
    {cat.name}
  </MenuItem>
))
                          }
                                </Select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                   <h6>SUBCATEGORY</h6>
                   <Select
     value={formFields.subCategory}
          onChange={handleSubChangeCategory}
 MenuProps={{
    PaperProps: {
      sx: {
        maxHeight: 250,   // 👈 controls dropdown height
        overflowY: "auto" // 👈 enables scroll
      }
    }
  }}
          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
           <MenuItem value="">
    <em>Select</em>
  </MenuItem>

                          {
                            subCategory?.length!==0 && subCategory.map((subcat, index) => (
    <MenuItem key={index} value={subcat._id}>
      {subcat.name} 
    </MenuItem>
                            ))
                          }
                                </Select>
                  </div>
                </div>
                <div className="col">

                     <div className="form-group">
                   <h6>Brand</h6>
                     <input type="text" name="brand" value={formFields.brand} onChange={inputChange} placeholder="type here..."/>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <h6>Regular Price</h6>
                      <input type="text" name="price" value={formFields.price} onChange={inputChange} placeholder="type here"/>
                  </div>
                </div>
                
                <div className="col">
                  <div className="form-group">
                    <h6>Old Price</h6>
                      <input type="text" name="oldPrice" value={formFields.oldPrice} onChange={inputChange} placeholder="type here"/>
                  </div>
                    </div>
                    <div className="col">
                  <div className="form-group">
                    <h6>Discount</h6>
                      <input type="text" name="discount" value={formFields.discount} onChange={inputChange} placeholder="type here"/>
                  </div>
                  </div>
              </div>
              
                  <div className="row">
                    <div className="col">
                  <div className="form-group">
                    <h6>Product Stock</h6>
                      <input type="text" name="countInStock" value={formFields.countInStock} onChange={inputChange} placeholder="type here"/>
                  </div>
                  </div>
                <div className="col">
                  <div className="form-group">
                    <h6 className="text-uppercase">isFeatured</h6>
                       <Select
  value={formFields.isFeatured ?? ""}
  onChange={handleChangeisFeaturedValue}
  displayEmpty
  className="w-100"
>
  <MenuItem value="">
    <em>Select</em>
  </MenuItem>

 <MenuItem value="true">True</MenuItem>
<MenuItem value="false">False</MenuItem>
</Select>
                  </div>
                </div>
                 
                 <div className="col">
                  <div className="form-group">
                    <h6 className="text-uppercase">ProductRAMS</h6>
                        <Select
                           multiple 
         value={formFields.productRAMS}
          onChange={handleChangeProductRams}
                          displayEmpty
                      renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ""}
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
          <MenuItem value="">
            <em value="">Select</em>
          </MenuItem>
          <MenuItem value={"8GB"}>8GB</MenuItem>
                          <MenuItem value={"6GB"}>6GB</MenuItem>
                            <MenuItem value={"4GB"}>4GB</MenuItem>
                      
                          <MenuItem value={"12GB"}>12GB</MenuItem>
                             <MenuItem value={"10GB"}>10GB</MenuItem>
        
                                </Select>
                  </div>
                </div>
                  </div>
              
                   <div className="row">
                <div className="col">
                  <div className="form-group">
                    <h6>Product Color</h6>
                                        <input type="text" name="color" value={formFields.color} onChange={inputChange} placeholder="type here"/>

                  </div>
                    </div>
                 
                  <div className="col">
                  <div className="form-group">
                    <h6 className="text-uppercase">ProductWEIGHT</h6>
                       <Select
  multiple
  value={formFields.productWEIGHT}
  onChange={handleChangeProductWeight}
renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ""}
  className="w-100"
>
  <MenuItem value="500GM">500GM</MenuItem>
  <MenuItem value="1KG">1KG</MenuItem>
  <MenuItem value="2KG">2KG</MenuItem>
  <MenuItem value="3KG">3KG</MenuItem>
</Select>
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <h6 className="text-uppercase">ProductSIZE</h6>
                     <Select
  multiple
  value={formFields.productSIZE}
  onChange={handleChangeProductSize}
renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ""}
  className="w-100"
>
  <MenuItem value="S">S</MenuItem>
  <MenuItem value="M">M</MenuItem>
  <MenuItem value="L">L</MenuItem>
  <MenuItem value="XL">XL</MenuItem>
                          <MenuItem value="XXL">XXL</MenuItem>
                          <MenuItem value="S">S</MenuItem>
                          
  <MenuItem value="Small">Small</MenuItem>
  <MenuItem value="MEdium">Medium</MenuItem>
                          <MenuItem value="Large">Large</MenuItem>
                          
                          <MenuItem value="IND-4">IND-4</MenuItem>
                          <MenuItem value="IND-5">IND-5</MenuItem>
                            <MenuItem value="IND-6">IND-6</MenuItem>
                              <MenuItem value="IND-7">IND-7</MenuItem>
                          <MenuItem value="IND-8">IND-8</MenuItem>

                            <MenuItem value="28">28</MenuItem>
  <MenuItem value="30">30</MenuItem>
                          <MenuItem value="32">32</MenuItem>
                          <MenuItem value="34">34</MenuItem>
                          <MenuItem value="36">36</MenuItem>
                          
</Select>
                  </div>
                </div>
                  </div>

<div className="card p-4 mt-3">
  <h5 className="mb-4">Product Specifications</h5>

  {
    (formFields.specifications || []).map((spec, index) => (
      <div className="row mb-2" key={index}>
        
        {/* Key */}
        <div className="col w-100">
          <input
            type="text"
            placeholder="e.g. Color"
            value={spec.key}
            onChange={(e) =>
              handleSpecChange(index, "key", e.target.value)
            }
          />
        </div>

        {/* Value */}
        <div className="col w-100">
          <input
            type="text"
            placeholder="e.g. Red"
            value={spec.value}
            onChange={(e) =>
              handleSpecChange(index, "value", e.target.value)
            }
          />
        </div>

        {/* Remove Button */}
        <div className="col-auto d-flex align-items-center">
          <Button
            variant="outlined"
            color="error"
            onClick={() => removeSpecification(index)}
          >
            Remove
          </Button>
        </div>

      </div>
    ))
  }

  {/* Add Button */}
  <Button
    variant="contained"
    className="mt-2"
    onClick={addSpecification}
  >
    + Add Specification
  </Button>
</div>
              
              <div className="card p-4">
<div className="imagesUploadSec">
  <h5 className="mb-4">Media And Published</h5>

  <div className="imgUploadBox d-flex align-items-center">

    {
   productImagesArr.map((img, index) => (
                  <div className="uploadBox" key={index}>
                    <span className="remove" onClick={() => removeImg(index)}>X</span>

                    <div className="box">
                   <img
  src={img}
  className="w-100"
  alt="img"
/>
                    </div>
                  </div>
                ))
    }

    {/* Upload Button */}
    <div className="uploadBox">

      {
        uploading === true ?
        <div className="progressBar">
          <CircularProgress />
          <span>Uploading...</span>
        </div>
        :
        <>
        <input
  type="file"
  multiple
  onChange={(e) => {
    onChangeFile(e);
    e.target.value = null; 
  }}
  name="images"
/>

          <div className="info">
            <FaRegImages />
            <h5>image upload</h5>
          </div>
        </>
                        }
                    

    </div>

  </div>

  <Button type="submit" className="btn-blue btn-lg w-100 mt-4">
    <FaCloudUploadAlt /> &nbsp; Publish and View
  </Button>
</div>

         
</div>
                 </div>
    
               
</div>
       </div>
            
            </form>
                           
                            </div>
        </>
    )
}
export default ProductUpload;