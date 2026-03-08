<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BodyMetricSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('body_metrics')->insert([
            [
                'member_id' => 1,
                'weight' => 65,
                'height' => 170,
                'muscle' => 45,
                'body_fat' => 18,
                'visceral_fat' => 8,
                'body_water' => 55,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'member_id' => 2,
                'weight' => 70,
                'height' => 172,
                'muscle' => 47,
                'body_fat' => 20,
                'visceral_fat' => 9,
                'body_water' => 54,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'member_id' => 3,
                'weight' => 68,
                'height' => 168,
                'muscle' => 46,
                'body_fat' => 19,
                'visceral_fat' => 8.5,
                'body_water' => 56,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'member_id' => 4,
                'weight' => 75,
                'height' => 175,
                'muscle' => 50,
                'body_fat' => 22,
                'visceral_fat' => 10,
                'body_water' => 53,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'member_id' => 5,
                'weight' => 60,
                'height' => 165,
                'muscle' => 43,
                'body_fat' => 17,
                'visceral_fat' => 7,
                'body_water' => 57,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
        ]);
    }
}
