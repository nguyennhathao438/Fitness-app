<?php

namespace App\Http\Controllers;

use App\Http\Services\InvoiceService;
use App\Models\Invoice;
use Carbon\Carbon;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }
    // lấy danh sách hóa đơn
    public function getInvoice(Request $request){
        $data = $this->invoiceService->getInvoices($request);

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // delete invoice
    public function deleteInvoice($invoiceId){
        $result = $this->invoiceService->deleteInvoice($invoiceId);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message']
        ], $result['status']);
    }
    // lấy số lượng order tháng này
    public function getInvoiceThisMonth(){
        $data = $this->invoiceService->getInvoiceThisMonth();

        return response()->json([
            'success' => true,
            'invoice' => $data
        ]);
    }
    // lấy số lượng invoice theo payment
    public function getPayment(){
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
    public function updateInvoice(Request $request,$invoiceId){
        $request->validate([
        'status' => 'required|in:paid,reject',
        ]);

        $result = $this->invoiceService->updateInvoice($request, $invoiceId);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'invoice' => $result['invoice'] ?? null,
            'error' => $result['error'] ?? null,
        ], $result['status']);
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
    public function getMemberByInvoice(){
        $data = $this->invoiceService->getTopMemberByInvoice();

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}