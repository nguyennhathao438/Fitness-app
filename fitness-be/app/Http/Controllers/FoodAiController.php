<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class FoodAiController extends Controller
{
    public function predictFood(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            $file = $request->file('image');

            $response = Http::timeout(60)
                ->attach(
                    'file',
                    file_get_contents($file->getRealPath()),
                    $file->getClientOriginalName()
                )
                ->post('http://127.0.0.1:8001/predict-food');

            if (!$response->successful()) {
                return response()->json([
                    'error' => 'Không gọi được Food API',
                    'python_response' => $response->body()
                ], 500);
            }

            return response()->json($response->json(), 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Lỗi kết nối tới Python API',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}