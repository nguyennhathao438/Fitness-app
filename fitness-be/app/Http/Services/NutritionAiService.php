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

        // Mapping giới tính
        $genderMap = [
            'male' => 'Nam',
            'female' => 'Nữ',
            'other' => 'Khác'
        ];

        // ===== DATA GỐC =====
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

        // ===== GỌI CALCULATE =====
        $calculated = $this->caculate($data);

        // ===== MERGE =====
        $finalData = array_merge($data, $calculated);

        // Convert thành JSON
        return json_encode($finalData, JSON_UNESCAPED_UNICODE);
    }
    public function caculate($data)
    {
        $result = [
            'bmi' => null,
            'bmr' => null,
        ];

        if (!empty($data['weight']) && !empty($data['height'])) {
            $height_m = $data['height'] / 100;
            if ($height_m > 0) {
                $result['bmi'] = round($data['weight'] / ($height_m * $height_m), 2);
            }
        }

        if (
            !empty($data['weight']) &&
            !empty($data['height']) &&
            !empty($data['age']) &&
            !empty($data['gender'])
        ) {
            $weight = $data['weight'];
            $height = $data['height'];
            $age = $data['age'];

            if ($data['gender'] === 'male') {
                $result['bmr'] = 10 * $weight + 6.25 * $height - 5 * $age + 5;
            } else {
                $result['bmr'] = 10 * $weight + 6.25 * $height - 5 * $age - 161;
            }
        }
        return $result;
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
