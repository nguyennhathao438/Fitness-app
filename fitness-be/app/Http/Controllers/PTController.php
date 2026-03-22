<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Notification;
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
    $exists = DB::table('pt_clients')
        ->where('pt_id', $ptId)
        ->where('member_id', $request->member_id)
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'Member đã thuộc PT này'
        ], 400);
    }

    DB::table('pt_clients')->insert([
        'pt_id' => $ptId,
        'member_id' => $request->member_id,
        'created_at' => now(),
        'updated_at' => now()
    ]);

    // gửi notification cho member
    Notification::create([
        'user_id' => $request->member_id,
        'sender_id' => $ptId,
        'type' => 'pt_assigned',
        'title' => 'Đã được gán PT',
        'message' => 'Bạn đã được gán cho một Personal Trainer',
        'data' => [
            'pt_id' => $ptId
        ]
    ]);

    return response()->json([
        'message' => 'Thêm member vào PT thành công'
    ]);
}
public function removeMember($memberId)
{
    $ptId = auth()->id();

    DB::table('pt_clients')
        ->where('pt_id', $ptId)
        ->where('member_id', $memberId)
        ->delete();

    Notification::create([
        'user_id' => $memberId,
        'sender_id' => $ptId,
        'type' => 'pt_removed',
        'title' => 'PT đã thay đổi',
        'message' => 'Bạn không còn được quản lý bởi PT này',
        'data' => [
            'pt_id' => $ptId
        ]
    ]);

    return response()->json([
        'message' => 'Đã gỡ member khỏi PT'
    ]);
}
}