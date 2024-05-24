import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectFade, Navigation, Pagination, Autoplay } from "swiper/modules";
import { Banner } from "../../assets/BannerSlider/BannerSlider";
import { Link } from "react-router-dom";

export const Slider = () => {
  return (
    <Swiper
      style={{
        "--swiper-navigation-size": "15px",
        "--swiper-pagination-fontsize": "10px",
        "--swiper-pagination-color": "white",
        "--swiper-pagination-bullet-inactive-color": "white",
        "--swiper-pagination-bullet-inactive-opacity": "0.5",
        "--swiper-pagination-bullet-size": "13px",
        "--swiper-pagination-bullet-horizontal-gap": "5px",
        "--swiper-pagination-bullet-vertical-gap": "5px",
        "--swiper-navigation-color": "white",
      }}
      spaceBetween={30}
      effect={"fade"}
      navigation={{
        nextEl: `.swiper-button-next`,
        prevEl: `.swiper-button-prev`,
      }}
      autoplay={{ delay: 5000 }}
      loop={true}
      pagination={{
        clickable: true,
        el: `.swiper-pagination`,
        bulletElement: `span`,
        bulletClass: `swiper-pagination-bullet`,
      }}
      modules={[EffectFade, Navigation, Pagination, Autoplay]}
      className="mySwiper w-full h-[500px] lg:h-[500px]"
    >
      {Banner.map((item) => (
        <SwiperSlide key={item.id} className="swiper-slide relative">
          <img
            className="w-full h-full brightness-75 lg:h-full object-cover"
            src={item.image}
            alt="Banner"
            loading="lazy"
          />
          <div className="absolute md:hidden inset-0 bg-gray-800 opacity-50"></div>

          <div className="absolute inset-0 flex flex-col justify-center items-center px-4 gap-2 lg:top-18 md:left-24 md:text-start md:gap-3 md:w-1/3">
            <h1 className="text-xl text-center md:text-3xl text-white font-bold uppercase">
              {item.title}
            </h1>
            <p className=" text-sm text-center text-white md:text-xl">
              {item.description}
            </p>
            <Link
              to={item.to}
              className="bg-gradient-to-tr to-blue-700 from-indigo-900 text-white px-4 py-2 rounded mt-4 hover:bg-white hover:text-black"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              mas informacion
            </Link>
          </div>
        </SwiperSlide>
      ))}

      {/* Estilos personalizados con Tailwind CSS */}
      <div className="swiper-button-next bg-gradient-to-tr to-blue-700 from-indigo-900 hidden lg:flex text-white h-10 w-10 p-6 rounded-lg text-xs"></div>
      <div className="swiper-button-prev bg-gradient-to-tr to-blue-700 from-indigo-900 hidden lg:flex text-white h-10 w-10 p-6 rounded-lg text-xs"></div>
      <div className="swiper-pagination text-white">
        <span className="swiper-pagination-bullet bg-white w-2.5 h-2.5 shadow-inner "></span>
      </div>
    </Swiper>
  );
};
