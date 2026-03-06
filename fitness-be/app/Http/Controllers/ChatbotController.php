<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Services\PackageAiService;
use Illuminate\Support\Facades\DB;
use App\Http\Services\FaqAiService;
class ChatbotController extends Controller
{
    public function suggestPackage($question)
    {
        $aiService = app(PackageAiService::class);
        $sql = $aiService->generateSQL($question);
        if (!$sql) {
            return response()->json([
                "error" => "AI không sinh được SQL"
            ]);
        }
        $danger = ['drop', 'update', 'insert', 'alter', 'truncate'];

        foreach ($danger as $word) {
            if (stripos($sql, $word) !== false) {
                return response()->json(["error" => "SQL không hợp lệ", "sql" => $sql]);
            }
        }
        try {
            $data = DB::select($sql);

            // gọi formatter LLM
            $answer = $aiService->formatResponseWithLLM($question, $data);

            return response()->json([
                "sql" => $sql,
                "data" => $data,
                "answer" => $answer
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                "error" => $e->getMessage(),
                "sql" => $sql
            ], 500);
        }
    }
    public function getIntent(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
        ]);

        $question = $request->question;

        $response = Http::post('http://127.0.0.1:8001/predict', [
            'text' => $question
        ]);

        if (!$response->successful()) {
            return response()->json([
                "error" => "Không gọi được model intent"
            ]);
        }

        $data = $response->json();

        $intent = $data['intent'] ?? null;

        return $this->handle($intent, $question);
    }
    public function handle($intent, $question)
    {
        switch ($intent) {

            case 'goi_y_goi_tap':
                return $this->suggestPackage($question);

            case 'faq':
                $faqService = app(FaqAiService::class);
                $answer = $faqService->ask($question);
                return response()->json(["answer" => $answer], 200);

            case 'xem_lich':
                return response()->json(["message" => "Xem lịch"], 200);

            default:
                return response()->json([
                    "message" => "Xin lỗi, tôi chưa hiểu yêu cầu."
                ], 400);
        }
    }
}
