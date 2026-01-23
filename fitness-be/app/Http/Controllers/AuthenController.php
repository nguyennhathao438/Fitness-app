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
        if (!$member || !Hash::check($request->password, $member->password)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không đúng'
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
        $latestInvoice = Invoice::with('package')
            ->where('member_id', $member->id)
            ->latest() // mặc định là created_at
            ->first();
        $token = $member->createToken('member-token')->plainTextToken;

        return response()->json([
            'member' => $member,
            'latest_invoice' => $latestInvoice,
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

}
