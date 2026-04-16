import { FaDivide, FaEye, FaPencilAlt, FaUserCircle } from "react-icons/fa";

import { MdDelete, MdShoppingBag } from "react-icons/md";

import Button from "@mui/material/Button";
import { styled, emphasize } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Pagination from "@mui/material/Pagination";
import { useContext, useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Switch from "@mui/material/Switch";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { deleteData,  editData,  fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import { SearchContext } from "../../context/SearchContext";

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
const Users = () => {

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
       const [openDialog, setOpenDialog] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);
    const context = useContext(MyContext);
  const [userData, setuserData] = useState([]);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [totalUsers, setTotalUsers] = useState(0);
  const { searchQuery } = useContext(SearchContext);
  
 const filteredData = userData?.filter((item) =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const dataToShow = searchQuery ? filteredData : userData;

useEffect(() => {
  fetchUsers(1);
}, []);

const fetchUsers = (pageNo = 1) => {
  context.setProgress(40);

  fetchDataFromApi(`/api/user?page=${pageNo}&limit=10`)
    .then((res) => {
      setuserData(res?.users || []);
      setTotalPages(res?.totalPages || 1);
      setTotalUsers(res?.totalUsers || 0);
      setPage(res?.page || 1);

      context.setProgress(100);
    })
    .catch(() => context.setProgress(100));
  };
  
const handleChange = (event, value) => {
  setPage(value);
 fetchUsers(page);
  };
  

const deleteUser = (id) => {
  deleteData(`/api/user/${id}`).then(() => {
    fetchDataFromApi("/api/user").then((res) => {
      setuserData(res?.users || []);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "User deleted successfully"
      });
    });
  });
};

    return (
        <>
            <div className="right-content w-100">
                 <div className="card shadow border-0 w-100 flex-row p-4">
             <h5 className="mb-0">User List</h5>
      <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
    
    <StyledBreadcrumb
      component="a"
      href="#"
      label="Dashboard"
      icon={<HomeIcon fontSize="small" />}
    />

    <StyledBreadcrumb
      label="Users"
      deleteIcon={<ExpandMoreIcon />}
    />

  </Breadcrumbs>
</div>
  <div className="card shadow border-0 p-3 mt-4 w-100">
                    <div className="table-responsive mt-3">
                        <table className="table table-striped table-bordered v-align">
                            <thead className="thead-dark">
                                <tr >
                                    <th>UID</th>
                                    <th style={{width:"300px"}}>Name</th>
                <th>Email</th>
                <th>Phone</th>
                                   <th>Role</th>                                    
                    <th>GoogleId</th>
                    <th>Status</th>
<th>Verified</th>
<th>Login Type</th>
<th>Address</th>
<th>Created</th>
                                    <th>DateCreated</th>
                                    
                                     <th>Action</th>
                                </tr>
                            </thead>
                    <tbody>
                        
                        {

                          dataToShow?.length > 0 ? (
    dataToShow.map((item, index) => (
                               
                                    <tr key={item._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <Checkbox{...label} />     <span> {index + 1}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex UserBox align-items-center">
                                                <div className="imgWrapper">
                                                    <div className="img">
                                                   <img
src={
  item.image
    ? item.image
    : `https://ui-avatars.com/api/?name=${item.name}`
}
style={{ width: 40, height: 40, borderRadius: "50%" }}
/>
                          </div>
                          
                                                </div>
 <h6>{ item.name}</h6>
                                               
                                            </div>
                                       
                                    
                                        </td>
         <td> <div className="info">
                                                    <h6>{ item.email}</h6>
                                               
                                              
                                                </div></td>
                                        <td>{item.phone}</td>
                                        <td>
                                            <div style={{ width: '70p' }}>
                                              
                                                <span className="new text-danger"> {item.role} </span>
                                            </div>
                                        </td>
          <td>{item.googleId}</td>
          <td>
 <span className={`badge ${
  item.status === "active"
    ? "bg-success"
    : item.status === "inactive"
    ? "bg-secondary"
    : "bg-danger"
}`}>
  {item.status}
</span>
</td>

<td>
  {item.isVerified ? "✅ Yes" : "❌ No"}
</td>

<td>{item.loginType}</td>

<td>
  {item.city}, {item.state}
</td>

<td>
  {new Date(item.dateCreated).toLocaleDateString("en-IN")}
          </td>
          <td>{new Date(item.dateCreated).toLocaleDateString()}</td>
                                     
                                        <td>
                                            <div className="actions d-flex align-items-center">
                                         
              <Button
                className="success" color="success" 
  variant="outlined"
  size="small"
  onClick={() => {
    setSelectedUser(item);
    setOpenDialog(true);
  }}
>
<RiVerifiedBadgeFill />
</Button>

                                            <Button className="error" color="error" onClick={()=>deleteUser(item._id)}><MdDelete/></Button>
                                            </div>
                                        </td>

                                    </tr>
                                
                           )
                           )): (
      <tr>
        <td colSpan="13" className="text-center py-4">
          <h5 className="text-muted">No userData Found 😔</h5>
        </td>
      </tr>
    )
                            
                        }
                       
                              
                                </tbody>                                                    

                        </table>
                           <div className="d-flex justify-content-between align-items-center mt-3 mb-2">
     <p>
  Showing <b>{page}</b> of <b>{totalPages}</b> pages 

                </p>
                <Pagination
  count={totalPages}
  page={page}
  onChange={handleChange}
  color="primary"
  showFirstButton
  showLastButton
/>
           </div>                                       
                       </div>
                    </div>
          </div>
          

<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
  <DialogTitle>Update Verification</DialogTitle>

  <DialogContent>
    <p><b>{selectedUser?.name}</b></p>

    <div className="d-flex align-items-center gap-2">
      <span>Not Verified</span>

      <Switch
        checked={selectedUser?.isVerified || false}
        onChange={(e) =>
          setSelectedUser({
            ...selectedUser,
            isVerified: e.target.checked
          })
        }
      />

      <span>Verified</span>
    </div>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>

    <Button
      variant="contained"
      onClick={async () => {
        await editData(`/api/user/verify/${selectedUser._id}?status=${selectedUser.isVerified}`);

        setOpenDialog(false);

        // refresh list
        const res = await fetchDataFromApi("/api/user");
        setuserData(res?.users || []);

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Verification updated"
        });
      }}
    >
      Save
    </Button>
  </DialogActions>
</Dialog>

                
        </>
    )
}
export default Users;