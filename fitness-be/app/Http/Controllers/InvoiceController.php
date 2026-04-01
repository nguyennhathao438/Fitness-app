<?php

namespace App\Http\Controllers;

use App\Http\Services\InvoiceService;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Log;
use App\Models\Role;
use DB;
use Throwable;
class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
        $this->middleware('permission:invoice.read')
            ->only(['getInvoice']);

        $this->middleware('permission:invoice.update')
            ->only(['updateInvoice']);

        $this->middleware('permission:invoice.delete')
            ->only(['deleteInvoice']);
    }
    // lấy danh sách hóa đơn
    public function getInvoice(Request $request)
    {
        $data = $this->invoiceService->getInvoices($request);

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // delete invoice
    public function deleteInvoice($invoiceId)
    {
        $result = $this->invoiceService->deleteInvoice($invoiceId);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message']
        ], $result['status']);
    }
    // lấy số lượng order tháng này
    public function getInvoiceThisMonth()
    {
        $data = $this->invoiceService->getInvoiceThisMonth();

        return response()->json([
            'success' => true,
            'invoice' => $data
        ]);
    }
    // lấy số lượng invoice theo payment
    public function getPayment()
    {
        $data = $this->invoiceService->getPaymentStats();

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // lấy số lượng invoice theo từng tháng
    public function getInvoicePerMonth(Request $request)
    {
        $data = $this->invoiceService->getInvoicePerMonth(
            $request->type,
            $request->year
        );

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // thống kê biểu đồ đường theo tổng tiền đơn hàng
    public function getInvoiceMoney(Request $request)
    {
        $data = $this->invoiceService->getInvoiceMoney(
            $request->type,
            $request->year,
            $request->month
        );

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // chuyển đổi trạng thái đơn hàng
    public function updateInvoice(Request $request, $invoiceId)
    {
        try {
            return DB::transaction(function () use ($request, $invoiceId) {

                $invoice = Invoice::with(['member', 'package.packageType'])
                    ->findOrFail($invoiceId);

                $invoice->status = $request->status;
                $invoice->save();

                // CHỈ XỬ LÝ KHI PAID
                if ($request->status === 'paid') {
                    $this->handleAssignRole(
                        $invoice->member,
                        $invoice->package,
                        $invoice
                    );
                }

                return [
                    'success' => true,
                    'message' => 'Cập nhật hóa đơn thành công',
                    'invoice' => $invoice,
                    'status' => 200
                ];
            });

        } catch (Throwable $e) {
            return [
                'success' => false,
                'message' => 'Lỗi cập nhật hóa đơn',
                'error' => $e->getMessage(),
                'status' => 500
            ];
        }
    }
    private function handleAssignRole($member, $package, $invoice)
    {
        $typeName = strtolower(optional($package->packageType)->name);

        // luôn có role Member
        $memberRole = Role::where('name', 'Member')->first();
        if ($memberRole) {
            $member->roles()->syncWithoutDetaching([$memberRole->id]);
        }

        // MemberUp
        if (in_array($typeName, ['nâng cao', 'vip'])) {
            $upRole = Role::where('name', 'MemberUp')->first();
            if ($upRole) {
                $member->roles()->syncWithoutDetaching([$upRole->id]);
            }
        }

        // MemberVip
        if ($typeName === 'vip') {
            $vipRole = Role::where('name', 'MemberVip')->first();
            if ($vipRole) {
                $member->roles()->syncWithoutDetaching([$vipRole->id]);
            }
        }

        //  update thời hạn user theo invoice
        if ($invoice->valid_until) {
            if (
                !$member->valid_until ||
                Carbon::parse($invoice->valid_until)->gt(Carbon::parse($member->valid_until))
            ) {
                $member->update([
                    'valid_until' => $invoice->valid_until
                ]);
            }
        }

        Log::info("Assign role từ invoice", [
            'member_id' => $member->id,
            'package_type' => $typeName
        ]);
    }
    // Lấy lịch sử mua gói tập của User
    public function getMemberHistory(Request $request)
    {
        $memberId = $request->user()->id;

        $invoices = Invoice::with('package:id,name')
            ->where('member_id', $memberId)
            ->where('is_deleted', false)
            ->orderBy('id', 'desc')
            ->get();

        $historyData = $invoices->map(function ($invoice) {
            return [
                'name' => $invoice->package ? $invoice->package->name : 'Gói không xác định',
                'price' => $invoice->total_price,
                'payment_method' => $invoice->payment_method,
                'purchaseDate' => $invoice->created_at->format('Y-m-d'),
                'expireDate' => $invoice->valid_until ? \Carbon\Carbon::parse($invoice->valid_until)->format('Y-m-d') : null,
                'status' => $invoice->status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $historyData
        ]);
    }

    // top 5 người dùng lâu nhất 
    public function getMemberByInvoice()
    {
        $data = $this->invoiceService->getTopMemberByInvoice();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}