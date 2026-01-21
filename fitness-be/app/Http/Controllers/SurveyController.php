<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Survey;
use App\Models\SurveyTrainingTime;
use DB;
class SurveyController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'target_type' => 'required|in:lose_weight,gain_muscle,maintain_health,other',

            'training_times' => 'required|array|min:1',
            'training_times.*.day_of_week' => 'required|in:mon,tue,wed,thu,fri,sat,sun',
            'training_times.*.time_slot' => 'required|in:early_morning,morning,afternoon,evening',
        ]);

        $member = $request->user(); // lấy từ token

        if (!$member) {
            return response()->json([
                'message' => 'Chưa đăng nhập'
            ], 401);
        }
        $exists = Survey::where('member_id', $member->id)->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'code' => 'SURVEY_EXISTS',
                'message' => 'Bạn đã tạo khảo sát rồi'
            ], 409); // 409 Conflict
        }
        try {
            DB::beginTransaction();

            $survey = Survey::create([
                'member_id' => $member->id,
                'target_type' => $request->target_type,
                'has_trained' => $request->has_trained,
            ]);

            foreach ($request->training_times as $time) {
                SurveyTrainingTime::create([
                    'survey_id' => $survey->id,
                    'day_of_week' => $time['day_of_week'],
                    'time_slot' => $time['time_slot'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Lưu khảo sát thành công',
                'survey' => $survey->load('trainingTimes')
            ], 201);

        } catch (\Throwable $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Lưu khảo sát thất bại',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }


}
