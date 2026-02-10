import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Clock, Calendar, Crown, CalendarPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUpgradableTypes, getUpgradablePackagesByType, getCurrentPackageInfo } from "../../services/member/TraningPakageService";
import PricingCard from "../../components/member/PricingCard";

export default function UpgradePackagePage() {
  const [packageTypes, setPackageTypes] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const { member } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const checkScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  const handleRenew = () => {
    if (currentPackage && currentPackage.package_id) {
        navigate(`/member/payment/${currentPackage.package_id}`, { 
            state: { isExtend: true } 
        });
    }
  };

  // Load Thông tin gói hiện tại & Loại gói nâng cấp
  useEffect(() => {
    setLoading(true);
    setPackageTypes([]);
    setActiveTab(null);
    setPackages([]);
    setCurrentPackage(null);

    if (member?.id) {
      // Lấy gói hiện tại & Lấy danh sách nâng cấp
      Promise.all([
        getCurrentPackageInfo(),
        getUpgradableTypes(member.id)
      ]).then(([curPkgRes, typesRes]) => {
          if (curPkgRes.data.success) {
            setCurrentPackage(curPkgRes.data.data);
          }

          if (typesRes && typesRes.length > 0) {
            setPackageTypes(typesRes);
            setActiveTab(typesRes[0].id);
          } else {
             setLoading(false);
          }
      }).catch(err => {
          console.error(err);
          setLoading(false);
      });
    } else {
        setLoading(false);
    }
  }, [member]);

  // 2. Load Gói theo Tab
  useEffect(() => {
    if (!activeTab || !member?.id) return;

    getUpgradablePackagesByType(member.id, activeTab).then((data) => {
      setPackages(data);

      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = 0;
          checkScrollButtons();
        }
      });
    })
    .catch(err => console.error(err))
    .finally(() => {
        setLoading(false);
    });
  }, [activeTab, member]);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const formatDate = (dateString) => {
      if(!dateString) return "";
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Nâng cấp & Gia hạn
        </h2>

        {/* CARD GÓI TẬP HIỆN TẠI */}
        {currentPackage && (
            <div className="mb-10 relative overflow-hidden rounded-2xl bg-gray-900 shadow-xl border border-yellow-500/20">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full pointer-events-none -ml-16 -mb-16"></div>

                <div className="relative z-10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        {/* Tên gói */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Crown className="w-5 h-5 text-yellow-400" />
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                                    Gói tập hiện tại của bạn
                                </span>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                                {currentPackage.package_name}
                            </h3>
                        </div>

                        {/*Thông tin chi tiết */}
                        <div className="flex gap-4 w-full md:w-auto">
                            {/* Box Thời hạn */}
                            <div className="flex-1 md:flex-none bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[140px]">
                                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                                    <Clock className="w-4 h-4" />
                                    Thời hạn
                                </div>
                                <p className="text-white text-lg font-bold">
                                    {currentPackage.duration_days} ngày
                                </p>
                            </div>

                            {/* Box Hết hạn */}
                            <div className="flex-1 md:flex-none bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 min-w-[140px]">
                                <div className="flex items-center gap-2 text-gray-400 text-xs uppercase font-bold mb-1">
                                    <Calendar className="w-4 h-4" />
                                    Hết hạn
                                </div>
                                <p className="text-yellow-400 text-lg font-bold">
                                    {formatDate(currentPackage.valid_until)}
                                </p>
                            </div>
                            {/* NÚT GIA HẠN */}
                            <button
                                onClick={handleRenew}
                                className="px-6 py-3 bg-white hover:bg-gray-100 text-purple-700 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 border-2 border-transparent hover:border-purple-200"
                            >
                                <CalendarPlus className="w-5 h-5" />
                                Gia hạn ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {packageTypes.length > 0 ? (
          <>
            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {packageTypes.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-purple-700 text-white shadow-lg shadow-purple-700/30"
                      : "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 hover:border-purple-300"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden group/carousel">
              {canScrollLeft && (
                <button
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 group-hover/carousel:translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-100"
                >
                  <ChevronLeft className="w-6 h-6 text-purple-700" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={() => scroll("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 group-hover/carousel:-translate-x-2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-300 border border-gray-100"
                >
                  <ChevronRight className="w-6 h-6 text-purple-700" />
                </button>
              )}

              <div
                ref={scrollRef}
                onScroll={checkScrollButtons}
                className="flex gap-6
                  overflow-x-scroll overflow-y-hidden
                  px-6 pb-8 pt-2
                  snap-x snap-mandatory
                  scroll-pl-6
                  scrollbar-hidden"
              >
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] min-w-[220px] snap-start"
                  >
                    <PricingCard package={pkg} isUpgrade={true} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-2">
              {packages.map((_, index) => (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-purple-600 transition-colors cursor-pointer"
                />
              ))}
            </div>
          </>
        ) : (
          /* TRƯỜNG HỢP ĐỈNH CAO */
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-slow">
              <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Bạn đang ở đỉnh cao!
            </h3>
            <p className="text-gray-500 mb-8 px-4">
              Bạn đang sở hữu gói tập cao cấp nhất hệ thống.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-white border border-purple-600 text-purple-700 font-bold rounded-full hover:bg-purple-50 transition-colors"
            >
              Quay lại trang chủ
            </button>
          </div>
        )}
      </div>
    </section>
  );
}