import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { editData, fetchDataFromApi } from "../../utils/api";
import { MdCameraAlt } from "react-icons/md";

const UserProfile = () => {
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", firstName: "", lastName: "",
    companyName: "", address1: "", address2: "", city: "",
    state: "", zipCode: "", country: ""
  });
  const [stats, setStats] = useState({
  memberSince: "",
  totalOrders: 0,
  totalWishlistItems: 0
});

const memberYear = stats.memberSince
  ? new Date(stats.memberSince).getFullYear()
  : "";

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) getUser();
  }, []);


useEffect(() => {
  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?._id) return;

      const res = await fetchDataFromApi(
        `/api/user/user-stats/${user._id}`
      );

      if (res?.success) {
        setStats(res.stats);
      }

    } catch (error) {
      console.log("Stats Error:", error);
    }
  };

  fetchStats();
}, []);

  
  const getUser = async () => {
    try {
      const res = await fetchDataFromApi(`/api/user/${user._id}`);
      if (res?.success) setFormData(res.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    setSaving(true);
    const form = new FormData();
    Object.keys(formData).forEach((key) => form.append(key, formData[key]));
    if (image) form.append("image", image);
    const res = await editData(`/api/user/${user._id}`, form, true);
    setSaving(false);
    if (!res?.error) alert("Profile updated successfully!");
    else alert("Failed to update profile");
  };

  const fieldStyle = { marginBottom: "16px" };

  return (
    <section className="profilePage">
      <div className="container">
        <div className="card">

          <div className="row">
            {/* Left — Avatar & Basic Info */}
            <div className="col-md-3" style={{ textAlign: "center", borderRight: "1px solid var(--border-light)", paddingRight: "32px" }}>
              <div className="profileAvatarWrapper" style={{ marginBottom: "16px" }}>
                <img
                  src={preview || formData.image || `https://ui-avatars.com/api/?name=${formData.name || "User"}&background=1a1f3c&color=fff&size=200`}
                  alt="Profile"
                />
                <label htmlFor="profileImage" className="editIcon">
                  <MdCameraAlt size={13} />
                </label>
                <input
                  type="file"
                  id="profileImage"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <h5 style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "16px",
                color: "var(--text-primary)",
                border: "none",
                padding: 0,
                textTransform: "none",
                letterSpacing: 0,
                marginBottom: "4px"
              }}>
                {formData.name || "Your Name"}
              </h5>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
                {formData.email}
              </p>

              {/* Stats Chips */}
           <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
  {[
    { label: "Member since", value: memberYear },
    { label: "Orders", value: stats.totalOrders },
    { label: "Wishlist", value: stats.totalWishlistItems }
  ].map((stat) => (
    <div key={stat.label} style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 14px",
      background: "var(--surface)",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--border-light)"
    }}>
      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
        {stat.label}
      </span>
      <span style={{
        fontSize: "13px",
        fontWeight: 600,
        fontFamily: "var(--font-heading)",
        color: "var(--text-primary)"
      }}>
        {stat.value}
      </span>
    </div>
  ))}
</div>
            </div>

            {/* Right — Form */}
            <div className="col-md-9" style={{ paddingLeft: "32px" }}>
              <h4>Account Information</h4>
              <p className="text-muted">Manage your profile details and delivery preferences</p>

              {/* Account Fields */}
              <div className="row mt-3">
                <div className="col-md-6">
                  <TextField label="Full Name" fullWidth name="name" value={formData.name} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-6">
                  <TextField label="Email Address" fullWidth name="email" value={formData.email} disabled style={fieldStyle} size="small" />
                </div>
                <div className="col-md-6">
                  <TextField label="Phone Number" fullWidth name="phone" value={formData.phone || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-6">
                  <TextField label="Company Name" fullWidth name="companyName" value={formData.companyName || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
              </div>

              {/* Address Section */}
              <h5>Delivery Address</h5>

              <div className="row mt-2">
                <div className="col-md-6">
                  <TextField label="First Name" fullWidth name="firstName" value={formData.firstName || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-6">
                  <TextField label="Last Name" fullWidth name="lastName" value={formData.lastName || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-12">
                  <TextField label="Address Line 1" fullWidth name="address1" value={formData.address1 || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-12">
                  <TextField label="Address Line 2 (optional)" fullWidth name="address2" value={formData.address2 || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-4">
                  <TextField label="City" fullWidth name="city" value={formData.city || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-4">
                  <TextField label="State" fullWidth name="state" value={formData.state || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-4">
                  <TextField label="Postal Code" fullWidth name="zipCode" value={formData.zipCode || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
                <div className="col-md-12">
                  <TextField label="Country" fullWidth name="country" value={formData.country || ""} onChange={handleChange} style={fieldStyle} size="small" />
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <Button
                  variant="contained"
                  className="btn-blue"
                  onClick={updateProfile}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={getUser}
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--text-secondary)",
                    textTransform: "none",
                    fontFamily: "var(--font-body)",
                    borderRadius: "var(--radius-md)"
                  }}
                >
                  Discard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;