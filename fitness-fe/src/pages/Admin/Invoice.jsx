import InvoiceList from "@/components/Admin/invoicepage/InvoiceList";
import InvoiceStat from "@/components/Admin/invoicepage/InvoiceStat";
import StatHeader from "@/components/Admin/StatHeader";
import { getInvoice } from "@/services/admin/Invoice";
import {
  CircleDollarSignIcon,
  ClipboardListIcon,
  LayersIcon,
  ScanLineIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Invoice() {
  const [activeTab, setActiveTab] = useState("statsInvoice");
  const [loading, setLoading] = useState(true);
  const [full, setFull] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [revenue, setRevenue] = useState({
  this_month: 0,
  last_month: 0,
  percent_change: 0,
  });
  useEffect (() => {
    getInvoice()
    .then((res) => {
            setFull(res.data.full);
            setInactive(res.data.inactive);
            setRevenue(res.data.revenue);
          })
          .catch((err) => {
            console.error("Error fetching Invoice data:", err);
          }).finally(() => {
            setLoading(false);
          });
  },[]);
  return (
    <div>
      {/* Header */}
      <div className="p-4">
        <h1 className="text-lg sm:text-3xl font-bold">Order Management</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Manage training package invoices and member orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-2 gap-4">
        <StatHeader
          name="Total Orders"
          value={full}
          icon={<ClipboardListIcon className="size-5 text-white" />}
          className1="bg-[#A870FF]"
          loading={loading}
        />
        <StatHeader
          name="Inactive Orders"
          value={inactive}
          icon={<ScanLineIcon className="size-5 text-[#f4cd30]" />}
          className1="bg-[#FEF3C7]"
          loading={loading}
        />
        <StatHeader
        name="Monthly Revenue"
        value={`${revenue.this_month}`}
        subValue={
          <span
            className={`flex items-center gap-1 text-sm font-medium ${
              revenue.percent_change >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {revenue.percent_change >= 0 ? (
              <TrendingUpIcon size={14} />
            ) : (
              <TrendingDownIcon size={14} />
            )}
            {Math.abs(revenue.percent_change)}%
          </span>
        }
        icon={<CircleDollarSignIcon className="size-5 text-[#047857]" />}
        className1="bg-[#D1FAE5]"
        loading={loading}
      />
      </div>
      
      {/* Tabs */}
        <div className="px-7">
          <div className="flex gap-6 border-b border-gray-300">
            {/* Tab: Thống kê */}
            <button
              onClick={() => setActiveTab("statsInvoice")}
              className={`
                            flex items-center gap-2 pb-3
                            text-sm font-medium
                            transition-all
                            ${
                              activeTab === "statsInvoice"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-500"
                            }
                        `}
            >
              <LayersIcon className="size-5" />
              Thống kê
            </button>

            {/* Tab: Danh sách Invoice */}
            <button
              onClick={() => setActiveTab("invoices")}
              className={`
                            flex items-center gap-2 pb-3
                            text-sm font-medium
                            transition-all
                            ${
                              activeTab === "invoices"
                                ? "text-purple-600 border-b-2 border-purple-600"
                                : "text-gray-500 hover:text-purple-500"
                            }
                        `}
            >
              <ClipboardListIcon className="size-5" />
              Danh sách đơn hàng
            </button>
          </div>

          {/* Content */}
          <div className="">
            {activeTab === "statsInvoice" && (
              <InvoiceStat/>
            )}
            {activeTab === "invoices" && <InvoiceList />}
          </div>
        </div>
    </div>
  );
}
