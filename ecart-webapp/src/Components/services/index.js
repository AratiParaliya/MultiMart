import React from "react";

   import { FaTruck, FaHeadset, FaCreditCard, FaUndo } from "react-icons/fa";
const Services = () => {

 
const serviceData = [
  {
    icon: <FaTruck />,
    title: "Free Delivery",
    subtitle: "On all orders",
    bg: "rgb(253, 239, 230)"
  },
  {
    icon: <FaHeadset />,
    title: "24/7 Support",
    subtitle: "Customer support",
    bg: "rgb(206, 235, 233)"
  },
  {
    icon: <FaCreditCard />,
    title: "Secure Payment",
    subtitle: "Safe checkout",
    bg: "rgb(226, 242, 178)"
  },
  {
    icon: <FaUndo />,
    title: "Easy Return",
    subtitle: "30 days return",
    bg: "rgb(214, 229, 251"
  }
];
  return (
      <section className="services">
             <div className='container'>
      <div className="services-container">
        {serviceData.map((item, index) => (
          <div
            className="service-box"
            key={index}
            style={{ backgroundColor: item.bg }}
          >
            <div className="icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.subtitle}</p>
          </div>
        ))}
              </div>
              </div>
    </section>
  );
};

export default Services;