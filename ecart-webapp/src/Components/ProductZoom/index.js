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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .pz-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── big image frame ── */
        .pz-main {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #eef0f4;
          background: #f8fafc;
        }
        .pz-main .iiz {
          display: block !important;
          width: 100% !important;
        }
        .pz-main .iiz__img {
          width: 100% !important;
          height: 420px !important;
          object-fit: contain !important;
          display: block !important;
          background: #f8fafc;
        }

        /* zoom hint badge */
        .pz-zoom-hint {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(15,27,45,.62);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 20px;
          letter-spacing: .04em;
          pointer-events: none;
          backdrop-filter: blur(6px);
        }

        /* image count badge */
        .pz-img-count {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(255,255,255,.85);
          color: #374151;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: .04em;
          backdrop-filter: blur(6px);
          border: 1px solid #eef0f4;
        }

        /* ── thumbnails ── */
        .pz-thumbs {
          display: flex;
          gap: 8px;
          flex-wrap: nowrap;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: none;
        }
        .pz-thumbs::-webkit-scrollbar { display: none; }

        .pz-thumb-item {
          flex-shrink: 0;
          width: 72px;
          height: 72px;
          border-radius: 10px;
          overflow: hidden;
          border: 2px solid #eef0f4;
          cursor: pointer;
          background: #f8fafc;
          transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .pz-thumb-item:hover {
          border-color: #94b8e8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(26,111,196,.15);
        }
        .pz-thumb-item.active {
          border-color: #1a6fc4;
          box-shadow: 0 0 0 3px rgba(26,111,196,.15);
        }
        .pz-thumb-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

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