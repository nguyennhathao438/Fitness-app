<?php
namespace App\Http\Services;

use App\Models\Notification;
use App\Models\PTSchedule;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PTScheduleService
{
    public function create($request)
    {
        $ptId = auth()->id();
        $date = $request->date;
        $start = $request->start_time;
        $end = $request->end_time;

        //  Không tạo lịch quá khứ
        if (Carbon::parse($date)->isPast()) {
            throw new \Exception('Không thể tạo lịch trong quá khứ');
        }

        //  Giờ không hợp lệ
        if ($start >= $end) {
            throw new \Exception('Giờ kết thúc phải lớn hơn giờ bắt đầu');
        }

        //  Trùng lịch
        $conflict = PTSchedule::where('pt_id', $ptId)
            ->where('date', $date)
            ->where(function ($q) use ($start, $end) {
                $q->where('start_time', '<', $end)
                  ->where('end_time', '>', $start);
            })
            ->exists();

        if ($conflict) {
            throw new \Exception('Khung giờ này đã bị trùng với lịch khác');
        }

        //  Tạo lịch
        $schedule = PTSchedule::create([
            'pt_id' => $ptId,
            'date' => $date,
            'start_time' => $start,
            'end_time' => $end,
        ]);

        //  Notify
        $members = DB::table('pt_clients')
            ->where('pt_id', $ptId)
            ->pluck('member_id');

        foreach ($members as $memberId) {
            Notification::create([
                'user_id' => $memberId,
                'sender_id' => $ptId,
                'type' => 'schedule_created',
                'title' => 'PT tạo lịch mới',
                'message' => 'PT đã tạo lịch tập mới',
                'data' => [
                    'schedule_id' => $schedule->id
                ]
            ]);
        }

        return $schedule;
    }

    public function register($scheduleId)
    {
        $memberId = Auth::id();

        $schedule = PTSchedule::findOrFail($scheduleId);

        // Kiểm tra hội viên đã chọn PT chưa
        $hasPT = DB::table('pt_clients')
            ->where('member_id', $memberId)
            ->exists();

        if (!$hasPT) {
            throw new \Exception('Bạn cần chọn PT trước khi đăng ký', 400);
        }

        // Kiểm tra lịch đã có người đăng ký chưa
        if ($schedule->member_id) {
            throw new \Exception('Buổi đã có người đăng ký', 400);
        }

        // Không cho đăng ký lịch đã qua
        $scheduleTime = Carbon::parse("{$schedule->date} {$schedule->start_time}");

        if ($scheduleTime->lt(now())) {
            throw new \Exception('Không thể đăng ký lịch đã qua', 400);
        }

        //  Kiểm tra hội viên có thuộc PT tạo lịch không
        $belongs = DB::table('pt_clients')
            ->where('pt_id', $schedule->pt_id)
            ->where('member_id', $memberId)
            ->exists();

        if (!$belongs) {
            throw new \Exception('Bạn không thuộc PT này', 403);
        }

        //  Cập nhật đăng ký
        $schedule->update([
            'member_id' => $memberId
        ]);

        Notification::create([
            'user_id' => $schedule->pt_id,
            'sender_id' => $memberId,
            'type' => 'schedule_registered',
            'title' => 'Học viên đăng ký lịch',
            'message' => Auth::user()->name . ' đã đăng ký lịch tập',
            'data' => [
                'schedule_id' => $schedule->id
            ]
        ]);
    }
    public function updateSchedule($request, $id)
    {
        $schedule = PTSchedule::findOrFail($id);

        //  Chỉ PT tạo lịch mới được sửa
        if ($schedule->pt_id != auth()->id()) {
            throw new \Exception('Không có quyền', 403);
        }

        //  Không được sửa nếu đã có hội viên đăng ký
        if ($schedule->member_id) {
            throw new \Exception('Đã có hội viên đăng ký, không thể sửa', 400);
        }

        $newDate = $request->date ?? $schedule->date;
        $newStart = $request->start_time ?? $schedule->start_time;
        $newEnd = $request->end_time ?? $schedule->end_time;

        $scheduleDate = Carbon::parse($newDate);

        //  Không cho sửa thành ngày đã qua
        if ($scheduleDate->isPast()) {
            throw new \Exception('Không thể sửa thành ngày đã qua', 400);
        }

        //  Phải còn ít nhất 3 ngày
        if (now()->diffInDays($scheduleDate, false) < 3) {
            throw new \Exception('Chỉ được sửa trước ít nhất 3 ngày', 400);
        }

        //  Validation giờ
        if ($newStart >= $newEnd) {
            throw new \Exception('Giờ kết thúc phải lớn hơn giờ bắt đầu', 400);
        }

        // Kiểm tra trùng lịch
        $conflict = PTSchedule::where('pt_id', auth()->id())
            ->where('date', $newDate)
            ->where('id', '!=', $id)
            ->where(function ($query) use ($newStart, $newEnd) {
                $query->where('start_time', '<', $newEnd)
                      ->where('end_time', '>', $newStart);
            })
            ->exists();

        if ($conflict) {
            throw new \Exception('Khung giờ này bị trùng với lịch khác', 400);
        }

        // 7️⃣ Update
        $schedule->update([
            'date' => $newDate,
            'start_time' => $newStart,
            'end_time' => $newEnd,
            'title' => $request->title ?? $schedule->title,
            'note' => $request->note ?? $schedule->note,
        ]);

        return $schedule;
    }
    public function deleteSchedule($id)
    {
        $schedule = PTSchedule::findOrFail($id);

        //  Chỉ PT tạo lịch mới được xóa
        if ($schedule->pt_id != auth()->id()) {
            throw new \Exception('Không có quyền', 403);
        }

        //  Không được xóa nếu đã có hội viên đăng ký
        if ($schedule->member_id) {
            throw new \Exception('Đã có hội viên đăng ký, không thể xóa', 400);
        }

        //  Chỉ được xóa nếu còn >= 3 ngày
        $scheduleDate = Carbon::parse($schedule->date);

        if (Carbon::now()->diffInDays($scheduleDate, false) < 3) {
            throw new \Exception('Chỉ được xóa trước 3 ngày', 400);
        }

        $schedule->delete();
    }
    
}
?>