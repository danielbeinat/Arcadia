import { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Autoplay } from "swiper/modules";
import { Banner } from "../../assets/BannerSlider/BannerSlider";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

interface Item {
  id: number;
  image: string;
  title: string;
  description: string;
  to: string;
}

export const Slider: React.FC = () => {
  const swiperStyle: CSSProperties = {
    "--swiper-pagination-color": "rgb(255, 255, 255)",
    "--swiper-pagination-bullet-inactive-color": "rgb(255, 255, 255)",
    "--swiper-pagination-bullet-inactive-opacity": "0.5",
    "--swiper-pagination-bullet-size": "10px",
    "--swiper-pagination-bullet-horizontal-gap": "8px",
  } as CSSProperties;

  return (
    <div className="relative group">
      <Swiper
        style={swiperStyle}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          bulletClass:
            "inline-block h-2.5 w-2.5 rounded-full bg-white/50 cursor-pointer transition-all duration-300 hover:scale-125",
          bulletActiveClass: "!bg-white scale-125",
        }}
        modules={[EffectFade, Pagination, Autoplay]}
        className="w-full h-[600px] lg:h-[80vh]"
      >
        {Banner.map((item: Item) => (
          <SwiperSlide key={item.id} className="relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
              <img
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[2000ms]"
                src={item.image}
                alt={item.title}
                loading="lazy"
              />
            </div>

            <div className="relative z-20 h-full container mx-auto px-6">
              <div className="flex flex-col justify-center h-full max-w-3xl">
                <span className="text-emerald-400 text-sm md:text-base uppercase tracking-wider mb-4 font-medium">
                  Descubre más
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {item.title}
                </h1>
                <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed max-w-xl">
                  {item.description}
                </p>
                <Link
                  to={item.to}
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm text-white 
                    px-8 py-4 rounded-full font-medium border border-white/20
                    hover:bg-white hover:text-slate-900 transform hover:scale-105 
                    transition-all duration-300 w-fit relative overflow-hidden"
                >
                  <span className="relative z-10">Más información</span>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
          <div className="custom-pagination flex gap-3 px-4 py-2 rounded-full bg-black/20 backdrop-blur-sm"></div>
        </div>
      </Swiper>
    </div>
  );
};
