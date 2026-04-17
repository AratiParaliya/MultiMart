import Slider from "react-slick";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";
import { useRef, useState } from "react";

const ProductZoom = ({ images = [] }) => {
  const zoomSliderBig = useRef();
  const zoomSlider = useRef();
  const [activeIndex, setActiveIndex] = useState(0);

  const flatImages = images.flat();

  const goto = (index) => {
    setActiveIndex(index);
    zoomSlider.current?.slickGoTo(index);
    zoomSliderBig.current?.slickGoTo(index);
  };

  const settingsBig = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    arrows: false,
    beforeChange: (_, next) => setActiveIndex(next),
  };

  const settingsThumb = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 5,
    arrows: false,
    focusOnSelect: true,
  };

  return (
    <>
    

      <div className="pz-wrap">
        {/* Big slider */}
        <div className="pz-main">
          <Slider {...settingsBig} ref={zoomSliderBig}>
            {flatImages.map((img, i) => (
              <div key={i}>
                <InnerImageZoom
                  zoomType="hover"
                  zoomScale={1.4}
                  src={img}
                />
              </div>
            ))}
          </Slider>
          {flatImages.length > 0 && (
            <span className="pz-img-count">
              {activeIndex + 1} / {flatImages.length}
            </span>
          )}
         
        </div>

        {/* Thumbnails */}
        {flatImages.length > 1 && (
          <div className="pz-thumbs">
            {flatImages.map((img, i) => (
              <div
                key={i}
                className={`pz-thumb-item${activeIndex === i ? ' active' : ''}`}
                onClick={() => goto(i)}
              >
                <img src={img} alt={`thumb-${i}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductZoom;