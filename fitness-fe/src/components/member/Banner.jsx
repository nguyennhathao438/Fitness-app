import { useState } from "react";
import banner1 from "../../assets/img/banner1.jpg"
import banner2 from "../../assets/img/banner2.jpg"
import banner3 from "../../assets/img/banner3.png"

import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
export default function Banner() {
    const listBanner = [banner1, banner2, banner3]
    const [currentIndex, setCurrentIndex] = useState(0)
    const handlePrev = () => {
        const isFirstSlide = currentIndex === 0;
        setCurrentIndex(isFirstSlide ? listBanner.length - 1 : currentIndex - 1)
    }
    const handdleNext = () => {
        const isLastSlide = currentIndex === listBanner.length - 1
        setCurrentIndex(isLastSlide ? 0 : currentIndex + 1)
    }
    return (
        <div className="relative">
            <FaArrowLeft size={30} onClick={() => handlePrev()} className="text-amber-50 absolute top-1/2 ml-5 cursor-pointer" />
            <div className="w-full h-[90vh] overflow-hidden">
                <img
                    src={listBanner[currentIndex]}
                    alt="banner"
                    className="w-full h-full object-cover transition-all duration-500"
                />
            </div>
            <FaArrowRight size={30} onClick={() => { handdleNext() }} className="text-amber-50 absolute top-1/2 right-0.5 mr-5 cursor-pointer" />
        </div>
    );
}