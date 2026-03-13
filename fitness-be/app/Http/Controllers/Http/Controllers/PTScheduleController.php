<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PTSchedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;
class PTScheduleController extends Controller
{
    public function createSchedule(Request $request)
{
    $request->validate([
        'date' => 'required|date',
        'start_time' => 'required',
        'end_time' => 'required',
    ]);

    $scheduleDate = Carbon::parse($request->date);

    if ($scheduleDate->isPast()) {
        return response()->json([
            'message' => 'Không thể tạo lịch trong quá khứ'
        ], 400);
    }

    if ($request->start_time >= $request->end_time) {
        return response()->json([
            'message' => 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
        ], 400);
    }

    $schedule = PTSchedule::create([
        'pt_id' => auth()->id(),
        'date' => $request->date,
        'start_time' => $request->start_time,
        'end_time' => $request->end_time
    ]);

    return response()->json([
        'message' => 'Tạo lịch thành công',
        'data' => $schedule
    ]);
}
public function register($scheduleId)
{
    $memberId = Auth::id();

    $schedule = PTSchedule::findOrFail($scheduleId);

    // 1️⃣ Kiểm tra hội viên đã chọn PT chưa
    $hasPT = DB::table('pt_member')
        ->where('member_id', $memberId)
        ->exists();

    if (!$hasPT) {
        return response()->json([
            'message' => 'Bạn cần chọn PT trước khi đăng ký'
        ], 400);
    }

    // 2️⃣ Kiểm tra lịch đã có người đăng ký chưa
    if ($schedule->member_id) {
        return response()->json([
            'message' => 'Buổi đã có người đăng ký'
        ], 400);
    }

    // 3️⃣ Kiểm tra hội viên có thuộc PT tạo lịch không
    $belongs = DB::table('pt_member')
        ->where('pt_id', $schedule->pt_id)
        ->where('member_id', $memberId)
        ->exists();

    if (!$belongs) {
        return response()->json([
            'message' => 'Bạn không thuộc PT này'
        ], 403);
    }

    // 4️⃣ Cập nhật đăng ký
    $schedule->update([
        'member_id' => $memberId
    ]);

    return response()->json([
        'message' => 'Đăng ký thành công'
    ]);
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
        return response()->json([
            'message' => 'Đã có hội viên đăng ký, không thể sửa'
        ], 400);
    }

    // Lấy ngày mới nếu có, nếu không thì giữ ngày cũ
    $newDate = $request->date ?? $schedule->date;
    $scheduleDate = Carbon::parse($newDate);

    // 3️⃣ Không cho sửa thành ngày đã qua
    if ($scheduleDate->isPast()) {
        return response()->json([
            'message' => 'Không thể sửa thành ngày đã qua'
        ], 400);
    }

    // 4️⃣ Phải còn ít nhất 3 ngày
    if (now()->diffInDays($scheduleDate, false) < 3) {
        return response()->json([
            'message' => 'Chỉ được sửa trước ít nhất 3 ngày'
        ], 400);
    }

    // 5️⃣ Validation giờ
    if ($request->start_time && $request->end_time) {
        if ($request->start_time >= $request->end_time) {
            return response()->json([
                'message' => 'Giờ kết thúc phải lớn hơn giờ bắt đầu'
            ], 400);
        }
    }

    // 6️⃣ Update
    $schedule->update([
        'date' => $newDate,
        'start_time' => $request->start_time ?? $schedule->start_time,
        'end_time' => $request->end_time ?? $schedule->end_time,
        'title' => $request->title ?? $schedule->title,
        'note' => $request->note ?? $schedule->note,
    ]);

    return response()->json([
        'message' => 'Cập nhật thành công',
        'data' => $schedule
    ]);
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
public function memberSchedules(Request $request)
{
    $member = $request->user();

    // Tìm PT của member trong bảng pt_member
    $ptRelation = DB::table('pt_member')
        ->where('member_id', $member->id)
        ->first();

    if (!$ptRelation) {
        return response()->json([
            'message' => 'Bạn chưa chọn PT'
        ], 400);
    }

    $start = $request->start;
    $end = $request->end;

    $schedules = PTSchedule::with('member')
        ->where('pt_id', $ptRelation->pt_id)
        ->when($start && $end, function ($q) use ($start, $end) {
            $q->whereBetween('date', [$start, $end]);
        })
        ->get();

    return response()->json([
        'data' => $schedules
    ]);
}
public function myRegisteredSchedules(Request $request)
{
    $member = $request->user();

    $schedules = PTSchedule::where('member_id', $member->id)->get();

    return response()->json([
        'data' => $schedules
    ]);
}
}
