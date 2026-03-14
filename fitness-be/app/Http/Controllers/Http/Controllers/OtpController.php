<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\PasswordOtp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Jobs\SendOtpMailJob;
use Illuminate\Support\Facades\Log;
class OtpController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $member = Member::where('email', $request->email)
            ->where('is_deleted', false)
            ->first();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Email không tồn tại'
            ]);
        }

        // Tạo OTP 6 số
        $otp = random_int(100000, 999999);
        Log::info('OTP reset password', [
            'email' => $request->email,
            'otp' => $otp,
        ]);
        // Lưu OTP đã hash (hết hạn 60s)
        PasswordOtp::updateOrCreate(
            ['email' => $request->email],
            [
                'otp' => Hash::make($otp),
                'expires_at' => now()->addSeconds(60)
            ]
        );

        SendOtpMailJob::dispatch($request->email, $otp);
        return response()->json([
            'message' => 'Mã OTP đã được gửi đến email của bạn'
        ]);
    }
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required'
        ]);

        $otpRecord = PasswordOtp::where('email', $request->email)->first();

        if (!$otpRecord) {
            return response()->json([
                'success' => false,
                'message' => 'OTP không hợp lệ'
            ], 400);
        }



        $inputOtp = trim((string) $request->otp);

        if (!Hash::check($inputOtp, $otpRecord->otp)) {
            return response()->json([
                'success' => false,
                'message' => 'OTP không đúng'
            ], 400);
        }
        if (now()->greaterThan($otpRecord->expires_at)) {
            // Xóa OTP hết hạn
            $otpRecord->delete();

            return response()->json([
                'success' => false,
                'message' => 'OTP đã hết hạn'
            ], 400);
        }
        $otpRecord->verified = true;
        $otpRecord->save();
        return response()->json([
            'success' => true,
            'message' => 'OTP hợp lệ'
        ]);
    }
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed'
        ]);

        $member = Member::where('email', $request->email)
            ->where('is_deleted', false)
            ->first();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Người dùng không tồn tại'
            ], 404);
        }
        $otpRecord = PasswordOtp::where('email', $request->email)
            ->where('verified', true)
            ->first();

        if (!$otpRecord) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn chưa xác thực OTP'
            ], 403);
        }

        $member->password = Hash::make($request->password);
        $member->save();

        return response()->json([
            'success' => true,
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }

}
