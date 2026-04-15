import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { editData, fetchDataFromApi } from "../../utils/api";

const MyAccount = () => {

  const [image, setImage] = useState("");
const [preview, setPreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    companyName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));


useEffect(() => {
  if (user && user._id) {
    getUser();
  }
}, []);

const getUser = async () => {
  try {
    const res = await fetchDataFromApi(`/api/user/${user._id}`);

    if (res?.success) {
      setFormData(res.user);
    } else {
      console.log("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file);
    setPreview(URL.createObjectURL(file)); // preview
  }
};
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 const updateProfile = async () => {
  const form = new FormData();

  Object.keys(formData).forEach((key) => {
    form.append(key, formData[key]);
  });

  if (image) {
    form.append("image", image);
  }

  const res = await editData(`/api/user/${user._id}`, form, true);

  if (!res?.error) {
    alert("Profile updated successfully!");
  } else {
    alert("Failed to update profile");
  }
};

  return (
    <section className="container mt-4">
      <div className="card shadow p-4">
        <h4 className="mb-3">Profile</h4>
        <p className="text-muted">Update your account details</p>
<div className="text-center mb-4">
  <div style={{ position: "relative", display: "inline-block" }}>
    
    <img
      src={
        preview ||
        formData.image ||
        "https://via.placeholder.com/120"
      }
      alt="profile"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        border: "3px solid #ddd"
      }}
    />

    {/* Edit Icon */}
    <label
      htmlFor="profileImage"
      style={{
        position: "absolute",
        bottom: "5px",
        right: "5px",
        background: "#1976d2",
        color: "#fff",
        borderRadius: "50%",
        padding: "6px",
        cursor: "pointer",
        fontSize: "12px"
      }}
    >
      ✏️
    </label>

    <input
      type="file"
      id="profileImage"
      hidden
      accept="image/*"
      onChange={handleImageChange}
    />
  </div>
</div>
        <div className="row mt-3">
          <div className="col-md-6">
            <TextField
              label="Name"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={formData.email}
              disabled
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Phone"
              fullWidth
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Company Name"
              fullWidth
              name="companyName"
              value={formData.companyName || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>
        </div>

        <h5 className="mt-3">Address</h5>

        <div className="row mt-2">
          <div className="col-md-6">
            <TextField
              label="First Name"
              fullWidth
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Last Name"
              fullWidth
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-12">
            <TextField
              label="Address Line 1"
              fullWidth
              name="address1"
              value={formData.address1 || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-12">
            <TextField
              label="Address Line 2"
              fullWidth
              name="address2"
              value={formData.address2 || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="City"
              fullWidth
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="State"
              fullWidth
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Postal Code"
              fullWidth
              name="zipCode"
              value={formData.zipCode || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>

          <div className="col-md-6">
            <TextField
              label="Country"
              fullWidth
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              className="mb-3"
            />
          </div>
        </div>

        <Button
          variant="contained"
          className="mt-3"
          onClick={updateProfile}
        >
          Save Changes
        </Button>
      </div>
    </section>
  );
};

export default MyAccount;