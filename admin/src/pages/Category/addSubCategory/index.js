import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useState } from "react";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from "@mui/material/Button";

import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { fetchDataFromApi, postData } from "../../../utils/api";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { editData } from "../../../utils/api";


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




const AddSubCategory = () => {



  const { id } = useParams();
const isEdit = Boolean(id);
  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [subcategory, setSubcategory] = useState('');
  const [subCategoryImagesArr, setSubCategoryImagesArr] = useState([]);
    const [uploading, setUploading] = useState(false);
      const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  
  useEffect(() => {
  fetchDataFromApi("/api/subCategory/all").then((res) => {
    setSubCategories(res || []);
  });
}, []);
const [formFields, setFormFields] = useState({
  name: '',
  images: [],
  category: ''   // ✅ add this
});

  
  useEffect(() => {
  if (id) {
    fetchDataFromApi(`/api/subCategory/${id}`).then((res) => {
      setFormFields({
        name: res.name,
        category: res.category?._id || res.category,
        images: res.images || []
      });

      setSubCategoryImagesArr(res.images || []);
      setSubcategory(res.category?._id || res.category);
    });
  }
  }, [id]);
  

  useEffect(() => {
  if (!formFields.name || !formFields.category) return;

  const exists = subCategories.some((item) =>
    item.name.toLowerCase().trim() === formFields.name.toLowerCase().trim() &&
    (item.category?._id || item.category) === formFields.category &&
    item._id !== id
  );

  if (exists) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Already exists ⚠️"
    });
  }

}, [formFields.name, formFields.category]);
  // ================= INPUT =================
  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    });
  };


  // ================= REMOVE IMAGE =================
  const removeImg = (index) => {
    const updated = subCategoryImagesArr.filter((_, i) => i !== index);

 setSubCategoryImagesArr(updated);

    setFormFields({
      ...formFields,
      images: updated
    });
  };

  // ================= IMAGE UPLOAD =================
  const onChangeFile = async (e) => {
    try {
      const files = e.target.files;
      const formdata = new FormData();

      for (let i = 0; i < files.length; i++) {
        formdata.append("images", files[i]);
      }

      setUploading(true);

      const res = await postData('/api/subCategory/upload', formdata);

      if (res?.images) {
        const newImages = [...subCategoryImagesArr, ...res.images];

        setSubCategoryImagesArr(newImages);

        setFormFields((prev) => ({
          ...prev,
          images: newImages
        }));
      }

      setUploading(false);

    } catch (error) {
      setUploading(false);
    }
  };

  // ================= SUBMIT =================
const addSubCategory = (e) => {
  e.preventDefault();

  if (
    formFields.name.trim() !== "" &&
    subCategoryImagesArr.length !== 0 &&
    formFields.category !== ""
  ) {

    // ✅ DUPLICATE CHECK
    const isDuplicate = subCategories.some((item) =>
      item.name.toLowerCase().trim() === formFields.name.toLowerCase().trim() &&
      (item.category?._id || item.category) === formFields.category &&
      item._id !== id // ✅ allow self edit
    );

    if (isDuplicate) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "SubCategory already exists in this category ❌"
      });
      return;
    }

    setIsLoading(true);

    const data = {
      ...formFields,
      images: subCategoryImagesArr
    };

    if (isEdit) {
      editData(`/api/subCategory/${id}`, data).then(() => {
        setIsLoading(false);
        navigate('/subcategoryList');

        context.setAlertBox({
          open: true,
          error: false,
          msg: 'SubCategory updated successfully'
        });
      });

    } else {
      postData('/api/subCategory/create', data).then(() => {
        setIsLoading(false);
        navigate('/subcategoryList');

        context.setAlertBox({
          open: true,
          error: false,
          msg: 'SubCategory created successfully'
        });
      });
    }

  } else {
    context.setAlertBox({
      open: true,
      error: true,
      msg: 'Please fill all details'
    });
  }
};

   useEffect(() => {
  fetchDataFromApi("/api/category/all").then((res) => {
    console.log("CATEGORIES:", res);
    setCategories(Array.isArray(res) ? res : []);
  });
}, []);
    
  const handleChangeCategory = (event) => {
  setSubcategory(event.target.value);

  setFormFields((prev) => ({
    ...prev,
    category: event.target.value
  }));
};

    
  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4">
          {isEdit ? "Update SubCategory" : "Publish and View"}
                 <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                              
                              <StyledBreadcrumb
                                component="a"
                                href="#"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                              />
                          
                                      <StyledBreadcrumb
                                           component="a"
                                          label="SubCategory"
                                           href="#"
                                deleteIcon={<ExpandMoreIcon />}
                                      />
                                      
                                      <StyledBreadcrumb
                                          label="SubCategory Upload"
                                deleteIcon={<ExpandMoreIcon />}
                              />
                          
                            </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addSubCategory}>
        <div className="card p-4">

          {/* NAME */}
          <div className="form-group">
            <h6>SubCategory Name</h6>
            <input type="text" name="name"   value={formFields.name} onChange={changeInput} />
          </div>

          {/* COLOR */}
         
                  <div className="form-group">
                   <h6>CATEGORY</h6>
                   <Select
          value={subcategory}
      onChange={handleChangeCategory}

          displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className="w-100"
                        >
                            
                                
           <MenuItem value="">
    <em>Select</em>
  </MenuItem>

                          {
                            categories?.length!==0 && categories.map((cat, index) => (
    <MenuItem key={index} value={cat._id}>
      {cat.name} 
    </MenuItem>
                            ))
                          }
                                </Select>
                  </div>
               

          {/* IMAGE SECTION */}
          <div className="card p-4 mt-4">
            <h5 className="mb-4">Category Images</h5>

            <div className="imgUploadBox d-flex align-items-center">

              {
                subCategoryImagesArr.map((img, index) => (
                  <div className="uploadBox" key={index}>
                    <span className="remove" onClick={() => removeImg(index)}>X</span>

                    <div className="box">
                      <img src={img} className="w-100" alt="img" />
                    </div>
                  </div>
                ))
              }

              {/* Upload */}
              <div className="uploadBox">
                {
                  uploading ? (
                    <div className="progressBar">
                      <CircularProgress />
                      <span>Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={onChangeFile}
                      />
                      <div className="info">
                        <FaRegImages />
                        <h5>Upload</h5>
                      </div>
                    </>
                  )
                }
              </div>

            </div>
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="btn-blue btn-lg w-100 mt-4">
  <FaCloudUploadAlt />
  &nbsp;
  {
    isLoading 
      ? <CircularProgress color="inherit" size={20} /> 
      : (isEdit ? "Update SubCategory" : "Publish and View")
  }
</Button>

        </div>
      </form>
    </div>
  );
};
export default AddSubCategory;