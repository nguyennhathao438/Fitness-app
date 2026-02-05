import {
  FileTextIcon,
  UserIcon,
  CreditCardIcon,
  CalendarIcon,
  PackageIcon,
  ClockIcon,
  BadgeCheckIcon,
  AlertCircleIcon,
  XCircleIcon,
} from "lucide-react";

export default function InvoiceDetail({ invoice }) {
  if (!invoice) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-rose-100 text-rose-700 border-rose-200";
    }
  };
    const getPaymentStyle = (method) => {
  switch (method) {
        case "momo":
        return "bg-pink-100 text-pink-700 border-pink-200";
        case "vnpay":
        return "bg-blue-100 text-blue-700 border-blue-200";
        case "cash":
        return "bg-gray-100 text-gray-700 border-gray-200";
        case "card":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
        default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
    };

  return (
    <div className="
      bg-white rounded-2xl border border-gray-100 shadow-sm
      max-w-4xl w-full sm:w-[560px] md:w-[620px] lg:w-[700px] mx-auto
      max-sm:h-1/2 sm:h-1/2 md:h-3/4 lg:h-[400px] overflow-y-auto
    ">
      {/* HEADER */}
    <div className="
    px-4 sm:px-6 py-4
    border-b
    flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3
    bg-gradient-to-r from-purple-50 via-pink-50 to-white
    ">
    <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
        <FileTextIcon size={18} />
        </div>
        <div>
        <h2 className="text-base sm:text-lg font-bold text-gray-800">
            Order Details
        </h2>
        <p className="text-xs sm:text-sm text-gray-500">
            ID: <span className="font-mono">#{invoice.id}</span>
        </p>
        </div>
    </div>

    <span
        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border w-fit ${getStatusStyle(
        invoice.status
        )}`}
    >
        {invoice.status === "paid" && <BadgeCheckIcon size={14} />}
        {invoice.status === "pending" && <AlertCircleIcon size={14} />}
        {invoice.status !== "paid" && invoice.status !== "pending" && (
        <XCircleIcon size={14} />
        )}
        {invoice.status.toUpperCase()}
    </span>
    </div>


      {/* BODY */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT */}
        <div className=" p-4 sm:p-6 space-y-6">
          {/* CUSTOMER */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <UserIcon size={14} className="text-purple-500" />
                Customer Information
            </h3>

            <div className="flex items-center gap-3">
              <img
                src={
                  invoice.member.avatar ||
                  "https://ui-avatars.com/api/?name=User"
                }
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-sm sm:text-base">
                  {invoice.member.name}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  {invoice.member.email}
                </p>
              </div>
            </div>
          </section>

          <hr className="border-dashed" />

          {/* PAYMENT */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <CreditCardIcon size={14} className="text-indigo-500" />
                Payment Details
            </h3>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="items-center gap-2 space-y-2">
                    <p className="text-xs text-gray-500">Created_date</p>
                    <div className="flex gap-2 items-center">
                        <CalendarIcon size={14} className="text-gray-400" />
                        <p className="font-medium">
                        {new Date(invoice.created_at).toLocaleDateString("vi-VN")}
                        </p>  
                    </div>
                </div>

                <div className="items-center gap-2 space-y-2">
                    <p className="text-xs text-gray-500">Payment Method</p>
                    <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold w-fit
                            ${getPaymentStyle(invoice.payment_method)}
                        `}
                        >
                        <CreditCardIcon size={14} />
                        {invoice.payment_method.toUpperCase()}
                    </div>

                </div>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-50 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l ">
          <section className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                <PackageIcon size={14} className="text-pink-500" />
                Package Summary
            </h3>


            <div className="bg-white rounded-xl border p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500">Package</p>
                <p className="font-semibold">{invoice.package.name}</p>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">
                  {invoice.package.package_type?.name || "Standard"}
                </span>
              </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium flex items-center gap-1">
                        <ClockIcon size={14} className="text-gray-400" />
                        {invoice.package.duration_days} days
                    </span>
                </div>

            </div>

          </section>

          {/* TOTAL */}
            <div className="
                pt-4 mt-6 border-t border-dashed
                flex justify-between items-center
                bg-gradient-to-r from-transparent via-purple-50 to-transparent
                ">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-purple-600">
                    {Number(invoice.package.price).toLocaleString()} ₫
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
