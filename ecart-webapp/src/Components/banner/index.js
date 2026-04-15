
import productBg from "../../assets/images/table.jpg";

const Banner = ({title}) => {
    return ( 
        <div className="image-container">
            <img src={productBg} alt="Product-bg" />
            <div className="overlay">
                <div className="Container">
                    <div className="row ">
                        <div className="col">
                            <h2>{title}</h2>
                       
                   </div>
              </div>
            </div>
            </div>
            </div>
    );
}

export default Banner;