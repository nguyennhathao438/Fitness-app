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
            [
                'member_id' => 2,
                'weight' => 85,
                'height' => 172,
                'muscle' => 40,
                'body_fat' => 30,
                'visceral_fat' => 14,
                'body_water' => 48,
                'created_at' => now()->subMonths(3),
                'updated_at' => now()->subMonths(3),
            ],
            [
                'member_id' => 2,
                'weight' => 78,
                'height' => 172,
                'muscle' => 43,
                'body_fat' => 25,
                'visceral_fat' => 11,
                'body_water' => 50,
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subMonths(2),
            ],
            [
                'member_id' => 2,
                'weight' => 72,
                'height' => 172,
                'muscle' => 46,
                'body_fat' => 20,
                'visceral_fat' => 9,
                'body_water' => 53,
                'created_at' => now()->subMonth(),
                'updated_at' => now()->subMonth(),
            ],
            [
                'member_id' => 2,
                'weight' => 70,
                'height' => 172,
                'muscle' => 47,
                'body_fat' => 18,
                'visceral_fat' => 8,
                'body_water' => 55,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== MEMBER 32 (từ béo → fit hơn) =====
            [
                'member_id' => 32,
                'weight' => 95,
                'height' => 175,
                'muscle' => 42,
                'body_fat' => 32,
                'visceral_fat' => 15,
                'body_water' => 47,
                'created_at' => now()->subMonths(4),
                'updated_at' => now()->subMonths(4),
            ],
            [
                'member_id' => 32,
                'weight' => 88,
                'height' => 175,
                'muscle' => 44,
                'body_fat' => 28,
                'visceral_fat' => 13,
                'body_water' => 49,
                'created_at' => now()->subMonths(3),
                'updated_at' => now()->subMonths(3),
            ],
            [
                'member_id' => 32,
                'weight' => 80,
                'height' => 175,
                'muscle' => 47,
                'body_fat' => 24,
                'visceral_fat' => 11,
                'body_water' => 52,
                'created_at' => now()->subMonths(2),
                'updated_at' => now()->subMonths(2),
            ],
            [
                'member_id' => 32,
                'weight' => 74,
                'height' => 175,
                'muscle' => 50,
                'body_fat' => 20,
                'visceral_fat' => 9,
                'body_water' => 55,
                'created_at' => now()->subMonth(),
                'updated_at' => now()->subMonth(),
            ],
        ]);
    }
}
