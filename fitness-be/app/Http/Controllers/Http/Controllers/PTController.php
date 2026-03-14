<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PTController extends Controller
{
    public function myMembers()
    {
        $pt = Auth::user();

        $members = $pt->managedMembers()
            ->where('is_deleted', false)
            ->get();

        return response()->json($members);
    }
    public function assignMember(Request $request)
{
    $request->validate([
        'member_id' => 'required|exists:members,id'
    ]);

    $ptId = auth()->id();

    // kiểm tra đã tồn tại chưa
    $exists = DB::table('pt_member')
        ->where('pt_id', $ptId)
        ->where('member_id', $request->member_id)
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Member đã thuộc PT này'
        ], 400);
    }

    DB::table('pt_member')->insert([
        'pt_id' => $ptId,
        'member_id' => $request->member_id,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    return response()->json([
        'message' => 'Thêm member vào PT thành công'
    ]);
}
}