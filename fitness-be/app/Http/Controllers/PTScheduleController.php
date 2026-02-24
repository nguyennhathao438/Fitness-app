<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PTSchedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class PTScheduleController extends Controller
{
    public function createSchedule(Request $request)
{
    PTSchedule::create([
        'pt_id' => auth()->id(),
        'date' => $request->date,
        'start_time' => $request->start_time,
        'end_time' => $request->end_time
    ]);

    return response()->json(['message' => 'Tạo lịch thành công']);
}
public function register($scheduleId)
{
    $schedule = PTSchedule::findOrFail($scheduleId);

    // kiểm tra đã có người chưa
    if ($schedule->member_id) {
        return response()->json(['message' => 'Buổi đã có người đăng ký'], 400);
    }

    // kiểm tra hội viên có thuộc PT đó không
    $belongs = DB::table('pt_member')
        ->where('pt_id', $schedule->pt_id)
        ->where('member_id', auth()->id())
        ->exists();

    if (!$belongs) {
        return response()->json(['message' => 'Bạn không thuộc PT này'], 403);
    }

    $schedule->update([
        'member_id' => auth()->id()
    ]);

    return response()->json(['message' => 'Đăng ký thành công']);
}
public function mySchedules()
{
    $schedules = PTSchedule::where('member_id', auth()->id())
        ->orderBy('date')
        ->orderBy('start_time')
        ->get();

    return response()->json($schedules);
}
public function updateSchedule(Request $request, $id)
{
    $schedule = PTSchedule::findOrFail($id);

    // 1️⃣ Chỉ PT tạo lịch mới được sửa
    if ($schedule->pt_id != auth()->id()) {
        return response()->json(['message' => 'Không có quyền'], 403);
    }

    // 2️⃣ Không được sửa nếu đã có hội viên đăng ký
    if ($schedule->member_id) {
        return response()->json(['message' => 'Đã có hội viên đăng ký, không thể sửa'], 400);
    }

    // 3️⃣ Chỉ được sửa nếu còn >= 3 ngày
    $scheduleDate = Carbon::parse($schedule->date);
    if (Carbon::now()->diffInDays($scheduleDate, false) < 3) {
        return response()->json(['message' => 'Chỉ được sửa trước 3 ngày'], 400);
    }

    $schedule->update([
        'date' => $request->date ?? $schedule->date,
        'start_time' => $request->start_time ?? $schedule->start_time,
        'end_time' => $request->end_time ?? $schedule->end_time,
        'title' => $request->title ?? $schedule->title,
        'note' => $request->note ?? $schedule->note,
    ]);

    return response()->json(['message' => 'Cập nhật thành công']);
}
public function deleteSchedule($id)
{
    $schedule = PTSchedule::findOrFail($id);

    // 1️⃣ Chỉ PT tạo lịch mới được xóa
    if ($schedule->pt_id != auth()->id()) {
        return response()->json(['message' => 'Không có quyền'], 403);
    }

    // 2️⃣ Không được xóa nếu đã có hội viên đăng ký
    if ($schedule->member_id) {
        return response()->json(['message' => 'Đã có hội viên đăng ký, không thể xóa'], 400);
    }

    // 3️⃣ Chỉ được xóa nếu còn >= 3 ngày
    $scheduleDate = Carbon::parse($schedule->date);
    if (Carbon::now()->diffInDays($scheduleDate, false) < 3) {
        return response()->json(['message' => 'Chỉ được xóa trước 3 ngày'], 400);
    }

    $schedule->delete();

    return response()->json(['message' => 'Xóa thành công']);
}
public function ptSchedules(Request $request)
{
    $ptId = $request->user()->id;

    $schedules = PTSchedule::with('member')
        ->where('pt_id', $ptId)
        ->orderBy('date', 'asc')
        ->orderBy('start_time', 'asc')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $schedules
    ]);
}
}
