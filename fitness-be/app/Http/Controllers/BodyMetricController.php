<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BodyMetric;
class BodyMetricController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'weight' => 'nullable|numeric|min:0',
            'height' => 'nullable|numeric|min:0',
            'muscle' => 'nullable|numeric|min:0',
            'body_fat' => 'nullable|numeric|min:0',
            'visceral_fat' => 'nullable|numeric|min:0',
            'body_water' => 'nullable|numeric|min:0',
        ]);

        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $bodyMetric = BodyMetric::create([
            'member_id' => $member->id,
            'weight' => $validated['weight'] ?? null,
            'height' => $validated['height'] ?? null,
            'muscle' => $validated['muscle'] ?? null,
            'body_fat' => $validated['body_fat'] ?? null,
            'visceral_fat' => $validated['visceral_fat'] ?? null,
            'body_water' => $validated['body_water'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lưu chỉ số cơ thể thành công',
            'data' => $bodyMetric
        ], 201);
    }

}
