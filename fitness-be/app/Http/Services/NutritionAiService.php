<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
require_once 'prompt.php';
use Log;
use Carbon\Carbon;
use App\Models\Member;
class NutritionAiService
{
    protected $promptNutrition;
    public function __construct()
    {
        $prompt = require base_path('app/Http/Services/prompt.php');
        $this->promptNutrition = $prompt['promptNutrition'];
    }

    public function buildMemberPrompt($memberId)
    {
        $member = Member::with('bodyMetrics')
            ->findOrFail($memberId);

        // Tính tuổi
        $age = null;
        if ($member->birthday) {
            $age = Carbon::parse($member->birthday)->age;
        }

        // Lấy chỉ số mới nhất
        $metric = $member->bodyMetrics()
            ->latest()
            ->first();

        // Mapping giới tính cho dễ hiểu
        $genderMap = [
            'male' => 'Nam',
            'female' => 'Nữ',
            'other' => 'Khác'
        ];

        $data = [
            'gender' => $genderMap[$member->gender] ?? null,
            'age' => $age,
            'weight' => $metric->weight ?? null,
            'height' => $metric->height ?? null,
            'muscle' => $metric->muscle ?? null,
            'body_fat' => $metric->body_fat ?? null,
            'visceral_fat' => $metric->visceral_fat ?? null,
            'body_water' => $metric->body_water ?? null,
        ];

        // Convert thành string để đưa vào prompt
        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }
    public function ask($question, $memberId)
    {
        // Lấy data user
        $memberData = $this->buildMemberPrompt($memberId);

        // Replace vào prompt template
        $finalPrompt = str_replace(
            ['{Thong_tin}', '{Cau_hoi}'],
            [$memberData, $question],
            $this->promptNutrition
        );
        Log::info("Nutrition AI PROMPT", [
            "prompt" => $finalPrompt
        ]);

        set_time_limit(300);

        $response = Http::timeout(300)
            ->connectTimeout(60)
            ->post('http://localhost:11434/api/generate', [
                "model" => "qwen2.5:7b",
                "prompt" => $finalPrompt,
                "stream" => false,
                "options" => [
                    "temperature" => 0.2,
                    "num_predict" => 300, // tăng để đủ trả JSON + giải thích
                    "num_ctx" => 8192,
                    "top_p" => 0.9,
                    "repeat_penalty" => 1.1
                ]
            ]);

        return $response->json()['response'] ?? null;
    }
}
