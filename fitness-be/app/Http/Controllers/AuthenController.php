<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use App\Models\Invoice;
class AuthenController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $member = Member::where('email', $request->email)->first();
        if (!$member) {
            return response()->json([
                'message' => 'Tài khoản không tồn tại'
            ], 404);
        }
        if (!Hash::check($request->password, $member->password)) {
            return response()->json([
                'message' => 'Mật khẩu không chính xác'
            ], 401);
        }
        //Kiểm tra role nếu là admin và pt thì k cần 2 cái if đó
        // if ($member->is_deleted) {
        //     return response()->json([
        //         'message' => 'Tài khoản đã bị khóa'
        //     ], 403);
        // }
        // if ($member->valid_until == null || $member->valid_until < now()) {
        //     return response()->json([
        //         'message' => 'Tài khoản đã hết hạn sử dụng'
        //     ], 403);
        // }

        //Trả về gói mua gần nhất 
        $latestInvoice = Invoice::with('package.packageType.services')
            ->where('member_id', $member->id)
            ->latest()
            ->first();

        $serviceIds = [];
        $validUntil = null;
        $package = null;

        if ($latestInvoice && $latestInvoice->package) {
            $validUntil = $latestInvoice->valid_until;
            $package = $latestInvoice->package;

            if ($package->packageType) {
                $serviceIds = $package
                    ->packageType
                    ->services
                    ->pluck('id');
            }
        }
        $token = $member->createToken('member-token')->plainTextToken;

        return response()->json([
            'member' => $member,
            'valid_until' => $validUntil,
            'service_ids' => $serviceIds,
            'token' => $token
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'Đã đăng xuất'
        ]);
    }
    //Check email tồn tại 
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $exists = Member::where('email', $request->email)->exists();
        return response()->json([
            'exists' => $exists
        ], 200);
    }

}
