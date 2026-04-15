import { useContext, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import { postData, editData, fetchDataFromApi } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { emphasize } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme?.palette?.mode === "light"
      ? theme?.palette?.grey?.[100]
      : theme?.palette?.grey?.[800];

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
const BannerUpload = () => {

  const context = useContext(MyContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
 const [bannerImage, setBannerImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
const [status, setStatus] = useState("true");



  const [formFields, setFormFields] = useState({
    title: "",
    desc: "",
   type: "home",
    status: true
  });

  // ================= FETCH (EDIT) =================
  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/banner/${id}`).then((res) => {
        const data = res.data;

setFormFields({
  title: data.title,
  desc: data.desc,
  type: data.type,   
  status: data.status
});

setBannerImage(data.images?.[0]);  
      });
    }
  }, [id]);

  // ================= INPUT =================
  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    });
  };
    
  const handleChangeStatus = (event) => {
  setStatus(event.target.value);

  setFormFields((prev) => ({
    ...prev,
  status: event.target.value === "true"
  }));
};
    // ================= REMOVE IMAGE =================
const removeImg = () => {
  setBannerImage("");
};

  // ================= IMAGE UPLOAD =================
const onChangeFile = async (e) => {
  try {
    const file = e.target.files[0]; // single file

    const formData = new FormData();
    formData.append("image", file); // single image

    setUploading(true);

    const res = await postData("/api/banner/upload", formData, true);

    if (res?.image) {
      setBannerImage(res.image);

      setFormFields((prev) => ({
        ...prev,
        image: res.image
      }));
    }

    setUploading(false);

  } catch (err) {
    console.log(err);
    setUploading(false);
  }
};

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

   if ( !bannerImage) {
      return context.setAlertBox({
        open: true,
        error: true,
        msg: "Image required"
      });
    }

    setIsLoading(true);

    const data = {
      ...formFields,
        image: bannerImage
    };

    if (isEdit) {
      editData(`/api/banner/${id}`, data).then(() => {
        setIsLoading(false);
        navigate("/banner-list");

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Banner updated"
        });
      });

    } else {
      postData("/api/banner", data).then(() => {
        setIsLoading(false);
        navigate("/banner-list");

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Banner created"
        });
      });
    }
  };

  return (
    <div className="right-content w-100">

         <div className="card shadow border-0 w-100 flex-row p-4">

        <h5>{isEdit ? "Edit Banner" : "Add Banner"}</h5>

         <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                                      
                                      <StyledBreadcrumb
                                        component="a"
                                        href="#"
                                        label="Dashboard"
                                        icon={<HomeIcon fontSize="small" />}
                                      />
                                  
                                              <StyledBreadcrumb
                                                   component="a"
                                                 label="Banner"
                                                   href="#"
                                        deleteIcon={<ExpandMoreIcon />}
                                              />
                                              
                                              <StyledBreadcrumb
                                                  label="Banner Upload"
                                        deleteIcon={<ExpandMoreIcon />}
                                      />
                                  
                                    </Breadcrumbs>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="card p-4">

          {/* TITLE */}
          <div className="form-group">
            <h6>Title</h6>
            <input
              type="text"
              name="title"
              value={formFields.title}
              onChange={changeInput}
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <h6>Description</h6>
            <textarea
              name="desc"
              value={formFields.desc}
              onChange={changeInput}
            />
          </div>

     <div className="form-group">
  <h6>Banner Type</h6>

  <Select
    value={formFields.type}
    onChange={(e) =>
      setFormFields({
        ...formFields,
        type: e.target.value
      })
    }
    className="w-100"
  >
    <MenuItem value="">
      <em>Select Type</em>
    </MenuItem>

    <MenuItem value="home">Home</MenuItem>
              <MenuItem value="category">Category</MenuItem>
                  <MenuItem value="side-banner">Side Banner</MenuItem>
    <MenuItem value="offer">Offer</MenuItem>
  </Select>
</div>
        
  <div className="form-group">
                   <h6>Status</h6>
                 <Select
  value={formFields.status ? "true" : "false"}
  onChange={(e) =>
    setFormFields({
      ...formFields,
      status: e.target.value === "true"
    })
  }
  className="w-100"
>
  <MenuItem value="">
    <em>Select</em>
  </MenuItem>
  <MenuItem value="true">True</MenuItem>
  <MenuItem value="false">False</MenuItem>
</Select>
                  </div>
          {/* IMAGE */}
          <div className="card p-4 mt-4">
            <h5>Banner Image</h5>

            <div className="imgUploadBox d-flex align-items-center">

              {/* PREVIEW */}
              {bannerImage && (
                <div className="uploadBox">
                    <span className="remove" onClick={() => removeImg()}>X</span>
    <div className="box">
      <img src={bannerImage} className="w-100" alt="img" />
    </div>
  </div>
)}

              {/* UPLOAD */}
              <div className="uploadBox">
                {uploading ? (
                  <div className="progressBar">
                    <CircularProgress />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <>
                    <input type="file" onChange={onChangeFile} />
                    <div className="info">
                      <FaRegImages />
                      <h5>Upload</h5>
                    </div>
                  </>
                )}
              </div>

            </div>
          </div>

          {/* SUBMIT */}
          <Button type="submit" className="btn-blue btn-lg w-100 mt-4">
            <FaCloudUploadAlt />
            &nbsp;
            {isLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (isEdit ? "Update Banner" : "Publish Banner")}
          </Button>

        </div>
      </form>
    </div>
  );
};

export default BannerUpload;