<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PTSchedule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use Carbon\Carbon;
use App\Http\Services\PTScheduleService;

class PTScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(PTScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function createSchedule(Request $request)
    {
        $request->validate([
        'date' => 'required|date',
        'start_time' => 'required',
        'end_time' => 'required',
    ]);

    try {
        $schedule = $this->scheduleService->create($request);

        return response()->json([
            'message' => 'Tạo lịch thành công',
            'data' => $schedule
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'message' => $e->getMessage()
        ], 400);
    }
    }

    public function register($scheduleId)
    {
        try {
            $this->scheduleService->register($scheduleId);

            return response()->json([
                'message' => 'Đăng ký thành công'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?: 400);
        }
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
        try {
        $schedule = $this->scheduleService->updateSchedule($request, $id);

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $schedule
        ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?: 400);
        }
    }
    public function deleteSchedule($id)
    {
        try {
        $this->scheduleService->deleteSchedule($id);

        return response()->json([
            'message' => 'Xóa thành công'
        ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode() ?: 400);
        }
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

        // Tìm PT của member trong bảng pt_clients
        $ptRelation = DB::table('pt_clients')
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
    // admin xem lịch pt
    public function schedulesOfPT($ptId)
    {
        $schedules = PTSchedule::with('member')
            ->where('pt_id', $ptId)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }
    //admin xem lịch hội viên
    public function schedulesOfMember($memberId){
        $schedules = PTSchedule::with('member')
            ->where('member_id', $memberId)
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }
}
