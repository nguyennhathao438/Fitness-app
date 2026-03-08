<?php

namespace App\Http\Controllers;

use App\Models\SurveyTrainingTime;
use Illuminate\Support\Facades\DB;

class SurveyTrainingController extends Controller
{
    // lấy thống kê survey
    public function getSurveyMember(){
        $data = SurveyTrainingTime::query()
        ->join('surveys', 'survey_training_times.survey_id', '=', 'surveys.id')
        ->join('members', 'surveys.member_id', '=', 'members.id')
        ->where('members.is_deleted', 0)
        ->select([
            'survey_training_times.day_of_week',
            DB::raw("SUM(time_slot = 'early_morning') as earlymorning"),
            DB::raw("SUM(time_slot = 'morning') as morning"),
            DB::raw("SUM(time_slot = 'afternoon') as afternoon"),
            DB::raw("SUM(time_slot = 'evening') as evening"),
            DB::raw("SUM(time_slot = 'all') as all_time"),
        ])
        ->groupBy('survey_training_times.day_of_week')
        ->get()
        ->keyBy('day_of_week');

    return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }
}
