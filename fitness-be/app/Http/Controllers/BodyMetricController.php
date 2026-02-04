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
    /**
     * Lấy chỉ số cơ thể mới nhất của 1 member
     * Dùng cho: hiển thị 6 card thông tin
     */
    public function getLastUpdated($memberId)
    {
        $latestMetric = BodyMetric::where('member_id', $memberId)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'data' => $latestMetric,
        ]);
    }

    public function index(Request $request)
    {
        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        // Optional pagination: pass ?per_page=10 to paginate
        $perPage = (int) $request->query('per_page', 0);

        $query = BodyMetric::where('member_id', $member->id)
            ->orderBy('created_at', 'desc');

        if ($perPage > 0) {
            $data = $query->paginate($perPage);
        } else {
            $data = $query->get();
        }

        return response()->json([
            'success' => true,
            'message' => 'Lấy chỉ số cơ thể thành công',
            'data' => $data
        ], 200);
    }

    public function latest(Request $request)
    {
        $member = $request->user();

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Chưa đăng nhập'
            ], 401);
        }

        $bodyMetric = BodyMetric::where('member_id', $member->id)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Lấy chỉ số cơ thể gần nhất thành công',
            'data' => $bodyMetric
        ], 200);
        return response()->json([
            'data' => $latestMetric,
        ]);
    }

    /**
     * Lấy toàn bộ lịch sử chỉ số cơ thể của 1 member
     * Dùng cho: biểu đồ thống kê
     */
    public function getAll($memberId)
    {
        $metrics = BodyMetric::where('member_id', $memberId)
            ->orderBy('created_at', 'asc')
            ->get([
                'weight',
                'muscle',
                'body_fat',
                'created_at',
                'updated_at'
            ]);

        return response()->json([
            'data' => $metrics,
        ]);
    }
}
