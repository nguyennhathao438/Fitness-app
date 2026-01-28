import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PricingCard from "../../components/member/PricingCard";
import {
  getPackageTypes,
  getTrainingPackages,
} from "../../services/member/TraningPakageService.js";
import CompareFeatures from "../../components/member/CompareFeature.jsx";

export default function PricingPackages() {
  const [packageTypes, setPackageTypes] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [packages, setPackages] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  // Load loại gói
  useEffect(() => {
    getPackageTypes().then((types) => {
      setPackageTypes(types);
      if (types.length > 0) {
        setActiveTab(types[0].id);
      }
    });
  }, []);

  // Load gói theo loại
  useEffect(() => {
    if (!activeTab) return;

    getTrainingPackages(activeTab).then((res) => {
      setPackages(res.data.data);

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = 0;
          checkScrollButtons();
        }
      });
    });
  }, [activeTab]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 px-4 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Đăng ký gói tập
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {packageTypes.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-purple-700 text-white"
                  : "bg-transparent text-purple-700 border-2 border-purple-700 hover:bg-purple-50"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-purple-700" />
            </button>
          )}

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-purple-700" />
            </button>
          )}

          {/* Packages Grid/Carousel */}
          <div
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-6
    overflow-x-scroll overflow-y-hidden
    px-6 pb-4
    snap-x snap-mandatory
    scroll-pl-6
    scrollbar-hidden"
          >
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] min-w-[225px] snap-start"
              >
                <PricingCard package={pkg} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {packages.map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-purple-300 hover:bg-purple-700 transition-colors cursor-pointer"
            />
          ))}
        </div>
      </div>
      <CompareFeatures></CompareFeatures>
    </section>
  );
}
