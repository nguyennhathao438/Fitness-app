<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FavoriteExercise;
use DB;

class FavoriteExerciseController extends Controller
{
    /**
     * Lấy danh sách bài tập yêu thích
     */
    public function index(Request $request)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $favorites = FavoriteExercise::with('exercise')
            ->where('member_id', $member->id)
            ->get();
        return response()->json([
            'success' => true,
            'data' => $favorites
        ]);
    }

    /**
     * Thêm bài tập yêu thích
     */
    public function store(Request $request)
    {
        $request->validate([
            'exercise_id' => 'required|exists:exercises,id',
        ]);
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $exists = FavoriteExercise::where('member_id', $member->id)
            ->where('exercise_id', $request->exercise_id)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'code' => 'FAVORITE_EXISTS',
                'message' => 'Bài tập đã có trong danh sách yêu thích'
            ], 409);
        }
        try {
            $favorite = FavoriteExercise::create([
                'member_id' => $member->id,
                'exercise_id' => $request->exercise_id
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Thêm vào yêu thích thành công',
                'data' => $favorite
            ], 201);
        } catch (\Throwable $e) {

            return response()->json([
                'success' => false,
                'message' => 'Thêm yêu thích thất bại',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Xóa bài tập yêu thích
     */
    public function destroy(Request $request, $exerciseId)
    {
        $member = $request->user();
        if (!$member) {
            return response()->json([
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        try {
            $deleted = FavoriteExercise::where('member_id', $member->id)
                ->where('exercise_id', $exerciseId)
                ->delete();

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy bài tập yêu thích'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'message' => 'Xóa khỏi yêu thích thành công'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Xóa yêu thích thất bại',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
}
