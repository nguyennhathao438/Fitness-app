<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Schedule;
use App\Models\ScheduleMember;

class ScheduleController extends Controller
{
    /**
     * PT tạo lịch tập
     */
    public function store(Request $request)
    {
        if (auth()->user()->role !== 'pt') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'day_of_week' => 'required|integer|between:0,6',
            'start_time'  => 'required',
            'end_time'    => 'required|after:start_time',
        ]);

        $exists = Schedule::where('pt_id', auth()->id())
            ->where('day_of_week', $data['day_of_week'])
            ->where(function ($q) use ($data) {
                $q->whereBetween('start_time', [$data['start_time'], $data['end_time']])
                  ->orWhereBetween('end_time', [$data['start_time'], $data['end_time']]);
            })
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Khung giờ đã tồn tại'
            ], 422);
        }

        $schedule = Schedule::create([
            'pt_id' => auth()->id(),
            'day_of_week' => $data['day_of_week'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
        ]);

        return response()->json($schedule, 201);
    }

    /**
     * PT xem lịch của mình
     */
    public function index()
    {
        return response()->json([
            'data' => Schedule::where('pt_id', auth()->id())->get()
        ]);
    }

    /**
     * Member xem lịch trống của PT
     */
    public function available(Request $request)
    {
        $data = $request->validate([
            'pt_id' => 'required|exists:users,id',
            'day_of_week' => 'required|integer|between:0,6',
        ]);

        $schedules = Schedule::where('pt_id', $data['pt_id'])
            ->where('day_of_week', $data['day_of_week'])
            ->whereDoesntHave('booking')
            ->get();

        return response()->json([
            'data' => $schedules
        ]);
    }

    /**
     * Member đặt lịch
     */
    public function book($id)
    {
        $schedule = Schedule::findOrFail($id);

        if ($schedule->booking) {
            return response()->json([
                'message' => 'Slot đã được đặt'
            ], 400);
        }

        ScheduleMember::create([
            'schedule_id' => $schedule->id,
            'member_id'   => auth()->id(),
            'start_time'  => $schedule->start_time,
            'end_time'    => $schedule->end_time,
        ]);

        return response()->json([
            'message' => 'Đặt lịch thành công'
        ]);
    }
}
