import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import {  FaPencilAlt} from "react-icons/fa";

import { MdDelete } from "react-icons/md";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { useEffect } from "react";
import { deleteData, editData, fetchDataFromApi, postData } from "../../../utils/api";
  
  import { useRef } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../../App";



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
    
    
const CategoryList = () => {

    const [catData, setCatData] = useState([]);
    const [open, setOpen] = useState(false);
 
    const [isLoading, setIsLoading] = useState(false);
    const [editId, setEditId] = useState(null);
const [catImagesArr, setCatImagesArr] = useState([]);
    const [formFields, setFormFields] = useState({
        name:"",
        images :'',
        color:"",
    })


const fileInputRef = useRef();
    const context = useContext(MyContext);
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  

    useEffect(() => {
        window.scrollTo(0, 0);
       context.setProgress(20)
        fetchDataFromApi("/api/category").then((res) => {
            setCatData(res);
            console.log(res);
            context.setProgress(100)
        })
    }, []);

    

const deleteCategory = async (id) => {
  try {
    await deleteData(`/api/category/${id}`);

    // ✅ Remove from UI instantly
  setCatData((prev) => prev.filter(item => item._id !== id));

    context.setAlertBox({
      open: true,
      error: false,
      msg: 'Category deleted successfully'
    });

  } catch (error) {
    console.log(error);
  }
};

    const handleChange = (event, value) => {
        context.setProgress(40);
        fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
            setCatData(res);
              context.setProgress(0);
          
        })
    };

    return (
        <>
                        <div className="right-content w-100">
            <div className="card shadow border-0 w-100 flex-row p-4">
  <h5 className="mb-0">Category List</h5>

                    <div className="ml-auto d-flex align-items-center">
  <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
                            label="Category List"
      deleteIcon={<ExpandMoreIcon />}
    />

                        </Breadcrumbs>
                        
                        <Link to="/category/add"><Button className="btn-blue  ml-3 p-3 pr-3" style={{ height: "5px" }}>Add Category</Button>
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
                                    <th >Category</th>
                                   
                    <th >Color</th>         
                    
                                     <th style={{width:"150px"}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  catData?.length > 0?( catData?.map((item, index) => (                                       
                                             <tr>
                            <td>
                                <div className="d-flex align-items-center">
                                                        <Checkbox{...label} />     <span> # {index + 1}</span>
                                </div>
                                                </td>
                                                 <td>
                                        <div className="d-flex CategoryBox align-items-center">
                                            <div className="imgWrapper">
                                                <div className="img">
                                                    <img src={item.images[0]} className="w-100"/>
                                                </div>
                                                        </div>
                                                        
                                        </div>
                                       
                                    
                                    </td>
                                                 <td> {item.name} </td>
                                   
                                                <td>
                                                    <span className="dot d-flex justify-content-center align-items-center w-100" style={{background:item.color}}><p className="align-items-center pl-2" >{item.color} </p></span>
                                                </td>
                                    <td>
                                <div className="actions d-flex align-items-center">
                                 <Link to={`/category/add/${item._id}`}>
  <Button className="success" color="success">
    <FaPencilAlt />
  </Button>
</Link>
                                            <Button className="error" color="error" onClick={()=>deleteCategory(item._id)}><MdDelete/></Button>
                                        </div>
                                    </td>

                                </tr>
                                        )
                                    )) :(
      <tr>
        <td colSpan="10" className="text-center py-4">
          <h5 className="text-muted">No Products Found 😔</h5>
        </td>
      </tr>
    )
                                }
                               
                                </tbody>                                                    

                        </table>
                        <div className="d-flex tableFooter">
                            <p>showing <b>{catData?.page}</b> of <b>{catData?.totalPages }</b> results</p>
                            <Pagination count={catData?.totalPages} color="primary" className="pagination" onChange={handleChange}
                            showFirstButton showLastButton/>
</div>
                    </div>
                </div>
            </div>
  
        </>
    )
}

export default CategoryList;