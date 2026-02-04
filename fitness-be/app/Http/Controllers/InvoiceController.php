<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    // lấy danh sách hóa đơn
    public function getInvoice(Request $request){
        $query = Invoice::with([
            'package:id,name,duration_days,price,package_type_id',
            'member:id,name,email,avatar',
            'package.packageType:id,name',
        ]) -> where('is_deleted',false);
    // Tìm kiếm theo tên gói và tên người dùng
        if($request->filled('keyword')){
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->whereHas('member', function ($m) use ($keyword) {
                    $m->where('name', 'like', "%{$keyword}%");
                })
                ->orWhereHas('package', function ($p) use ($keyword) {
                    $p->where('name', 'like', "%{$keyword}%");
                });
            });
        }
    // lọc theo phương thức thanh toán
        if($request->filled('payment_method')){
            $query->where('payment_method', $request->payment_method);
        }
    // lọc theo trạng thái đơn
        if($request->filled('status')){
            $query->where('status', $request->status);
        }
    // lọc theo từ ngày đến ngày
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

    // Thống kê tổng đơn
        $full = Invoice::where('is_deleted', false)->count();
    // Thống kê đơn chưa đặt
        $Inactive = Invoice::where('is_deleted',false)
        ->where('status','pending')
        ->count();
    // Thống kê tiền tháng này
        $moneyThisMonth = Invoice::where('status', 'paid')
        ->whereMonth('invoices.created_at', Carbon::now()->month)
        ->whereYear('invoices.created_at', Carbon::now()->year)
        ->join('training_packages', 'training_packages.id', '=', 'invoices.package_id')
        ->sum('training_packages.price');
    // Thống kê tiền tháng trước
        $moneyLastMonth = Invoice::where('status', 'paid')
        ->whereMonth('invoices.created_at', Carbon::now()->subMonth()->month)
        ->whereYear('invoices.created_at', Carbon::now()->subMonth()->year)
        ->join('training_packages', 'training_packages.id', '=', 'invoices.package_id')
        ->sum('training_packages.price');

        if ($moneyLastMonth > 0) {
            $percentChange = (($moneyThisMonth - $moneyLastMonth) / $moneyLastMonth) * 100;
        } else {
            // tháng trước = 0
            $percentChange = $moneyThisMonth > 0 ? 100 : 0;
        }
        $percentChange = round($percentChange, 2);

    // PHÂN TRANG (6 ITEM / TRANG)
        $invoice = $query
            ->orderByDesc('id')
            ->paginate(7);
    // TRẢ JSON CHO FRONTEND
        return response()->json([
            'success' => true,
            'full' => $full,
            'data' => $invoice,
            'inactive' => $Inactive,
            'revenue' => [
            'this_month' => $moneyThisMonth,
            'last_month' => $moneyLastMonth,
            'percent_change' => $percentChange,
        ],
        ]);
    }
    // delete invoice
    public function deleteInvoice($InvoiceId){
        $invoice = Invoice::find($InvoiceId);

        if(!$invoice) {
            return response()->json(['message' => 'invoice khong ton tai',404]);
        }

        $invoice->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'xóa invoice thành công'
        ]);
    }
    // lấy số lượng order tháng này
    public function getInvoiceThisMonth(){
        // Thống kê tiền tháng này
        $invoiceThisMonth = Invoice::where('is_deleted',false)
        ->whereMonth('invoices.created_at', Carbon::now()->month)
        ->whereYear('invoices.created_at', Carbon::now()->year)
        ->count();
        // Thống kê tiền tháng trước
        $invoiceLastMonth = Invoice::where('is_deleted',false)
        ->whereMonth('invoices.created_at', Carbon::now()->subMonth()->month)
        ->whereYear('invoices.created_at', Carbon::now()->subMonth()->year)
        ->count();

        if ($invoiceLastMonth > 0) {
            $percentChange = (($invoiceThisMonth - $invoiceLastMonth) / $invoiceLastMonth) * 100;
        } else {
            // tháng trước = 0
            $percentChange = $invoiceThisMonth > 0 ? 100 : 0;
        }
        $percentChange = round($percentChange, 2);
        return response()->json([
            'success' => true,
            'invoice' => [
            'this_month' => $invoiceThisMonth,
            'last_month' => $invoiceLastMonth,
            'percent_change' => $percentChange,
        ],
        ]);
    }
    // lấy số lượng invoice theo payment
    public function getPayment(){
        $momo = Invoice::select('payment_method')
        -> where('payment_method','momo')
        -> where('is_deleted',false)
        -> count();
        $vnpay = Invoice::select('payment_method')
        -> where('payment_method','vnpay')
        -> where('is_deleted',false)
        -> count();
        $cash = Invoice::select('payment_method')
        -> where('payment_method','cash')
        -> where('is_deleted',false)
        -> count();
        $total = $momo + $vnpay + $cash;
        return response()->json([
            'success' => true,
            'total' => $total,
            'payments' => [
            'momo' => $momo,
            'vnpay' => $vnpay,
            'cash' => $cash,
            ]
        ]);
    }
    // lấy số lượng invoice theo từng tháng
    public function getInvoicePerMonth(Request $request)
    {
        $type  = $request->type ?? 'yearly';
        $year  = $request->year ?? now()->year;

        $labels = [];
        $paidData = [];
        $rejectedData = [];

        // YEARLY
        if ($type === 'yearly') {
            for ($m = 1; $m <= 12; $m++) {
                $start = Carbon::create($year, $m, 1)->startOfMonth();
                $end   = Carbon::create($year, $m, 1)->endOfMonth();

                $labels[] = 'T' . $m;

                $paidData[] = Invoice::whereBetween('created_at', [$start, $end])
                    ->where('status', 'paid')
                    ->count();

                $rejectedData[] = Invoice::whereBetween('created_at', [$start, $end])
                    ->where('status', 'reject')
                    ->count();
            }
        }

        return response()->json([
            'success' => true,
            'labels' => $labels,
            'data' => [
                'paid' => $paidData,
                'reject' => $rejectedData,
            ],
        ]);
    }
    // thống kê biểu đồ đường theo tổng tiền đơn hàng
    public function getInvoiceMoney(Request $request)
    {
        $type  = $request->type ?? 'yearly';
        $year  = $request->year ?? now()->year;
        $month = $request->month ?? now()->month;

        $labels = [];
        $moneyData = [];
        if ($type === 'monthly') {
            $daysInMonth = Carbon::create($year, $month)->daysInMonth;
            $data = Invoice::join('training_packages','training_packages.id','=','invoices.package_id')
                ->where('invoices.is_deleted', false)
                ->where('invoices.status', 'paid')
                ->whereYear('invoices.created_at', $year)
                ->whereMonth('invoices.created_at', $month)
                ->selectRaw(
                    'DAY(invoices.created_at) as day,
                    SUM(training_packages.price) as total'
                )
                ->groupBy('day')
                ->pluck('total', 'day');

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $labels[] = (string) $day;
                $moneyData[] = (float) ($data[$day] ?? 0);
            }
        }

        elseif ($type === 'quarterly') {
            // Query 1 lần
            $rawData = Invoice::join('training_packages','training_packages.id','=','invoices.package_id')
                ->where('invoices.is_deleted', false)
                ->where('invoices.status', 'paid')
                ->whereYear('invoices.created_at', $year)
                ->selectRaw(
                    'QUARTER(invoices.created_at) as quarter,
                    SUM(training_packages.price) as total'
                )
                ->groupBy('quarter')
                ->pluck('total', 'quarter');

            for ($q = 1; $q <= 4; $q++) {
                $labels[] = 'Q' . $q;
                $moneyData[] = (float) ($rawData[$q] ?? 0);
            }
        }

        else {
            // Query 1 lần
            $rawData = Invoice::join('training_packages','training_packages.id','=','invoices.package_id')
                ->where('invoices.is_deleted', false)
                ->where('invoices.status', 'paid')
                ->whereYear('invoices.created_at', $year)
                ->selectRaw(
                    'MONTH(invoices.created_at) as month,
                    SUM(training_packages.price) as total'
                )
                ->groupBy('month')
                ->pluck('total', 'month');

            for ($m = 1; $m <= 12; $m++) {
                $labels[] = 'T' . $m;
                $moneyData[] = (float) ($rawData[$m] ?? 0);
            }
        }

        return response()->json([
            'success' => true,
            'labels'  => $labels,
            'data'    => [
                'money' => $moneyData,
            ],
        ]);
    }

}
