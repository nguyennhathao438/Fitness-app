<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class NutritionLogSeeder extends Seeder
{
    public function run(): void
    {
        $startDate = '2026-03-25';
        $endDate = '2026-04-03'; // có thể đổi thành 2026-04-01 nếu muốn ngắn hơn

        $mealTemplates = [
            [
                'meal_name' => 'Apple Pie',
                'calories' => 320,
                'meal_time' => '08:00:00',
                'source' => 'recent',
                'note' => 'Bữa sáng nhẹ',
            ],
            [
                'meal_name' => 'Donuts',
                'calories' => 260,
                'meal_time' => '10:30:00',
                'source' => 'ai',
                'note' => 'Ăn phụ buổi sáng',
            ],
            [
                'meal_name' => 'Ức gà áp chảo',
                'calories' => 420,
                'meal_time' => '12:15:00',
                'source' => 'manual',
                'note' => 'Ít dầu, nhiều protein',
            ],
            [
                'meal_name' => 'Cơm gà',
                'calories' => 540,
                'meal_time' => '18:30:00',
                'source' => 'manual',
                'note' => 'Bữa tối',
            ],
            [
                'meal_name' => 'Salad cá ngừ',
                'calories' => 290,
                'meal_time' => '20:00:00',
                'source' => 'schedule',
                'note' => 'Ăn tối muộn',
            ],
        ];

        $rows = [];
        $now = now();

        foreach (range(1, 10) as $memberId) {
            foreach (CarbonPeriod::create($startDate, $endDate) as $date) {
                $randomMeals = collect($mealTemplates)->shuffle()->take(rand(2, 4))->values();

                foreach ($randomMeals as $meal) {
                    $rows[] = [
                        'member_id' => $memberId,
                        'meal_name' => $meal['meal_name'],
                        'calories' => $meal['calories'],
                        'meal_date' => $date->format('Y-m-d'),
                        'meal_time' => $meal['meal_time'],
                        'image_url' => null,
                        'source' => $meal['source'],
                        'note' => $meal['note'],
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }
        }

        DB::table('nutrition_logs')->insert($rows);
    }
}