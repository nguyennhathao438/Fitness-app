<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use Illuminate\Http\Request;

class ExerciseController extends Controller
{
    /**
     * GET /exercises
     * Lấy danh sách exercise
     */
    public function index()
    {
        $exercises = Exercise::with('muscleGroups')->get();

        return response()->json($exercises);
    }

    /**
     * POST /exercises
     * Tạo exercise mới
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'rep_base' => 'nullable|integer',
            'set_base' => 'nullable|integer',
            'description' => 'nullable|string',
            'video' => 'nullable|string',
            'time_action' => 'nullable|integer',
            'muscle_group_ids' => 'nullable|array',
            'muscle_group_ids.*' => 'exists:muscle_groups,id',
        ]);

        $exercise = Exercise::create($data);

        // gắn muscle groups (pivot)
        if (!empty($data['muscle_group_ids'])) {
            $exercise->muscleGroups()->sync($data['muscle_group_ids']);
        }

        return response()->json($exercise->load('muscleGroups'), 201);
    }

    /**
     * GET /exercises/{id}
     * Xem chi tiết
     */
    public function show($id)
    {
        $exercise = Exercise::with('muscleGroups')->findOrFail($id);

        return response()->json($exercise);
    }

    /**
     * PUT /exercises/{id}
     * Cập nhật exercise
     */
    public function update(Request $request, $id)
    {
        $exercise = Exercise::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'rep_base' => 'nullable|integer',
            'set_base' => 'nullable|integer',
            'description' => 'nullable|string',
            'video' => 'nullable|string',
            'time_action' => 'nullable|integer',
            'muscle_group_ids' => 'nullable|array',
            'muscle_group_ids.*' => 'exists:muscle_groups,id',
        ]);

        $exercise->update($data);

        if (array_key_exists('muscle_group_ids', $data)) {
            $exercise->muscleGroups()->sync($data['muscle_group_ids']);
        }

        return response()->json($exercise->load('muscleGroups'));
    }

    /**
     * DELETE /exercises/{id}
     * Xóa exercise
     */
    public function destroy($id)
    {
        $exercise = Exercise::findOrFail($id);

        // xóa pivot trước (an toàn)
        $exercise->muscleGroups()->detach();
        $exercise->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }

    /**
     * GET /exercises/by-muscle-group/{muscleGroupId}
     */
    public function getByMuscleGroup($muscleGroupId)
    {
        $exercises = Exercise::whereHas('muscleGroups', function ($query) use ($muscleGroupId) {
            $query->where('muscle_group_id', $muscleGroupId);
        })
            ->with('muscleGroups')
            ->get();

        return response()->json($exercises);
    }
}
