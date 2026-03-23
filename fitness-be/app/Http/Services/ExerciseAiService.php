<?php
namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
require_once 'prompt.php';
use App\Models\WorkoutHistory;
use App\Models\MuscleGroup;
use Log;

class ExerciseAiService
{
    protected $promptExercise;
    public function __construct()
    {
        $prompt = require base_path('app/Http/Services/prompt.php');
        $this->promptExercise = $prompt['promptConsultSchedule'];
    }
    public function getRecentMuscleGroups($memberId)
    {
        // lấy 3 ngày gần nhất trong 7 ngày
        $days = WorkoutHistory::where('member_id', $memberId)
            ->whereDate('date', '>=', now()->subDays(7))
            ->selectRaw('DATE(date) as day')
            ->groupBy('day')
            ->orderByDesc('day')
            ->limit(4)
            ->pluck('day');

        $result = [];

        foreach ($days as $day) {

            $groups = MuscleGroup::whereHas(
                'exercises.details.workoutHistory',
                function ($q) use ($memberId, $day) {

                    $q->where('member_id', $memberId)
                        ->whereDate('date', $day);
                }
            )
                ->select('id', 'name')
                ->distinct()
                ->get();

            $result[] = [
                'day' => $day,
                'muscle_groups' => $groups
            ];
        }

        return $result;
    }
    public function buildPrompt($memberId, $question)
    {
        $history = $this->getRecentMuscleGroups($memberId);

        $lichTapText = "";

        foreach ($history as $item) {

            $day = $item['day'];

            $groups = collect($item['muscle_groups'])
                ->pluck('name')
                ->join(', ');

            $lichTapText .= "Ngày {$day}: {$groups}\n";
        }

        // thay vào prompt
        $prompt = str_replace(
            ['{Lich_tap}', '{Cau_hoi}'],
            [$lichTapText, $question],
            $this->promptExercise
        );

        return $prompt;
    }
    public function ask($question, $memberId)
    {
        // ghép câu hỏi vào prompt
        $prompt = $this->buildPrompt($memberId, $question);
        Log::info("Exercise AI PROMPT", [
            "prompt" => $prompt
        ]);
        set_time_limit(300);
        $response = Http::timeout(300)
            ->connectTimeout(60)
            ->post('http://localhost:11434/api/generate', [
                "model" => "qwen2.5:7b",
                "prompt" => $prompt,
                "stream" => false,
                "options" => [
                    "temperature" => 0.2,
                    "num_predict" => 120,
                    "num_ctx" => 8192,
                    "top_p" => 0.9,
                    "repeat_penalty" => 1.1
                ]
            ]);

        return $response->json()['response'] ?? null;
    }
}
?>