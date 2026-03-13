<?php

namespace App\Http\Controllers;

use App\Models\MuscleGroup;
use Illuminate\Http\Request;

class MuscleGroupController extends Controller
{
    /**
     * GET /muscle-groups
     * Danh sách muscle group
     */
    public function index()
    {
        $muscleGroups = MuscleGroup::with('exercises')->get();

        return response()->json($muscleGroups);
    }

    /**
     * POST /muscle-groups
     * Tạo muscle group
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'is_main' => 'boolean',
        ]);

        $muscleGroup = MuscleGroup::create($data);

        return response()->json($muscleGroup, 201);
    }

    /**
     * GET /muscle-groups/{id}
     * Xem chi tiết
     */
    public function show($id)
    {
        $muscleGroup = MuscleGroup::with('exercises')->findOrFail($id);

        return response()->json($muscleGroup);
    }

    /**
     * PUT /muscle-groups/{id}
     * Cập nhật muscle group
     */
    public function update(Request $request, $id)
    {
        $muscleGroup = MuscleGroup::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'is_main' => 'boolean',
        ]);

        $muscleGroup->update($data);

        return response()->json($muscleGroup);
    }

    /**
     * DELETE /muscle-groups/{id}
     * Xóa muscle group
     */
    public function destroy($id)
    {
        $muscleGroup = MuscleGroup::findOrFail($id);

        // xóa quan hệ pivot trước (an toàn)
        $muscleGroup->exercises()->detach();
        $muscleGroup->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}
