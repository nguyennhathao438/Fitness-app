import { Skeleton } from "@/components/ui/skeleton";
import { getInvoiceThisMonth } from "@/services/admin/Invoice";
import { getMemberThisMonth } from "@/services/admin/StatUserInformation";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  UsersIcon,
  ShoppingCartIcon,
  BarChart3Icon,
  DollarSignIcon,
  DumbbellIcon,
  TrophyIcon,
} from "lucide-react";
import UserBarChart from "@/components/Admin/dashboard/UserBarChart";


export default function Dashboard() {
  const [memberLoading,setMemberLoading] = useState(true);
  const [invoiceLoading,setInvoiceLoading] = useState(true);
  const [memberMonth,setMemberMonth] = useState({
    this_month: 0,
    last_month: 0,
    percent_change: 0,
  });
  const [invoiceMonth,setInvoiceMonth] = useState({
    this_month: 0,
    last_month: 0,
    percent_change: 0,
  });
  useEffect(() => {
    getMemberThisMonth()
    .then((res) => {setMemberMonth(res.data.data);})
    .catch((err) => {
      console.error("Error fetching MemberThisMonth data",err);
    }).finally(() => {setMemberLoading(false);});
    getInvoiceThisMonth()
    .then((res) => {setInvoiceMonth(res.data.invoice);})
    .catch((err) => {
      console.error("Error fetching InvoiceThisMonth data",err);
    }).finally(() => {
      setInvoiceLoading(false);
    });
  },[])
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">
          System Overview & Monthly Statistics
        </p>
      </div>

      {/* ===== BLOCK 1 ===== */}
      {/* Member + Order (left) | User chart (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left: Member + Order */}
        <div className="space-y-8">
          {/* Member */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-2/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-100">
               <UsersIcon className="size-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-700">
                Member This Month
              </h3>
            </div>

            {memberLoading ? (
              <div className="space-y-2">
            <Skeleton className="h-4 w-32" />  
            <Skeleton className="h-8 w-24" />  
            <Skeleton className="h-3 w-16" />  
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-purple-600">
                  {memberMonth.this_month}
                </p>
                <div
                  className={`flex items-center gap-1 text-sm font-medium
                    ${
                      memberMonth.percent_change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >
                  {memberMonth.percent_change >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>
                    {memberMonth.percent_change >= 0 ? "+" : ""}
                    {memberMonth.percent_change}%
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Order */}
          <div className="bg-white rounded-xl shadow-sm p-6 h-2/5">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <ShoppingCartIcon className="size-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-700">
                Order This Month
              </h3>
            </div>
            {invoiceLoading ? (
              <div className="space-y-2">
            <Skeleton className="h-4 w-32" />  
            <Skeleton className="h-8 w-24" />  
            <Skeleton className="h-3 w-16" />  
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-green-500">
                  {invoiceMonth.this_month}
                </p>
                <div
                  className={`flex items-center gap-1 text-sm font-medium
                    ${
                      invoiceMonth.percent_change >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                >
                  {invoiceMonth.percent_change >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  <span>
                    {invoiceMonth.percent_change >= 0 ? "+" : ""}
                    {invoiceMonth.percent_change}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: User Registration Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-100">
              <BarChart3Icon className="size-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              User Registration Statistics
            </h2>
          </div>
          <div className="h-[300px] flex items-center justify-center text-gray-400">
            <UserBarChart/>
          </div>
        </div>
      </div>
      {/* ===== BLOCK 3 ===== */}
      {/* Member Training Destiny */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-orange-100">
            <DumbbellIcon className="size-5 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            Member Training Destiny
          </h2>
        </div>
        <div className="h-[250px] flex items-center justify-center text-gray-400">
          Chart here
        </div>
      </div>

      {/* ===== BLOCK 4 ===== */}
      {/* Top 5 tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top 5 Active Longest Members */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100">
              <TrophyIcon className="size-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-700">
              Top 5 Longest Active Members
            </h3>
          </div>
          <div className="text-gray-400 text-center py-10">
            Table here
          </div>
        </div>

        {/* Top 5 Best Seller Training Package */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-pink-100">
              <ShoppingCartIcon className="size-5 text-pink-600" />
            </div>
            <h3 className="font-semibold text-gray-700">
              Top 5 Best Seller Training Package
            </h3>
          </div>
          <div className="text-gray-400 text-center py-10">
            Table here
          </div>
        </div>

      </div>

    </div>
  );
}
