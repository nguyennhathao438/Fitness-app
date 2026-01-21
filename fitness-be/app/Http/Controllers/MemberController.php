<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Member;
use App\Models\TrainingPackage;
use App\Models\Invoice;
use DB;
use Throwable;
class MemberController extends Controller
{
    /*
     * /
        Đăng ký hội viên mới 
        Thông tin cá nhân , lịch sử mua gói , trả về token 
     */

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'password' => 'required|min:6',
            'phone' => 'nullable',
            'birthday' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',

            //Lịch sử thanh toán 
            'package_id' => 'required|exists:training_packages,id',
            'payment_method' => 'required|in:momo,vnpay,cash',
        ]);
        $member = null;
        $invoice = null;
        try {
            DB::transaction(function () use ($request, &$member, &$invoice) {
                //Lấy thông tin gói 
                $package = TrainingPackage::findOrFail($request->package_id);
                //Tạo người dùng 
                $member = Member::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'phone' => $request->phone,
                    'birthday' => $request->birthday,
                    'gender' => $request->gender,
                    'is_deleted' => false,
                    'valid_until' => now()->addDays($package->duration_days),
                ]);
                //Tạo lịch sử mua gói 
                $invoice = Invoice::create([
                    'member_id' => $member->id,
                    'package_id' => $package->id,
                    'payment_method' => $request->payment_method,
                ]);
            });
            // Tạo token luôn sau khi đăng ký (tùy chọn)
            $token = $member->createToken('member-token')->plainTextToken;
            return response()->json([
                'message' => 'Đăng ký thành công',
                'member' => $member,
                'token' => $token
            ], 201);
        } catch (Throwable $e) {

            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
