<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\NutritionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'meals' => $meals
        ]);
    }
public function recentMeals(Request $request)
{
    $memberId = $request->member_id;
    $limit = $request->limit ?? 20;

    $query = NutritionLog::query();

    if ($memberId) {
        $query->where('member_id', $memberId);
    }

    $meals = $query->orderBy('meal_date', 'desc')
        ->orderBy('meal_time', 'desc')
        ->orderBy('created_at', 'desc')
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
            'meal_date' => 'required|date',
            'meal_time' => 'nullable',
            'image_url' => 'nullable|string|max:255',
            'source' => 'nullable|in:manual,ai,schedule,recent',
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
        'meals.*.meal_time' => 'nullable',
        'meals.*.image_url' => 'nullable|string|max:255',
        'meals.*.source' => 'nullable|in:manual,ai,schedule,recent',
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
            'meal_date' => $request->meal_date,
            'meal_time' => $item['meal_time'] ?? null,
            'image_url' => $item['image_url'] ?? null,
            'source' => $item['source'] ?? 'recent',
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
}