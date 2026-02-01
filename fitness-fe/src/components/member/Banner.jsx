import { useState, useEffect } from "react";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import banner3 from "../../assets/banner3.png";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function Banner() {
  const listBanner = [banner1, banner2, banner3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const duration = 500; // ms

  const handlePrev = () => {
    setPrevIndex(currentIndex);
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? listBanner.length - 1 : currentIndex - 1);
  };

  const handleNext = () => {
    setPrevIndex(currentIndex);
    const isLastSlide = currentIndex === listBanner.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  // remove prev after animation
  useEffect(() => {
    if (prevIndex === null) return;
    const t = setTimeout(() => setPrevIndex(null), duration);
    return () => clearTimeout(t);
  }, [prevIndex]);

  return (
    <div className="relative">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.02); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.98); }
        }
      `}</style>

      <button onClick={handlePrev} className="absolute z-20 left-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
        <FaArrowLeft size={26} className="text-white" />
      </button>

      <div className="w-full h-[90vh] relative overflow-hidden">
        {/* Previous image (fading out) */}
        {prevIndex !== null && (
          <img
            src={listBanner[prevIndex]}
            alt="banner-prev"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              animation: `fadeOut ${duration}ms ease-in-out forwards`,
            }}
          />
        )}

        {/* Current image (fading in) */}
        <img
          key={currentIndex}
          src={listBanner[currentIndex]}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            animation: `fadeIn ${duration}ms ease-in-out forwards`,
          }}
        />
      </div>

      <button onClick={handleNext} className="absolute z-20 right-5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/40 transition-colors">
        <FaArrowRight size={26} className="text-white" />
      </button>
    </div>
  );
}
// import { useState } from "react";
// import banner1 from "../../assets/img/banner1.jpg"
// import banner2 from "../../assets/img/banner2.jpg"
// import banner3 from "../../assets/img/banner3.png"

// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
// import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
// import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
// export default function Banner() {
//     const listBanner = [banner1, banner2, banner3]
//     const [currentIndex, setCurrentIndex] = useState(0)
//     const handlePrev = () => {
//         const isFirstSlide = currentIndex === 0;
//         setCurrentIndex(isFirstSlide ? listBanner.length - 1 : currentIndex - 1)
//     }
//     const handdleNext = () => {
//         const isLastSlide = currentIndex === listBanner.length - 1
//         setCurrentIndex(isLastSlide ? 0 : currentIndex + 1)
//     }
//     return (
//         <div className="relative">
//             <FaArrowLeft size={30} onClick={() => handlePrev()} className="text-amber-50 absolute top-1/2 ml-5 cursor-pointer" />
//             <div className="w-full h-[90vh] overflow-hidden">
//                 <img
//                     src={listBanner[currentIndex]}
//                     alt="banner"
//                     className="w-full h-full object-cover transition-all duration-500"
//                 />
//             </div>
//             <FaArrowRight size={30} onClick={() => { handdleNext() }} className="text-amber-50 absolute top-1/2 right-0.5 mr-5 cursor-pointer" />
//         </div>
//     );
// }