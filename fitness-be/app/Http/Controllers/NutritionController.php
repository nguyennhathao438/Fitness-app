<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NutritionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NutritionController extends Controller
{
    public function getByDate($date, Request $request)
    {
        $memberId = $request->member_id;

        $query = NutritionLog::whereDate('meal_date', $date);

        if ($memberId) {
            $query->where('member_id', $memberId);
        }

        $meals = $query->orderBy('meal_time', 'asc')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'date' => $date,
            'total_calories' => $meals->sum('calories'),
            'total_meals' => $meals->count(),
            'meals' => $meals->map(function ($meal) {
                return [
                    'id' => $meal->id,
                    'member_id' => $meal->member_id,
                    'meal_name' => $meal->meal_name,
                    'calories' => $meal->calories,
                    'quantity' => $meal->quantity,
                    'unit' => $meal->unit,
                    'meal_date' => $meal->meal_date ? $meal->meal_date->format('Y-m-d') : null,
                    'meal_time' => $meal->meal_time,
                    'image_url' => $meal->image_url,
                    'source' => $meal->source,
                    'note' => $meal->note,
                    'created_at' => $meal->created_at,
                    'updated_at' => $meal->updated_at,
                ];
            }),
        ]);
    }

    public function recentMeals(Request $request)
    {
        $memberId = $request->member_id;
        $limit = $request->limit ?? 40;

        $query = NutritionLog::query();

        if ($memberId) {
            $query->where('member_id', $memberId);
        }

        $meals = $query->latest('created_at')
            ->limit($limit)
            ->get();

        return response()->json([
            'meals' => $meals
        ]);
    }

    public function addMeal(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'required|exists:members,id',
            'meal_name' => 'required|string|max:255',
            'calories' => 'required|integer|min:0',
            'quantity' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'meal_date' => 'required|date',
            'meal_time' => 'nullable',
            'image_url' => 'nullable|string|max:255',
            'source' => 'nullable|in:manual,ai',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $meal = NutritionLog::create([
            'member_id' => $request->member_id,
            'meal_name' => $request->meal_name,
            'calories' => $request->calories,
            'quantity' => $request->quantity,
            'unit' => $request->unit,
            'meal_date' => $request->meal_date,
            'meal_time' => $request->meal_time,
            'image_url' => $request->image_url,
            'source' => $request->source ?? 'manual',
            'note' => $request->note,
        ]);

        return response()->json([
            'message' => 'Thêm món thành công',
            'meal' => $meal
        ], 201);
    }

    public function history(Request $request)
    {
        $memberId = $request->member_id;
        $from = $request->from;
        $to = $request->to;

        $query = NutritionLog::query();

        if ($memberId) {
            $query->where('member_id', $memberId);
        }

        if ($from) {
            $query->whereDate('meal_date', '>=', $from);
        }

        if ($to) {
            $query->whereDate('meal_date', '<=', $to);
        }

        $logs = $query->get()
            ->groupBy(function ($item) {
                return $item->meal_date->format('Y-m-d');
            })
            ->map(function ($items, $date) {
                return [
                    'date' => $date,
                    'total_calories' => $items->sum('calories'),
                    'total_meals' => $items->count(),
                ];
            })
            ->values();

        return response()->json([
            'history' => $logs
        ]);
    }

    public function addManyMeals(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'required|exists:members,id',
            'meal_date' => 'required|date',
            'meals' => 'required|array|min:1',
            'meals.*.meal_name' => 'required|string|max:255',
            'meals.*.calories' => 'required|integer|min:0',
            'meals.*.quantity' => 'nullable|numeric|min:0',
            'meals.*.unit' => 'nullable|string|max:50',
            'meals.*.meal_time' => 'nullable',
            'meals.*.image_url' => 'nullable|string|max:255',
            'meals.*.source' => 'nullable|in:manual,ai',
            'meals.*.note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $createdMeals = [];

        foreach ($request->meals as $item) {
            $createdMeals[] = NutritionLog::create([
                'member_id' => $request->member_id,
                'meal_name' => $item['meal_name'],
                'calories' => $item['calories'],
                'quantity' => $item['quantity'] ?? null,
                'unit' => $item['unit'] ?? null,
                'meal_date' => $request->meal_date,
                'meal_time' => $item['meal_time'] ?? null,
                'image_url' => $item['image_url'] ?? null,
                'source' => $item['source'] ?? 'manual',
                'note' => $item['note'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Thêm nhiều món thành công',
            'meals' => $createdMeals
        ], 201);
    }

    public function deleteMeal($id)
    {
        $meal = NutritionLog::find($id);

        if (!$meal) {
            return response()->json([
                'message' => 'Không tìm thấy món ăn'
            ], 404);
        }

        $meal->delete();

        return response()->json([
            'message' => 'Xóa món thành công'
        ]);
    }

    /**
     * =========================
     * THỐNG KÊ TỔNG QUAN
     * =========================
     */
    public function summary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $from = $request->from ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = $request->to ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        $query = NutritionLog::query()
            ->whereDate('meal_date', '>=', $from)
            ->whereDate('meal_date', '<=', $to);

        if ($request->member_id) {
            $query->where('member_id', $request->member_id);
        }

        $meals = $query->get();

        $daysWithMeals = $meals->groupBy(function ($item) {
            return $item->meal_date->format('Y-m-d');
        })->count();

        $totalCalories = $meals->sum('calories');
        $totalMeals = $meals->count();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'member_id' => $request->member_id,
            'total_calories' => $totalCalories,
            'total_meals' => $totalMeals,
            'days_with_meals' => $daysWithMeals,
            'avg_calories_per_day' => $daysWithMeals > 0 ? round($totalCalories / $daysWithMeals, 2) : 0,
            'avg_calories_per_meal' => $totalMeals > 0 ? round($totalCalories / $totalMeals, 2) : 0,
        ]);
    }

    /**
     * =========================
     * BIỂU ĐỒ CALO
     * =========================
     * type = day | month
     */
    public function chart(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'type' => 'nullable|in:day,month',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $type = $request->type ?? 'day';
        $from = $request->from ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = $request->to ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        $query = NutritionLog::query()
            ->whereDate('meal_date', '>=', $from)
            ->whereDate('meal_date', '<=', $to);

        if ($request->member_id) {
            $query->where('member_id', $request->member_id);
        }

        $meals = $query->get();

        if ($type === 'month') {
            $chart = $meals->groupBy(function ($item) {
                return $item->meal_date->format('Y-m');
            })->map(function ($items, $label) {
                return [
                    'label' => $label,
                    'total_calories' => $items->sum('calories'),
                    'total_meals' => $items->count(),
                ];
            })->values();
        } else {
            $chart = $meals->groupBy(function ($item) {
                return $item->meal_date->format('Y-m-d');
            })->map(function ($items, $label) {
                return [
                    'label' => $label,
                    'total_calories' => $items->sum('calories'),
                    'total_meals' => $items->count(),
                ];
            })->values();
        }

        return response()->json([
            'type' => $type,
            'from' => $from,
            'to' => $to,
            'chart' => $chart,
        ]);
    }

    /**
     * =========================
     * THỐNG KÊ THEO NGUỒN
     * =========================
     */
    public function sourceStats(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $from = $request->from ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = $request->to ?? Carbon::now()->endOfMonth()->format('Y-m-d');

        $query = NutritionLog::query()
            ->whereDate('meal_date', '>=', $from)
            ->whereDate('meal_date', '<=', $to);

        if ($request->member_id) {
            $query->where('member_id', $request->member_id);
        }

        $meals = $query->get();

        $stats = $meals->groupBy('source')->map(function ($items, $source) {
            return [
                'source' => $source,
                'total_meals' => $items->count(),
                'total_calories' => $items->sum('calories'),
            ];
        })->values();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'sources' => $stats,
        ]);
    }

    /**
     * =========================
     * TOP MÓN ĂN
     * =========================
     */
    public function topMeals(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'member_id' => 'nullable|exists:members,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'limit' => 'nullable|integer|min:1|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $from = $request->from ?? Carbon::now()->startOfMonth()->format('Y-m-d');
        $to = $request->to ?? Carbon::now()->endOfMonth()->format('Y-m-d');
        $limit = $request->limit ?? 10;

        $query = NutritionLog::query()
            ->whereDate('meal_date', '>=', $from)
            ->whereDate('meal_date', '<=', $to);

        if ($request->member_id) {
            $query->where('member_id', $request->member_id);
        }

        $meals = $query->get()
            ->groupBy('meal_name')
            ->map(function ($items, $mealName) {
                return [
                    'meal_name' => $mealName,
                    'total_times' => $items->count(),
                    'total_calories' => $items->sum('calories'),
                    'avg_calories' => round($items->avg('calories'), 2),
                ];
            })
            ->sortByDesc('total_times')
            ->values()
            ->take($limit)
            ->values();

        return response()->json([
            'from' => $from,
            'to' => $to,
            'top_meals' => $meals,
        ]);
    }
}