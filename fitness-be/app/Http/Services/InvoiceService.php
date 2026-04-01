<?php

namespace App\Http\Services;
use App\Models\Invoice;
use Carbon\Carbon;

class InvoiceService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }
    // lấy danh sách hóa đơn
    public function getInvoices($request)
    {
        $query = Invoice::with([
            'package:id,name,duration_days,package_type_id',
            'member:id,name,email,avatar',
            'package.packageType.services:id,name',
        ])->where('is_deleted', false);

        // SEARCH
        if ($request->filled('keyword')) {
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

        // FILTER PAYMENT
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // FILTER STATUS
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // FILTER DATE
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // ================== STATS ==================
        $baseQuery = Invoice::where('is_deleted', false);

        $full = (clone $baseQuery)->count();

        $inactive = (clone $baseQuery)
            ->where('status', 'pending')
            ->count();

        $now = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        $moneyThisMonth = (clone $baseQuery)
            ->where('status', 'paid')
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->sum('total_price');

        $moneyLastMonth = (clone $baseQuery)
            ->where('status', 'paid')
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->sum('total_price');

        // % change
        if ($moneyLastMonth > 0) {
            $percentChange = (($moneyThisMonth - $moneyLastMonth) / $moneyLastMonth) * 100;
        } else {
            $percentChange = $moneyThisMonth > 0 ? 100 : 0;
        }

        // ================== PAGINATION ==================
        $invoices = $query
            ->orderByDesc('created_at')
            ->paginate(6);

        return [
            'full' => $full,
            'inactive' => $inactive,
            'data' => $invoices,
            'revenue' => [
                'this_month' => $moneyThisMonth,
                'last_month' => $moneyLastMonth,
                'percent_change' => round($percentChange, 2),
            ]
        ];
    }
    // delete invoice
    public function deleteInvoice($invoiceId)
    {
        $invoice = Invoice::find($invoiceId);

        if (!$invoice) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Invoice không tồn tại'
            ];
        }
        // Không cho xóa nếu còn hạn
        if ($invoice->valid_until && $invoice->valid_until > Carbon::today()) {
            return [
                'success' => false,
                'status' => 400,
                'message' => 'Không thể xóa invoice vì gói dịch vụ vẫn còn hạn'
            ];
        }
        $invoice->update([
            'is_deleted' => true
        ]);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Xóa invoice thành công'
        ];
    }
    // lấy số lượng order tháng này
    public function getInvoiceThisMonth()
    {
        $now = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        $baseQuery = Invoice::where('is_deleted', false);

        $invoiceThisMonth = (clone $baseQuery)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        $invoiceLastMonth = (clone $baseQuery)
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        if ($invoiceLastMonth > 0) {
            $percentChange = (($invoiceThisMonth - $invoiceLastMonth) / $invoiceLastMonth) * 100;
        } else {
            $percentChange = $invoiceThisMonth > 0 ? 100 : 0;
        }

        return [
            'this_month' => $invoiceThisMonth,
            'last_month' => $invoiceLastMonth,
            'percent_change' => round($percentChange, 2),
        ];
    }
    // lấy số lượng invoice theo payment
    public function getPaymentStats()
    {
        $baseQuery = Invoice::where('status', 'paid')
            ->where('is_deleted', false);

        $momo = (clone $baseQuery)
            ->where('payment_method', 'momo')
            ->count();

        $vnpay = (clone $baseQuery)
            ->where('payment_method', 'vnpay')
            ->count();

        $cash = (clone $baseQuery)
            ->where('payment_method', 'cash')
            ->count();

        $total = $momo + $vnpay + $cash;

        return [
            'total' => $total,
            'payments' => [
                'momo' => $momo,
                'vnpay' => $vnpay,
                'cash' => $cash,
            ]
        ];
    }
    // lấy số lượng invoice theo từng tháng
    public function getInvoicePerMonth($type = 'yearly', $year = null)
    {
        $year = $year ?? now()->year;

        $labels = [];
        $paidData = [];
        $rejectedData = [];

        $baseQuery = Invoice::query();

        // helper để tránh lặp
        $countByStatus = function ($start, $end, $status) use ($baseQuery) {
            return (clone $baseQuery)
                ->whereBetween('created_at', [$start, $end])
                ->where('status', $status)
                ->count();
        };

        // YEARLY
        if ($type === 'yearly') {
            for ($m = 1; $m <= 12; $m++) {
                $start = Carbon::create($year, $m, 1)->startOfMonth();
                $end   = Carbon::create($year, $m, 1)->endOfMonth();

                $labels[] = 'T' . $m;

                $paidData[] = $countByStatus($start, $end, 'paid');
                $rejectedData[] = $countByStatus($start, $end, 'reject');
            }
        }

        return [
            'labels' => $labels,
            'data' => [
                'paid' => $paidData,
                'reject' => $rejectedData,
            ]
        ];
    }
    // thống kê biểu đồ đường theo tổng tiền đơn hàng
    public function getInvoiceMoney($type = 'yearly', $year = null, $month = null)
    {
        $year  = $year ?? now()->year;
        $month = $month ?? now()->month;

        $labels = [];
        $moneyData = [];

        $baseQuery = Invoice::where('is_deleted', false)
            ->where('status', 'paid');

        // MONTHLY
        if ($type === 'monthly') {
            $daysInMonth = Carbon::create($year, $month)->daysInMonth;

            $data = (clone $baseQuery)
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->selectRaw('DAY(created_at) as day, SUM(total_price) as total')
                ->groupBy('day')
                ->pluck('total', 'day');

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $labels[] = (string) $day;
                $moneyData[] = (float) ($data[$day] ?? 0);
            }
        }

        // QUARTERLY
        elseif ($type === 'quarterly') {
            $rawData = (clone $baseQuery)
                ->whereYear('created_at', $year)
                ->selectRaw('QUARTER(created_at) as quarter, SUM(total_price) as total')
                ->groupBy('quarter')
                ->pluck('total', 'quarter');

            for ($q = 1; $q <= 4; $q++) {
                $labels[] = 'Q' . $q;
                $moneyData[] = (float) ($rawData[$q] ?? 0);
            }
        }

        // YEARLY
        else {
            $rawData = (clone $baseQuery)
                ->whereYear('created_at', $year)
                ->selectRaw('MONTH(created_at) as month, SUM(total_price) as total')
                ->groupBy('month')
                ->pluck('total', 'month');

            for ($m = 1; $m <= 12; $m++) {
                $labels[] = 'T' . $m;
                $moneyData[] = (float) ($rawData[$m] ?? 0);
            }
        }

        return [
            'labels' => $labels,
            'data' => [
                'money' => $moneyData,
            ]
        ];
    }
    // update invoice
    public function updateInvoice($request, $invoiceId)
    {
        $invoice = Invoice::with('package.packageType.services', 'member')
            ->where('id', $invoiceId)
            ->where('is_deleted', false)
            ->where('status', 'pending')
            ->where('payment_method', 'cash')
            ->first();

        if (!$invoice) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'Chỉ có thể cập nhật invoice khi đang pending và payment là cash'
            ];
        }

        try {
            $oldStatus = $invoice->status;
            $invoice->update([
                'status' => $request->status
            ]);
            // Nếu admin duyệt paid
            if ($oldStatus == 'pending' && $request->status == 'paid') {

                $package = $invoice->package;
                $memberId = $invoice->member_id;
                // Nếu package có PT
                if ($this->notificationService->hasPTService($package) && !$this->notificationService->memberHasPT($memberId)) {

                    $this->notificationService->sendAssignPTNotification($invoice);
                }
            }
            return [
                'success' => true,
                'status' => 200,
                'message' => 'Cập nhật invoice thành công',
                'invoice' => $invoice
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'status' => 500,
                'message' => 'Cập nhật thất bại',
                'error' => $e->getMessage()
            ];
        }
    }
    // top 5 người dùng sử dụng thời gian lâu nhất
    public function getTopMemberByInvoice()
    {
        $members = Invoice::where('status', 'paid')
            ->where('is_deleted', false)
            ->with(['member:id,name,avatar,birthday', 'package'])
            ->get()
            ->groupBy('member_id') // nhóm theo member
            ->map(function ($invoices, $memberId) {
                $totalDays = 0;

                foreach ($invoices as $invoice) {
                    // cộng duration_days của từng package
                    $totalDays += $invoice->package->duration_days ?? 0;
                }

                return [
                    'member' => $invoices->first()->member,
                    'total_days' => $totalDays
                ];
            })
            ->sortByDesc('total_days') // sắp xếp giảm dần
            ->take(5)
            ->values();

        return $members;
    }
}
?>