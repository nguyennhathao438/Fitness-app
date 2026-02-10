import { useEffect, useState } from "react";
import { Plus, Layers, BarChart3, ListFilter, Activity, Package as PackageIcon } from "lucide-react"; 
import { toast } from "react-toastify";
import PackageList from "../../components/Admin/packagepage/PackageList";
import PackageForm from "../../components/Admin/packagepage/PackageForm";
import PackageTypeList from "../../components/Admin/packagepage/PackageTypeList";
import PackageTypeForm from "../../components/Admin/packagepage/PackageTypeForm";
import ServiceList from "../../components/Admin/packagepage/ServiceList"; 
import ServiceForm from "../../components/Admin/packagepage/ServiceForm"; 
import Dialog from "../../components/Admin/Dialog";
import { createPackage, getPackageStats } from "../../services/admin/Package";
import { createPackageType } from "../../services/admin/PackageTypeService";
import { createService } from "../../services/admin/PackageTypeService";

//  StatCard
const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 flex-1">
    <div className={`p-2 rounded-xl ${bgColorClass} ${colorClass}`}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
  </div>
);

export default function Package() {
  const [activeTab, setActiveTab] = useState("list");
  const [openForm, setOpenForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 
  const [loading, setLoading] = useState(false);
  
  const [stats, setStats] = useState({ total_packages: 0, total_types: 0, total_services: 0 });

  useEffect(() => {
    getPackageStats()
      .then(res => {
        const data = res.data.data || res.data;
        setStats({
          total_packages: data.total_packages || 0,
          total_types: data.total_types || 0,
          total_services: data.total_services || 0
        });
      })
      .catch(err => console.error("Lỗi tải thống kê:", err));
  }, [refreshKey]);

  const handleCreate = async (formData) => {
      setLoading(true);

      const tabNames = {
          list: "gói tập",
          types: "loại gói tập",
          services: "dịch vụ"
      };

      const itemName = tabNames[activeTab] || "mục";

      try {
          if (activeTab === "list") {
              await createPackage(formData);
          } else if (activeTab === "types") {
              await createPackageType(formData);
          } else if (activeTab === "services") {
              await createService(formData);
          }
          toast.success(`Thêm ${itemName} thành công!`);

          setOpenForm(false);
          setRefreshKey((prev) => prev + 1); 
          
      } catch (error) {
          toast.error(`Thêm ${itemName} thất bại. Vui lòng thử lại.`);
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Dịch vụ & Gói tập</h1>
          <p className="text-gray-500 text-sm mt-1">Cấu hình các gói tập và dịch vụ đi kèm</p>
        </div>
        
        {activeTab !== 'stats' && (
            <button 
              onClick={() => setOpenForm(true)} 
              className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all active:scale-95"
            >
              <Plus size={20} /> 
              <span className="font-semibold">
                {activeTab === "list" ? "Thêm Gói Mới" : activeTab === "types" ? "Thêm Loại Gói Tập" : "Thêm Dịch Vụ"}
              </span>
            </button>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <StatCard title="Tổng Gói tập" value={stats.total_packages} icon={PackageIcon} colorClass="text-purple-600" bgColorClass="bg-purple-100" />
        <StatCard title="Loại Gói tập" value={stats.total_types} icon={ListFilter} colorClass="text-green-600" bgColorClass="bg-green-100" />
        <StatCard title="Dịch vụ đi kèm" value={stats.total_services} icon={Activity} colorClass="text-blue-600" bgColorClass="bg-blue-100" />
      </div>

      {/* TABS */}
      <div className="flex gap-8 border-b border-gray-200 mb-6 overflow-x-auto">
        <TabButton active={activeTab === "list"} onClick={() => setActiveTab("list")} icon={<Layers size={18}/>} label="Danh Sách Gói" />
        <TabButton active={activeTab === "types"} onClick={() => setActiveTab("types")} icon={<ListFilter size={18}/>} label="Loại Gói Tập" />
        <TabButton active={activeTab === "services"} onClick={() => setActiveTab("services")} icon={<Activity size={18}/>} label="Dịch Vụ Đi Kèm" />
        {/* <TabButton active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<BarChart3 size={18}/>} label="Thống kê" /> */}
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        {activeTab === "list" && <PackageList refreshKey={refreshKey} onChanged={() => setRefreshKey(p => p + 1)} />}
        {activeTab === "types" && <PackageTypeList refreshKey={refreshKey} onChanged={() => setRefreshKey(p => p + 1)} />}
        {activeTab === "services" && <ServiceList refreshKey={refreshKey} onChanged={() => setRefreshKey(p => p + 1)} />}
        {activeTab === "stats" && <div className="p-10 text-center text-gray-400 border-2 border-dashed rounded-xl">Tính năng đang phát triển...</div>}
      </div>

      {/* DIALOG FORM */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        {activeTab === "list" ? (
            <PackageForm key="add-pkg" mode="add" onClose={() => setOpenForm(false)} onSubmit={handleCreate} loading={loading} />
        ) : activeTab === "types" ? (
            <PackageTypeForm key="add-type" mode="add" onClose={() => setOpenForm(false)} onSubmit={handleCreate} loading={loading} />
        ) : (
            <ServiceForm key="add-sv" mode="add" onClose={() => setOpenForm(false)} onSubmit={handleCreate} loading={loading} />
        )}
      </Dialog>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`pb-3 flex items-center gap-2 font-semibold text-sm transition-all relative whitespace-nowrap ${
      active ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-purple-600"
    }`}
  >
    {icon} {label}
  </button>
);