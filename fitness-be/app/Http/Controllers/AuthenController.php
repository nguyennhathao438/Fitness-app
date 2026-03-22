<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Member;
use Illuminate\Support\Facades\Hash;
use App\Models\Invoice;
class AuthenController extends Controller
{
    public function getMyInfo(Request $request)
    {
        $member = Member::with('roles.permissions')
            ->find($request->user()->id);

        $memberData = $member->only([
            'id',
            'name',
            'email',
            'phone',
            'avatar',
            'gender'
        ]);

        $latestInvoice = Invoice::with('package.packageType.services')
            ->where('member_id', $member->id)
            ->latest()
            ->first();

        $serviceIds = [];
        $validUntil = null;

        if ($latestInvoice && $latestInvoice->package) {

            $validUntil = $latestInvoice->valid_until;

            if ($latestInvoice->package->packageType) {

                $serviceIds = $latestInvoice
                    ->package
                    ->packageType
                    ->services
                    ->pluck('id');
            }
        }

        $roles = [];
        $permissions = [];

        foreach ($member->roles as $role) {

            $roles[] = $role->name;

            $permissions = array_merge(
                $permissions,
                $role->permissions->pluck('code')->toArray()
            );
        }

        $permissions = array_values(array_unique($permissions));

        return response()->json([
            'member' => $memberData,
            'valid_until' => $validUntil,
            'service_ids' => $serviceIds,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $member = Member::where('email', $request->email)->first();
        $memberData = $member->only([
            'id',
            'name',
            'email',
            'phone',
            'avatar'
        ]);
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

        // ===== invoice =====

        $latestInvoice = Invoice::with('package.packageType.services')
            ->where('member_id', $member->id)
            ->latest()
            ->first();

        $serviceIds = [];
        $validUntil = null;

        if ($latestInvoice && $latestInvoice->package) {

            $validUntil = $latestInvoice->valid_until;

            if ($latestInvoice->package->packageType) {

                $serviceIds = $latestInvoice
                    ->package
                    ->packageType
                    ->services
                    ->pluck('id');
            }
        }

        // ===== roles + permissions =====

        $roles = [];
        $permissions = [];

        foreach ($member->roles as $role) {

            $roles[] = $role->name;

            $permissions = array_merge(
                $permissions,
                $role->permissions->pluck('code')->toArray()
            );
        }

        $permissions = array_values(array_unique($permissions));

        // ===== token =====

        $token = $member
            ->createToken('member-token')
            ->plainTextToken;

        return response()->json([
            'member' => $memberData,
            'valid_until' => $validUntil,
            'service_ids' => $serviceIds,
            'roles' => $roles,
            'permissions' => $permissions,
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
