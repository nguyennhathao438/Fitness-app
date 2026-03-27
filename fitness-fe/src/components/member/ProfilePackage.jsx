import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  BarChart2, 
  CheckSquare, 
  Repeat, 
  ArrowUpCircle,
  History,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentPackageInfo, getMemberInvoiceHistory } from '../../services/member/TraningPakageService'; 

export default function ProfilePackage() {
  const { member } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [currentPackage, setCurrentPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (member?.id) {
      setLoading(true);
      
      Promise.all([
        getCurrentPackageInfo().catch(err => {
          console.error("Lỗi lấy thông tin gói tập:", err);
          return null; 
        }),
        getMemberInvoiceHistory().catch(err => {
          console.error("Lỗi lấy lịch sử giao dịch:", err);
          return null;
        })
      ])
        .then(([packageRes, historyData]) => {
          // Xử lý gói hiện tại
          if (packageRes && packageRes.data && packageRes.data.success) {
            setCurrentPackage(packageRes.data.data);
          }
          
          // Xử lý lịch sử giao dịch 
          if (historyData) {
            setHistory(historyData);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [member]);

  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const getPaymentMethodBadge = (method) => {
    switch (method?.toLowerCase()) {
      case 'momo':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
            MoMo
          </span>
        );
      case 'vnpay':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            VNPay
          </span>
        );
      case 'cash':
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
            Tiền mặt
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            {method || 'Khác'}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-screen text-lg font-semibold text-gray-700">
          {/* Vòng tròn xoay */}
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4">Đang tải trang...</p>
        </div>
      </>
    );
  }

  return (
    <section className="py-8 px-4 bg-gray-50 min-h-full font-sans">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* GÓI TẬP HIỆN TẠI  */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Gói Tập Hiện Tại
          </h2>

          {!currentPackage ? (
            /* Trạng thái chưa có gói tập */
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center">
              <p className="text-gray-500 mb-5">Bạn hiện chưa đăng ký gói tập nào đang hoạt động.</p>
              <button 
                onClick={() => navigate('/pricing-packages')} 
                className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
              >
                Đăng Ký Ngay
              </button>
            </div>
          ) : (
            /* Trạng thái đang có gói tập */
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Gói Tập</p>
                    <h3 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
                      {currentPackage.package_name}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm">
                      {currentPackage.description || "Toàn diện • PT • Spa • Hồ bơi"}
                    </p>
                  </div>
                </div>
                <div className="md:text-right mt-1 md:mt-0">
                  <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1">Giá gói</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {Number(currentPackage.price || currentPackage.package_price || 0).toLocaleString('vi-VN')} đ
                  </p>
                </div>
              </div>

              {/* Thông tin chi tiết */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 text-xs font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                    <Clock size={14} className="text-rose-500" /> Ngày Hết Hạn
                  </p>
                  <p className="text-lg font-bold text-gray-900">{formatDate(currentPackage.valid_until)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 text-xs font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                    <BarChart2 size={14} className="text-blue-500" /> Số Ngày Còn Lại
                  </p>
                  <p className="text-lg font-bold text-gray-900">{currentPackage.days_remaining} ngày</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                  <p className="text-gray-500 text-xs font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                    <CheckSquare size={14} className="text-emerald-500" /> Trạng Thái
                  </p>
                  <p className="text-lg font-bold text-emerald-600">
                    {currentPackage.days_remaining > 0 ? "Đang Hoạt Động" : "Đã Hết Hạn"}
                  </p>
                </div>
              </div>

              {/* Nút Hành Động */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                <button 
                  onClick={() => navigate('/upgrade')}
                  className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  <Repeat size={16} /> Gia Hạn Gói
                </button>
                
                <button 
                  onClick={() => navigate('/upgrade')}
                  className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-md shadow-blue-600/20"
                >
                  <ArrowUpCircle size={16} /> Nâng Cấp Ngay
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LỊCH SỬ MUA GÓI */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <History size={24} className="text-blue-600"/> Lịch Sử Mua Gói
          </h2>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-bold">Gói Tập</th>
                    <th className="px-6 py-4 font-bold">Số Tiền</th>
                    <th className="px-6 py-4 font-bold">Ngày Mua</th>
                    <th className="px-6 py-4 font-bold">Thanh toán</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-700">{item.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-600">
                        {Number(item.price).toLocaleString('vi-VN')} đ
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.purchaseDate)}</td>
                      <td className="px-6 py-4">
                        {getPaymentMethodBadge(item.payment_method)}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                        Bạn chưa có lịch sử giao dịch nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}