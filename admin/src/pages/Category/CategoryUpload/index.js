import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useContext, useState } from "react";

import Button from "@mui/material/Button";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";

import "react-lazy-load-image-component/src/effects/blur.css";
import CircularProgress from "@mui/material/CircularProgress";
import { MyContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { editData, fetchDataFromApi, postData } from "../../../utils/api";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

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




const CategoryUpload = () => {

  const context = useContext(MyContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [productImagesArr, setProductImagesArr] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    color: '',
  });

  // ================= INPUT =================
  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
  if (id) {
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      setFormFields({
        name: res.name,
        color: res.color,
        images: res.images
      });

      setProductImagesArr(res.images);
    });
  }
}, [id]);
  // ================= REMOVE IMAGE =================
  const removeImg = (index) => {
    const updated = productImagesArr.filter((_, i) => i !== index);

    setProductImagesArr(updated);

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

      const res = await postData('/api/category/upload', formdata);

      if (res?.images) {
        const newImages = [...productImagesArr, ...res.images];

        setProductImagesArr(newImages);

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
const addCategory = (e) => {
  e.preventDefault();

  if (
    formFields.name !== "" &&
    productImagesArr.length !== 0 &&
    formFields.color !== ""
  ) {
    setIsLoading(true);

    const data = {
      ...formFields,
      images: productImagesArr
    };

    if (isEdit) {
      // ✅ UPDATE
      editData(`/api/category/${id}`, data).then(() => {
        setIsLoading(false);
        navigate('/categoryList');

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Category updated successfully"
        });
      });

    } else {
      // ✅ CREATE
      postData('/api/category/create', data).then(() => {
        setIsLoading(false);
        navigate('/categoryList');

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Category created successfully"
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

  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4">
       <h5 className="mb-0">
  {isEdit ? "Edit Category" : "Add Category"}
</h5>
      </div>

      <form className="form" onSubmit={addCategory}>
        <div className="card p-4">

          {/* NAME */}
          <div className="form-group">
            <h6>Category Name</h6>
            <input type="text" name="name" value={formFields.name}  onChange={changeInput} />
          </div>

          {/* COLOR */}
          <div className="form-group">
            <h6>Color</h6>
            <input type="text" name="color" value={formFields.color}  onChange={changeInput} />
          </div>

          {/* IMAGE SECTION */}
          <div className="card p-4 mt-4">
            <h5 className="mb-4">Category Images</h5>

            <div className="imgUploadBox d-flex align-items-center">

              {
                productImagesArr.map((img, index) => (
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
            {isLoading ? <CircularProgress color="inherit" size={20} /> : "Publish and View"}
          </Button>

        </div>
      </form>
    </div>
  );
};
export default CategoryUpload;