<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Throwable;
use Illuminate\Support\Facades\DB;

class PersonalTrainerController extends Controller
{
    // Lấy danh sách member (PT) cho trang Admin: phân trang + tìm kiếm + lọc + sắp xếp
    public function getPT(Request $request)
    {
        $query = Member::select('id', 'name', 'email', 'phone','birthday', 'gender')->where('is_deleted', false);
        // TÌM KIẾM (theo tên hoặc SĐT)

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                  ->orWhere('phone', 'like', "%$keyword%");
            });
        }

        // LỌC THEO GIỚI TÍNH
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender); 
        }

        // SẮP XẾP THEO NGÀY TẠO
        $sort = $request->get('sort', 'desc'); // mặc định mới nhất
        $query->orderBy('created_at', $sort);

        // THỐNG KÊ
        $full = Member::count();

        // PHÂN TRANG (8 ITEM / TRANG)
        $members = $query->paginate(8);

        // TRẢ JSON CHO FRONTEND
        return response()->json([
            'success' => true,
            'full' => $full,
            'data' => $members
        ]);
    }
    public function createPT(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'password' => 'required|min:6',

            'phone' => 'required|regex:/^0\d{9}$/|unique:members,phone',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
        ]);
        $member = null;
        try {
            DB::transaction(function () use ($request, &$member) {
                $member = Member::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'gender' => $request->gender,
                    'birthday' => $request->birthday,
                    'password' => Hash::make($request->password),
                    'is_deleted' => false,
                ]);
            });

            return response()->json([
                'message' => 'Tạo tài khoản thành công',
                'member' => $member,
            ], 201);

        } catch (Throwable $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
