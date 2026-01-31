<?php

namespace App\Http\Controllers;

use App\Models\BodyMetric;

class BodyMetricController extends Controller
{
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
