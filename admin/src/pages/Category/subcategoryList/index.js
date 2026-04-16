import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {  FaPencilAlt} from "react-icons/fa";

import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { useRef, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useEffect } from "react";
import { deleteData, editData, fetchDataFromApi, postData } from "../../../utils/api";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../../App";
import { SearchContext } from "../../../context/SearchContext";



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
    
    
const SubCategoryList = () => {

    const [subCatData, setsubCatData] = useState([]);
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subcategory, setSubcategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState(null);
  const [subCatImagesArr, setSubCatImagesArr] = useState([]);
  const fileInputRef = useRef();
    const [formFields, setFormFields] = useState({
        name:"",
        images :'',
        category:"",
    })
    const context = useContext(MyContext);
     const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const { searchQuery } = useContext(SearchContext);
    
  useEffect(() => {
  window.scrollTo(0, 0);
  context.setProgress(20);

  // ✅ SubCategory list
  fetchDataFromApi("/api/subCategory").then((res) => {
    setsubCatData(res);
    context.setProgress(100);
  });

  // ✅ ADD THIS (Category list)
  fetchDataFromApi("/api/category").then((res) => {
  setCategories(res?.categoryList || []);
  });

}, []);


    const handleClose = () => {
    setOpen(false)
    }



const SubCategoryEditFun = (e) => {
  e.preventDefault();
  setIsLoading(true);

  const data = {
    ...formFields,
      images: subCatImagesArr // ✅ send array
    
  };

  editData(`/api/subCategory/${editId}`, data)
    .then(() => fetchDataFromApi("/api/subCategory"))
    .then((data) => {
      setsubCatData(data);
      setOpen(false);
      setIsLoading(false);  setSubCatImagesArr(data.images || []);
         context.setAlertBox({
        open: true,
        error:false,
        msg: 'Update SubCategory  successfully',
      }); 
    })
    .catch((err) => {
      console.log(err);
        setIsLoading(false);
        
    });
    
 
  };
  


 const filteredData = subCatData.subcategoryList?.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const dataToShow = searchQuery ? filteredData : subCatData.subcategoryList;

  const handleChangeCategory = (event) => {
  setSubcategory(event.target.value);

  setFormFields((prev) => ({
    ...prev,
    category: event.target.value
  }));
};

    const changeInput = (e) => {
        setFormFields(() => (
            {
                ...formFields,
                [e.target.name]:e.target.value
            }
        ))
    }

    const addImgUrl = (e) => {
    setFormFields({
        ...formFields,
        images: [e.target.value]
    });
}
const editSubCategory = (id) => {
  setOpen(true);
  setEditId(id);

  fetchDataFromApi(`/api/subCategory/${id}`).then((res) => {
    setFormFields({
      name: res.name,
      category: res.category?._id || res.category, // ✅ fix category
    });

    setSubCatImagesArr(res.images || []); // ✅ FIXED
  });
};
    
   const onChangeFile = async (e) => {
  try {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    const res = await postData('/api/subCategory/upload', formData);

    if (res?.images) {
      setSubCatImagesArr(prev => [...prev, ...res.images]);
    }

  } catch (err) {
    console.log(err);
  }
  };
  
  
const deleteSubCategory = (id) => {
  deleteData(`/api/subCategory/${id}`).then(() => {

    setsubCatData((prev) => ({
      ...prev,
      subcategoryList: prev.subcategoryList.filter(item => item._id !== id)
    }));

    context.setAlertBox({
      open: true,
      error: false,
      msg: 'The SubCategory deleted successfully',
    });
  });
};

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/subCategory?page=${value}`).then((res) => {
            setsubCatData(res);
              context.setProgress(0);
          
        })
    };

    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">SubCategory List</h5>

                    <div className="ml-auto d-flex align-items-center">
  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
                            label="SubCategory List"
      deleteIcon={<ExpandMoreIcon />}
    />

                        </Breadcrumbs>
                        
                        <Link to="/SubCategory/add"><Button className="btn-blue  ml-3 p-3 pr-3" style={{ height: "5px" }}>Add SubCategory</Button>
                        </Link>
                    </div>
                    </div>

                <div className="card shadow border-0 p-3 mt-4 w-100">   


                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered v-align ">
                            <thead className="thead-dark">
                                <tr>
                                    <th>UID</th>
                                        <th  style={{width:"300px"}} >Images</th>
                                    <th >SubCategory</th>
                                
                                   <th >Category</th>                                    
                                     <th style={{width:"150px"}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                     dataToShow?.length > 0 ? (
    dataToShow.map((item, index) => (
                                       
                                             <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                                        <Checkbox{...label} />     <span> # {index + 1}</span>
                                </div>
                                                </td>
                                                 <td>
                                        <div className="d-flex SubCategoryBox align-items-center">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src={item.images[0] || "/no-image.png"} className="w-100"/>
                                                </div>
                                                        </div>
                                                        
                                        </div>
                                       
                                    
                                    </td>
                                                 <td> {item.name} </td>
                                   
                                            
<td>{item.category?.name}</td>                                        
                                    <td>
                                <div className="actions d-flex align-items-center">
                                  <Link to={`/subcategory/add/${item._id}`}>
  <Button className="success" color="success">
    <FaPencilAlt />
  </Button>
</Link>

<Button
  className="error"
  color="error"
  onClick={() => deleteSubCategory(item._id)}
>
  <MdDelete />
</Button>
                                           
                                        </div>
                                    </td>

                                </tr>
                                        )
                                    )) :(
      <tr>
        <td colSpan="10" className="text-center py-4 w-100">
          <h5 className="text-muted">No Products Found 😔</h5>
        </td>
      </tr>
    )
                                }
                               
                                </tbody>                                                    

                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{subCatData?.page}</b> of <b>{subCatData?.totalPages }</b> results</p>
                            <Pagination count={subCatData?.totalPages} color="primary" className="pagination" onChange={handleChange}
                            showFirstButton showLastButton/>
</div>
                    </div>
                </div>
            </div>
            
            <Dialog
                open={open}
          onClose={handleClose}
           maxWidth="sm"
  fullWidth
                PaperProps={{
                    component:'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                       const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const name = formJson.name;
                        console.log(name);
                        handleClose();
                    }
            }}
            >
               
                <DialogTitle> Edit Categeory </DialogTitle>
                <DialogContent className="p-4">
                   {/* <div className="form-group mb-3"></div> */}
                    <TextField
                         className="form-control mb-3"
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                        name="name"
                        label ="SubCategory Name"
                    type="text"
                        fullWidth
                            value={formFields.name}
                            onChange={changeInput}
                
                    />
                     
                      <div className="mb-3 mt-3">
                                        <h6 >CATEGORY</h6>
                                        <Select
                               value={formFields.category || ""}
                           onChange={handleChangeCategory}
                     
                               displayEmpty
                                                     inputProps={{ 'aria-label': 'Without label' }}
                                                     className="w-100"
                                             >
                                                 
                                                     
                                <MenuItem value="">
                         <em>Select</em>
                       </MenuItem>
                     
                                               {
                                                categories?.categoryList?.length !== 0 &&
categories?.map((cat, index) => ( 
                         <MenuItem key={index} value={cat._id}>
                           {cat.name} 
                         </MenuItem>
                                                 ))
                                               }
                                                     </Select>
                                       </div>
                    <div className="col-md-12 mt-3">
  <h4>SubCategory Images</h4>

  <div className="image-upload-container">

  {subCatImagesArr.map((img, index) => (
    <div className="image-card" key={index}>
      <img src={img} alt="SubCategory" />

      <span
        className="remove-btn"
        onClick={() => {
          const updated = subCatImagesArr.filter((_, i) => i !== index);
          setSubCatImagesArr(updated);
        }}
      >
        ✕
      </span>
    </div>
  ))}

  {/* Hidden input */}
  <input 
    type="file" 
    multiple 
    ref={fileInputRef}
    onChange={onChangeFile}
    style={{ display: "none" }}
  />

  {/* Clickable upload box */}
  <div 
    className="upload-box"
    onClick={() => fileInputRef.current.click()}
  >
    <div className="upload-content">
      <span>📷</span>
      <p>Upload</p>
    </div>
  </div>

              </div>
              </div>
                 
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="outlined">Cancel</Button>
                        <Button type="button" onClick={SubCategoryEditFun} variant="contained"> {isLoading===true?<CircularProgress color="inherit " className="ml-3 loader"/>:"Update"}  </Button>
                    </DialogActions>  
              
               <br/>
                
</Dialog>
        </>
    )
}

export default SubCategoryList;