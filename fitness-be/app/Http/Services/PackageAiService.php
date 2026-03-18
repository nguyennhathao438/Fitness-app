<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
require_once 'prompt.php';
use Log;

class PackageAiService
{
    protected $promptPackage;
    protected $promptResponsePackage;
    public function __construct()
    {
        $prompt = require base_path('app/Http/Services/prompt.php');
        $this->promptPackage = $prompt['promptPackage'];
        $this->promptResponsePackage = $prompt['promptResponsePackage'];
    }
    public function generateSQL($question)
    {
        Log::info("QUESTION RAW", [
            "question" => $question
        ]);
        set_time_limit(300);
        $prompt = str_replace(
            '{question}',
            $question,
            $this->promptPackage
        );
        Log::info("AI PROMPT", [
            "prompt" => $prompt
        ]);
        $response = Http::timeout(180)
            ->connectTimeout(60)
            ->post('http://localhost:11434/api/generate', [
                "model" => "qwen3-4g-text2sql",
                "prompt" => $prompt,
                "stream" => false,
            ]);

        $data = $response->json();

        return $data['response'] ?? null;
    }
    public function formatResponseWithLLM($question, $rows)
    {
        if (empty($rows)) {
            return "Hiện tại phòng gym chưa có gói tập nào phù hợp với yêu cầu của bạn";
        }
        $prompt = str_replace(
            '{question}',
            $question,
            $this->promptResponsePackage
        );
        $prompt = str_replace(
            '{dataText}',
            $this->convertRowsToText($rows),
            $prompt
        );
        Log::info("AI RESPONSE PROMPT", [
            "prompt" => $prompt
        ]);
        set_time_limit(300);
        $response = Http::timeout(180)
            ->connectTimeout(60)
            ->post('http://localhost:11434/api/generate', [
                "model" => "qwen2.5:7b",
                "prompt" => $prompt,
                "stream" => false,
                "options" => [
                    "temperature" => 0.3
                ]
            ]);

        return $response["response"] ?? "Không tạo được phản hồi";
    }
    private function convertRowsToText($rows)
    {
        $dataText = "";

        foreach ($rows as $row) {

            // convert object → array
            $fields = (array) $row;

            $line = "- ";

            foreach ($fields as $key => $value) {

                // bỏ field null
                if ($value === null || $value === "") {
                    continue;
                }

                $line .= "$key: $value, ";
            }

            // bỏ dấu phẩy cuối
            $line = rtrim($line, ", ");

            $dataText .= $line . "\n";
        }

        return $dataText;
    }

}
