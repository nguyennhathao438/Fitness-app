<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkoutHistory;
use Carbon\Carbon;
class WorkoutHistoryController extends Controller
{
    /**
     * Tạo workout history khi bắt đầu buổi tập
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'total_time' => 'nullable|integer|min:0',
            'date' => 'required|date',
            'day_of_week' => 'required|integer',
        ]);

        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $workoutHistory = WorkoutHistory::create([
            'member_id' => $member->id,
            'total_time' => $validated['total_time'] ?? 0,
            'date' => $validated['date'],
            'day_of_week' => $validated['day_of_week'],
            'completion_percentage' => 0
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tạo lịch sử tập luyện thành công',
            'data' => $workoutHistory
        ], 201);
    }

    /**
     * Lấy toàn bộ lịch sử workout của user
     */
    public function index(Request $request)
    {
        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $perPage = (int) $request->query('per_page', 0);

        $query = WorkoutHistory::where('member_id', $member->id)
            ->orderBy('date', 'desc');

        if ($perPage > 0) {
            $data = $query->paginate($perPage);
        } else {
            $data = $query->get();
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy lịch sử tập luyện thành công',
            'data' => $data
        ], 200);
    }

    /**
     * Lấy buổi tập gần nhất
     */
    public function latest(Request $request)
    {
        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $workoutHistory = WorkoutHistory::where('member_id', $member->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Lấy buổi tập gần nhất thành công',
            'data' => $workoutHistory
        ], 200);
    }

    /**
     * Lấy chi tiết 1 workout
     */
    public function show($id)
    {
        $workoutHistory = WorkoutHistory::with('details')
            ->find($id);

        if (!$workoutHistory) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy workout'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $workoutHistory
        ]);
    }

    /**
     * Cập nhật completion %
     */
    public function updateCompletion($id)
    {
        $workout = WorkoutHistory::find($id);

        if (!$workout) {
            return response()->json([
                'success' => false,
                'message' => 'Workout không tồn tại'
            ], 404);
        }

        $percentage = $workout->calculateCompletionPercentage();

        $workout->update([
            'completion_percentage' => $percentage
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật completion thành công',
            'data' => $workout
        ]);
    }


    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'total_time' => 'nullable|integer|min:0',
            'completion_percentage' => 'nullable|integer|min:0|max:100'
        ]);

        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $workout = WorkoutHistory::find($id);

        if (!$workout) {
            return response()->json([
                'success' => false,
                'message' => 'Workout không tồn tại'
            ], 404);
        }

        // kiểm tra quyền
        if ($workout->member_id !== $member->id) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền'
            ], 403);
        }

        $workout->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật workout thành công',
            'data' => $workout
        ]);
    }

    public function today(Request $request)
    {
        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $today = Carbon::today();

        $workout = WorkoutHistory::where('member_id', $member->id)
            ->whereDate('date', $today)
            ->with('details.exercise')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Lấy workout hôm nay thành công',
            'data' => $workout
        ]);
    }
}
