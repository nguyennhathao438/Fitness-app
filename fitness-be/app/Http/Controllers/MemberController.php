<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Member;
use App\Models\TrainingPackage;
use App\Models\Invoice;
use DB;
use Throwable;
use App\Models\PasswordOtp;
use Illuminate\Support\Facades\Mail;

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

            //Lịch sử thanh toán 
            'package_id' => 'required|exists:training_packages,id',
            'payment_method' => 'required|in:momo,vnpay,card',
        ]);
        $member = null;
        $invoice = null;
        $package = null;
        try {
            DB::transaction(function () use ($request, &$member, &$invoice, &$package) {
                //Lấy thông tin gói 
                $package = TrainingPackage::findOrFail($request->package_id);
                //Tạo người dùng 
                $member = Member::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'is_deleted' => false,
                ]);
                //Tạo lịch sử mua gói 
                $invoice = Invoice::create([
                    'member_id' => $member->id,
                    'package_id' => $package->id,
                    'payment_method' => $request->payment_method,
                    'valid_until' => now()->addDays($package->duration_days),
                ]);
            });
            $serviceIds = $package->packageType->services->pluck('id');
            // Tạo token luôn sau khi đăng ký (tùy chọn)
            $token = $member->createToken('member-token')->plainTextToken;
            return response()->json([
                'message' => 'Đăng ký thành công',
                'member' => $member,
                'valid_until' => $invoice->valid_until,
                'token' => $token,
                'service_ids' => $serviceIds,
            ], 201);
        } catch (Throwable $e) {

            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        $member = $request->user(); // member đang đăng nhập

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:members,email,' . $member->id,
            'phone'    => 'required|string|max:20',
            'gender'   => 'nullable|string|in:male,female,other'
        ]);

        try {
            // Lấy dữ liệu hợp lệ từ request
            $data = $request->only([
                'name',
                'email',
                'phone',
                'gender',
            ]);

            // Update
            $member->update($data);

            return response()->json([
                'message' => 'Cập nhật thông tin thành công',
                'member'  => $member,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Cập nhật thất bại',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        $member = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $member->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 400);
        }

        // Không cho trùng mật khẩu cũ
        if (Hash::check($request->new_password, $member->password)) {
            return response()->json([
                'message' => 'Mật khẩu mới không được trùng mật khẩu cũ'
            ], 400);
        }

        // Cập nhật mật khẩu
        $member->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ], 200);
    }
}
