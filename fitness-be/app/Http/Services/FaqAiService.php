<?php
namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
require_once 'prompt.php';
use Log;

class FaqAiService
{
    protected $promptFaq;
    public function __construct()
    {
        $prompt = require base_path('app/Http/Services/prompt.php');
        $this->promptFaq = $prompt['promptFaq'];
    }
    public function ask($question)
    {
        // ghép câu hỏi vào prompt
        $prompt = str_replace('{question}', $question, $this->promptFaq);
        Log::info("FAQ AI PROMPT", [
            "prompt" => $prompt
        ]);
        $response = Http::timeout(180)
            ->connectTimeout(60)
            ->post('http://localhost:11434/api/generate', [
                "model" => "gemma3:4b",
                "prompt" => $prompt,
                "stream" => false,
                "options" => [
                    "temperature" => 0.3,
                    "num_predict" => 200
                ]
            ]);

        return $response->json()['response'] ?? null;
    }
}