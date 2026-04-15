import Button from "@mui/material/Button";
import { FaAngleRight, FaBell, FaCartArrowDown, FaProductHunt } from "react-icons/fa";

import { MdMessage, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { RxDashboard } from "react-icons/rx"
import { IoIosSettings, IoMdLogOut } from "react-icons/io"
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { MyContext } from "../../App";
const Sidebar = () => {


    const [activeTab, setActiveTab] = useState(null);
    // const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);

    const context = useContext(MyContext);

  const isOpenSubmenu = (index) => {
  if (activeTab === index) {
    setActiveTab(null); // close
  } else {
    setActiveTab(index); // open
  }
};       





    return (
        <>
            <div className="sidebar">
                <ul>
                    <li>
                       
                            <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                <span className="icon"> <RxDashboard /></span>
                                Dashboard
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                     
                    </li>

                    <li>

                        <Button className={`w-100 ${activeTab === 1  ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                            <span className="icon"> <FaProductHunt /></span>
                            Products
                            <span className="arrow"><FaAngleRight /></span>
                        </Button>
<div className={`submenuWrapper ${activeTab === 1 ? 'collapse' : ''}`}>
                            <ul className="submenu">
                                <li><Link to="/products">Product List</Link></li>
                                <li><Link to="/product/details">Product view</Link></li>
                                <li><Link to="/product/upload">Product Upload</Link></li>

                            </ul>
                        </div>
                    </li>

                    <li>
                      
                            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                <span className="icon"> <FaCartArrowDown /></span>
                                Orders
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                      
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                <span className="icon"> <MdMessage /></span>
                                Messages
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                <span className="icon"> <FaBell /></span>
                                Notifications
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                <span className="icon"> <IoIosSettings /></span>
                                Setting
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => isOpenSubmenu(6)}>
                                <span className="icon"> <RxDashboard /></span>
                                Dashboard
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="">
                            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => isOpenSubmenu(7)}>
                                <span className="icon"> <FaProductHunt /></span>
                                Products
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>

                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => isOpenSubmenu(8)}>
                                <span className="icon"> <FaCartArrowDown /></span>
                                Orders
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => isOpenSubmenu(9)}>
                                <span className="icon"> <MdMessage /></span>
                                Messages
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(10)}>
                                <span className="icon"> <FaBell /></span>
                                Notifications
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <Button className={`w-100 ${activeTab === 11 ? 'active' : ''}`} onClick={() => isOpenSubmenu(11)}>
                                <span className="icon"> <IoIosSettings /></span>
                                Setting
                                <span className="arrow"><FaAngleRight /></span>
                            </Button>
                        </Link>
                    </li>
                </ul>

                <br />
                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained"><IoMdLogOut />Logout</Button>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Sidebar;