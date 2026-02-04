import { CreditCardIcon, DollarSignIcon } from "lucide-react";
import { useEffect, useState } from "react";
import ProgressBarStat from "../ProgressBarStat";
import { getPayment } from "@/services/admin/Invoice";
import InvoiceBarChart from "./InvoiceBarChart";
import InvoiceLineChart from "./InvoiceLineChart";

export default function InvoiceStat() {
  const [paymentItems, setPaymentItems] = useState([]);

  useEffect(() => {
    getPayment()
      .then((res) => {
        const payments = res.data.payments;

        setPaymentItems([
          { label: "Momo", value: payments.momo || 0, color: "bg-pink-500" },
          { label: "VNPay", value: payments.vnpay || 0, color: "bg-blue-500" },
          { label: "Cash", value: payments.cash || 0, color: "bg-emerald-500" },
        ]);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6 mt-2">
      {/* Row 1: Bar chart + Progress bar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Progress bar - 1 col */}
        <div className="xl:col-span-1">
          <ProgressBarStat
            icon={<CreditCardIcon className="size-5" />}
            title="Phân bố theo phương thức thanh toán"
            items={paymentItems}
          />
        </div>
        {/* Chart - 3 cols */}
        <div className="xl:col-span-3 bg-white rounded-xl shadow p-6 flex items-center justify-center text-gray-400">
          <InvoiceBarChart/>
        </div>
      </div>

      {/* Row 2: Line chart revenue */}
      <div className="bg-white rounded-xl shadow-md">
          <InvoiceLineChart/>
      </div>
    </div>
  );
}

