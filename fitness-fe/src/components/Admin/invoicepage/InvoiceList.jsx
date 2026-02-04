import { useEffect, useState } from "react";
import {
  SearchIcon,
  FilterIcon,
  CreditCardIcon,
  EyeIcon,
  TrashIcon,
} from "lucide-react";
import { deleteInvoice, getInvoice } from "@/services/admin/Invoice";
import Pagination from "../Pagination";
import DeletedDialog from "../DeletedDialog";
import { toast } from "react-toastify";
import Dialog from "../Dialog";
import InvoiceDetail from "./InvoiceDetail";
import { set } from "zod";

export default function InvoiceList() {
    const [keyword, setkeyword] = useState("");
    const [status, setStatus] = useState("");
    const [payment_method, setpayment_method] = useState("");
    const [loading,setLoading] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState(null);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [invoices,setInvoices] = useState([]);
    const [openDelete,setOpenDelete] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [openForm,setOpenForm] = useState(false);

    const paymentStyles = {
      momo: "bg-pink-100 text-pink-600",
      vnpay: "bg-blue-100 text-blue-600",
      cash: "bg-gray-100 text-gray-600",
    };

    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      reject: "bg-red-100 text-red-600",
    };

    const fetchInvoice = () => {
      setLoading(true);
      return getInvoice({
        page,keyword: debouncedSearch,payment_method,status,fromDate,toDate,
      }). then(res => {
        setInvoices(res.data.data.data);
        setMeta(res.data.data);
        console.log("setInvoices",res.data.data.data);
      }).finally(()=>setLoading(false));
    };
    useEffect(() => {
      fetchInvoice();
      }, [page, debouncedSearch, payment_method, status,fromDate,toDate]);
    
    useEffect(() => {
      const timer = setTimeout(() => {
      setDebouncedSearch(keyword);
      }, 400);
      return () => clearTimeout(timer);}, [keyword]);
  
    useEffect(() => {
      setPage(1);
      }, [debouncedSearch, payment_method,status,fromDate,toDate]);
  return (
    <>
    <div className="space-y-4 p-3">

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-sm p-4
                      flex flex-col gap-3
                      lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2
                                size-4 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            placeholder="Search package name, member name..."
            className="w-full pl-9 pr-4 py-2
                      border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-purple-500
                      focus:outline-none text-sm"
          />
        </div>
        {/* From date */}
        <div className="relative w-full sm:w-[180px]">
        <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2
                    border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-500
                    focus:outline-none text-sm"
        />
        </div>

        {/* To date */}
        <div className="relative w-full sm:w-[180px]">
        <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2
                    border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-purple-500
                    focus:outline-none text-sm"
        />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3
                        w-full lg:w-auto">

          {/* Status */}
          <div className="relative w-full sm:w-[180px]">
            <FilterIcon className="absolute left-3 top-1/2 -translate-y-1/2
                                  size-4 text-gray-400" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full pl-9 pr-3 py-2
                        border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-500
                        focus:outline-none text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="reject">Rejected</option>
            </select>
          </div>

          {/* Payment */}
          <div className="relative w-full sm:w-[180px]">
            <CreditCardIcon className="absolute left-3 top-1/2 -translate-y-1/2
                                      size-4 text-gray-400" />
            <select
              value={payment_method}
              onChange={(e) => setpayment_method(e.target.value)}
              className="w-full pl-9 pr-3 py-2
                        border border-gray-300 rounded-lg
                        focus:ring-2 focus:ring-purple-500
                        focus:outline-none text-sm"
            >
              <option value="">All Payments</option>
              <option value="vnpay">VNPAY</option>
              <option value="momo">MOMO</option>
              <option value="cash">Cash</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-lg border bg-white overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Member</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((o) => (
                <tr
                    key={o.id}
                    className="
                        border-t
                        transition-all duration-200
                        bg-white
                        hover:bg-gray-50 hover:overflow-x-hidden
                    "
                    >
                    <td className="px-4 py-3 font-medium text-gray-600">
                        {o.member.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-medium">
                        {o.package.name}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${paymentStyles[o.payment_method] || "bg-gray-100 text-gray-600"}`}
                      >
                        {o.payment_method.toUpperCase()}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${statusStyles[o.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {o.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                        <div className="flex gap-3">
                        <button
                            className="p-2 rounded-lg
                                    bg-blue-100 text-blue-600
                                    hover:bg-blue-200 transition"
                            onClick={() => {
                              setSelectedInvoice(o);
                              setOpenForm(true);
                            }}
                        >
                            <EyeIcon size={16} />
                        </button>
                        <button
                            className="p-2 rounded-lg
                                    bg-red-100 text-red-600
                                    hover:bg-red-200 transition"
                            onClick={() => {
                              setSelectedInvoice(o);
                              setOpenDelete(true);
                            }}
                        >
                            <TrashIcon size={16} />
                        </button>
                        </div>
                    </td>
                    </tr>

              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
        <div className="">
          {meta && meta.last_page > 1 && (
            <Pagination meta={meta} onPageChange={(p) => setPage(p)}/>
            )}
        </div>
    </div>

    {/* Delete Dialog */}
            <DeletedDialog
              open={openDelete}
              onClose={() => setOpenDelete(false)}
              onConfirm={async () => {
                try {
                  await deleteInvoice(selectedInvoice.id);

                  toast.success("Xóa đơn hàng thành công");

                  setOpenDelete(false);
                  fetchInvoice();
                } catch (err) {
                  toast.error("Xóa thất bại");
                }
              }}
              name="đơn hàng"
            />
    {/* View Dialog */}
                <Dialog open={openForm} onClose={() => setOpenForm(false)}>         
              <InvoiceDetail invoice={selectedInvoice}/>
                </Dialog>
    </>
  );
}
