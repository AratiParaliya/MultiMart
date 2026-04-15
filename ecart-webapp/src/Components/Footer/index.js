import { Link } from "react-router-dom";
import { LuShirt } from "react-icons/lu";
import { TbTruckDelivery, TbDiscount } from "react-icons/tb";
import { CiBadgeDollar } from "react-icons/ci";
import { FaFacebookF, FaTwitter, FaInstagram, FaShoppingBag } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";

const Footer = () => {
  return (
    <footer>
      <div className="container">

        {/* TOP INFO (UNCHANGED UI) */}
        <div className="topInfo row">
          <div className="col d-flex align-items-center">
            <span><LuShirt /></span>
            <span className="ml-2">Everyday fresh products</span>
          </div>

          <div className="col d-flex align-items-center">
            <span><TbTruckDelivery /></span>
            <span className="ml-2">Free delivery for order over $70</span>
          </div>

          <div className="col d-flex align-items-center">
            <span><TbDiscount /></span>
            <span className="ml-2">Daily Mega Discounts</span>
          </div>

          <div className="col d-flex align-items-center">
            <span><CiBadgeDollar /></span>
            <span className="ml-2">Best price on the market</span>
          </div>
        </div>

        {/* UPDATED LINKS DATA */}
        <div className="linksWrap row mt-4">
  <div className="col-md-4">
        <div className="logo d-flex mb-2 align-items-center">
  <FaShoppingBag size={40} />
  <h1 className="ms-2 pl-2">Multimart</h1>
</div>
              <p >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.</p>
          </div>
            {/* ABOUT */}
          <div className="col m[-2">
            <h5>ABOUT US</h5>
            <ul>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Our Stores</Link></li>
              <li><Link to="#">Our Cares</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* CUSTOMER CARE */}
          <div className="col">
            <h5>CUSTOMER CARE</h5>
            <ul>
              <li><Link to="#">Help Center</Link></li>
              <li><Link to="#">How to Buy</Link></li>
              <li><Link to="#">Track Your Order</Link></li>
              <li><Link to="#">Bulk Purchasing</Link></li>
              <li><Link to="#">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* CONTACT */}
          <div className="col">
            <h5>CONTACT US</h5>
            <ul>
              <li>
                <Link to="#">
                  70 Washington Square South, New York, NY 10012
                </Link>
              </li>
              <li><Link to="#">Email: uilib.help@gmail.com</Link></li>
              <li><Link to="#">Phone: +1 1123 456 780</Link></li>
            </ul>
          </div>

          {/* EXTRA */}
          <div className="col">
            <h5>INFORMATION</h5>
            <ul>
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Delivery Info</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Terms & Conditions</Link></li>
              <li><Link to="#">Support Center</Link></li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT */}
        <div className="copyright mt-3 pt-3 pb-3 d-flex">
          <p className="mb-0">
            © 2024 Multimart. All rights reserved
          </p>

          <ul className="list list-inline ml-auto mb-0">
            <li className="list-inline-item">
              <Link to="#"><FaFacebookF /></Link>
            </li>
            <li className="list-inline-item">
              <Link to="#"><FaTwitter /></Link>
            </li>
            <li className="list-inline-item">
              <Link to="#"><FaInstagram /></Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;