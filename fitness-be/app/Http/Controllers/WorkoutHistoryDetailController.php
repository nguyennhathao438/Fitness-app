<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WorkoutHistoryDetail;
use App\Models\WorkoutHistory;
use Carbon\Carbon;
use App\Models\MuscleGroup;
use Illuminate\Support\Facades\DB;
class WorkoutHistoryDetailController extends Controller
{
    public function getAll(Request $request)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $details = WorkoutHistoryDetail::with(['exercise', 'workoutHistory'])
            ->whereHas('workoutHistory', function ($q) use ($member) {
                $q->where('member_id', $member->id);
            })
            ->get();
        return response()->json([
            'success' => true,
            'message' => 'Lấy tất cả chi tiết bài tập thành công',
            'data' => $details
        ]);
    }

    /**
     * Lấy danh sách chi tiết lịch sử tập luyện
     */
    public function index(Request $request, $workoutHistoryId)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $details = WorkoutHistoryDetail::where('workout_history_id', $workoutHistoryId)
            ->with(['exercise'])
            ->get();
        return response()->json([
            'success' => true,
            'message' => 'Lấy chi tiết lịch sử tập luyện thành công',
            'data' => $details
        ]);
    }

    /**
     * Tạo chi tiết lịch sử tập luyện
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'workout_history_id' => 'required|exists:workout_history,id',
            'exercise_id' => 'required|exists:exercises,id',
            'set_count' => 'nullable|integer|min:0',
            'rep' => 'nullable|integer|min:0',
            'execution_time' => 'nullable|integer|min:0',
            'estimated_time' => 'nullable|integer|min:0',
            'status' => 'nullable|string',
            'completion_percentage' => 'nullable|integer|min:0|max:100',
        ]);
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $workoutHistory = WorkoutHistory::find($validated['workout_history_id']);
        if (!$workoutHistory || $workoutHistory->member_id !== $member->id) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền truy cập'
            ], 403);
        }
        $detail = WorkoutHistoryDetail::create([
            'workout_history_id' => $validated['workout_history_id'],
            'exercise_id' => $validated['exercise_id'],
            'set_count' => $validated['set_count'] ?? 0,
            'rep' => $validated['rep'] ?? 0,
            'execution_time' => $validated['execution_time'] ?? 0,
            'estimated_time' => $validated['estimated_time'] ?? 0,
            'status' => $validated['status'] ?? 'pending',
            'completion_percentage' => $validated['completion_percentage'] ?? 0,
        ]);
        return response()->json([
            'success' => true,
            'message' => 'Tạo chi tiết lịch sử tập luyện thành công',
            'data' => $detail->load('exercise')
        ], 201);
    }

    /**
     * Lấy chi tiết cụ thể
     */
    public function show(Request $request, $id)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $detail = WorkoutHistoryDetail::with(['exercise', 'workoutHistory'])
            ->find($id);
        if (!$detail) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy chi tiết'
            ], 404);
        }
        if ($detail->workoutHistory->member_id !== $member->id) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền truy cập'
            ], 403);
        }
        return response()->json([
            'success' => true,
            'data' => $detail
        ]);
    }

    /**
     * Cập nhật chi tiết
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'set_count' => 'nullable|integer|min:0',
            'rep' => 'nullable|integer|min:0',
            'execution_time' => 'nullable|integer|min:0',
            'estimated_time' => 'nullable|integer|min:0',
            'status' => 'nullable|string',
            'completion_percentage' => 'nullable|integer|min:0|max:100',
        ]);
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $detail = WorkoutHistoryDetail::with('workoutHistory')->find($id);
        if (!$detail) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy chi tiết'
            ], 404);
        }
        if ($detail->workoutHistory->member_id !== $member->id) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền truy cập'
            ], 403);
        }
        $detail->update($validated);
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thành công',
            'data' => $detail->load('exercise')
        ]);
    }


    public function indexExist(Request $request, $workoutHistoryId)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $workoutHistory = WorkoutHistory::find($workoutHistoryId);
        if (!$workoutHistory || $workoutHistory->member_id !== $member->id) {
            return response()->json([
                'success' => false,
                'message' => 'Không có quyền truy cập'
            ], 403);
        }
        $details = WorkoutHistoryDetail::where('workout_history_id', $workoutHistoryId)
            ->with('exercise')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $details
        ]);
    }
}
