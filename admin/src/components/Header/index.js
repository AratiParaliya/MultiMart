import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png"
import Button from "@mui/material/Button";
import { MdMenuOpen, MdOutlineLightMode, MdOutlineMailOutline, MdOutlineMenu } from "react-icons/md";
import { } from "react-icons/ci";
import { IoCartOutline, IoShieldHalfSharp } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa"
import SearchBox from "../SearchBox";


import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';

import Logout from '@mui/icons-material/Logout';
import { useContext, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import { MyContext } from "../../App";
import UserAvatarImg from "../userAvatarimg";

const Header = () => {

const user = JSON.parse(localStorage.getItem("user") || "null");



 const context = useContext(MyContext);
  const navigate = useNavigate();

  

    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpennotificationsDrop, setisOpennotificationsDrop] = useState(false);
    const open = Boolean(anchorEl);
  const opennotifications = Boolean(isOpennotificationsDrop);
  


  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
    };
    
      const handleOpennotificationsDrop =() => {
    setisOpennotificationsDrop(true)
  };
  const handleClosenotificationsDrop = () => {
   setisOpennotificationsDrop(false)
  };

    return (
        
          <header className="d-flex align-items-center">
    <div className="container-fluid w-100">
        <div className="row d-flex align-items-center logo w-100  flex-row">
            {/* Logo Wraoper */}
            <div className="col-sm-2 part1">
                <Link to={'/'} className="d-flex align-items-center">
                    <img src={logo}  />
                    
                </Link>
                        </div>
                        
            
            {
              context.windowWidth > 992 &&
               <div className="col-sm-3 d-flex align-items-center part2 res-hide pl-4">
              <Button className="rounded-circle mr-3 " onClick={() => context.setIsToggleSidebar(!context.isToggleSidebar)}>
                {
                  context.isToggleSidebar === false ? <MdMenuOpen /> :
                    <MdOutlineMenu/>
                }
                </Button>
                             <SearchBox setSearchQuery={context.setSearchQuery}/>   

                        </div>
            }
            


                       
                       
                        <div className="col-sm-7 d-flex align-items-center justify-content-end part3">

              <Button className="rounded-circle mr-3" onClick={() => context.setThemeMode(!context.themeMode)}>
                <MdOutlineLightMode /></Button>
                            {/* <Button className="rounded-circle mr-3" ><IoCartOutline/>
                       
                            </Button>
                            <Button className="rounded-circle mr-3"><MdOutlineMailOutline/></Button> */}
                        <div className="dropdownwrapper position-relative">
                            
                                        <Button className="rounded-circle mr-3"onClick={handleOpennotificationsDrop}><FaRegBell/></Button>
  <Menu
                            anchorEl={isOpennotificationsDrop}
                            className="notifications dropdown_list"
        id="notifications"
        open={opennotifications}
        onClose={handleClosenotificationsDrop}
        onClick={handleClosenotificationsDrop}
       
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
                  <div className="head pl-3 pb-0">
                 <h4>Oreders (12)</h4>    
                  </div>
                  
                  <Divider className="mb-1"/>
                  <div className="scroll">
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex ">
                      
                    <div>
                     <div className="userImg">
            <span className="rounded-circle">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s" />
            </span>
                        </div>
                        </div>
                    <div className="dropdowninfo">
                      <h4>
                        <span>
                          <b>Mahmudul</b>
                          added to his favorite list
                          <b>Leather belt steve madden</b>
                        </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                      </div>
                  </MenuItem> 
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex ">
                      
                    <div>
                     <div className="userImg">
            <span className="rounded-circle">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s" />
            </span>
                        </div>
                        </div>
                    <div className="dropdowninfo">
                      <h4>
                        <span>
                          <b>Mahmudul</b>
                          added to his favorite list
                          <b>Leather belt steve madden</b>
                        </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                      </div>
                  </MenuItem> 
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex ">
                      
                    <div>
                     <div className="userImg">
            <span className="rounded-circle">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s" />
            </span>
                        </div>
                        </div>
                    <div className="dropdowninfo">
                      <h4>
                        <span>
                          <b>Mahmudul</b>
                          added to his favorite list
                          <b>Leather belt steve madden</b>
                        </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                      </div>
                    </MenuItem>   
                     <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex ">
                      
                    <div>
                     <div className="userImg">
            <span className="rounded-circle">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s" />
            </span>
                        </div>
                        </div>
                    <div className="dropdowninfo">
                      <h4>
                        <span>
                          <b>Mahmudul</b>
                          added to his favorite list
                          <b>Leather belt steve madden</b>
                        </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                      </div>
                    </MenuItem> 
                     <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className="d-flex ">
                      
                    <div>
                     <div className="userImg">
            <span className="rounded-circle">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s" />
            </span>
                        </div>
                        </div>
                    <div className="dropdowninfo">
                      <h4>
                        <span>
                          <b>Mahmudul</b>
                          added to his favorite list
                          <b>Leather belt steve madden</b>
                        </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                      </div>
         </MenuItem> 
     </div>
                  <div className="pl-3 pr-3 w-100 pt-2 pb-1 ">
                          <Button  className="btn-blue w-100"> View all Notifications</Button>

                  </div>  
      </Menu>
                </div>
                            <div className="myAccWrapper">
    <Button className="myAcc d-flex align-items-center"  onClick={handleOpenMyAccDrop}>
        <div>
<UserAvatarImg 
  img={user?.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAa5feWGju95NLmf97imfDRjqJ1OhbK7DZEg&s"} 
/>                    </div>

                                  <div className="userInfo">
  <h4>{user?.name || "Guest User"}</h4>   
  <p className="mb-0">
    {user?.role === "admin" ? "Admin" : "User"}
  </p>     
</div>

                        </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleCloseMyAccDrop}
        onClick={handleCloseMyAccDrop}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        
      
     {/* 👤 My Account */}
{user && (
  <MenuItem onClick={() => navigate(`/myAccount/${user._id}`)}>
    <ListItemIcon>
      <PersonAdd fontSize="small" />
    </ListItemIcon>
    My Account
  </MenuItem>
)}




{/* 🚪 Logout */}
<MenuItem onClick={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  context.setisLogin(false);
   window.open("http://localhost:3000/SignIn", "_self");
}}>
  <ListItemIcon>
    <Logout fontSize="small" />
  </ListItemIcon>
  Logout
</MenuItem>
      </Menu>
        </div>
                    </div>
                    </div>
               </div>    
</header>
       
    )
}
export default Header;