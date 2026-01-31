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
    // Thống kê progressbar giới tính
    public function memberStats(Request $request)
    {
        $baseQuery = Member::where('is_deleted', false);

        $male = (clone $baseQuery)->where('gender', 'male')->count();
        $female = (clone $baseQuery)->where('gender', 'female')->count();
        $total = $male + $female;

        return response()->json([
            'success' => true,
            'total' => $total,
            'gender' => [
            'male' => $male,
            'female' => $female
            ]
        ]);
    }
    //thống kê biểu đồ tròn theo độ tuổi
    public function AgeStats()
    {
    $stats = Member::where('is_deleted', false)
        ->whereNotNull('birthday')
        ->selectRaw("
            SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 18) AS under_18,
            SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN 18 AND 24) AS from_18_24,
            SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN 25 AND 34) AS from_25_34,
            SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) >= 35) AS over_35
        ")
        ->first();

    return response()->json([
        'success' => true,
        'data' => [
            ['label' => '< 18', 'value' => (int) $stats->under_18],
            ['label' => '18 - 24', 'value' => (int) $stats->from_18_24],
            ['label' => '25 - 34', 'value' => (int) $stats->from_25_34],
            ['label' => '≥ 35', 'value' => (int) $stats->over_35],
        ]
    ]);
    }
    // xóa người dùng
    public function deletedUser($memberId){
    $member = Member::find($memberId);

    if (!$member) {
        return response()->json(['message' => 'User không tồn tại'], 404);
    }

    $member->update([
        'is_deleted' => true
    ]);

    return response()->json([
        'message' => 'Xóa user thành công'
    ]);
    }

    // sửa thông tin người dùng
    public function editUser(Request $request, $memberId)
    {
        $member = Member::where('id', $memberId)
            ->where('is_deleted', false)
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'User không tồn tại hoặc đã bị xóa'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email,' . $memberId,
            'phone' => 'nullable|string|max:15',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
        ]);

        try {
            $member->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
            ]);

            return response()->json([
                'message' => 'Cập nhật user thành công',
                'member' => $member
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Cập nhật thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
