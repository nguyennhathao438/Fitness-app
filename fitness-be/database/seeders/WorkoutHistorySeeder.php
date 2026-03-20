<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkoutHistorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('workout_history')->insert([
            [
                'member_id' => 1,
                'total_time' => 645,
                'date' => '2026-03-13',
                'day_of_week' => 6,
                'completion_percentage' => 0,
                'created_at' => '2026-03-13 00:00:00',
                'updated_at' => '2026-03-13 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 740,
                'date' => '2026-03-12',
                'day_of_week' => 5,
                'completion_percentage' => 0,
                'created_at' => '2026-03-12 00:00:00',
                'updated_at' => '2026-03-12 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 650,
                'date' => '2026-03-10',
                'day_of_week' => 3,
                'completion_percentage' => 0,
                'created_at' => '2026-03-10 00:00:00',
                'updated_at' => '2026-03-10 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 435,
                'date' => '2026-03-09',
                'day_of_week' => 2,
                'completion_percentage' => 0,
                'created_at' => '2026-03-09 00:00:00',
                'updated_at' => '2026-03-09 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 555,
                'date' => '2026-03-08',
                'day_of_week' => 'CN',
                'completion_percentage' => 0,
                'created_at' => '2026-03-08 00:00:00',
                'updated_at' => '2026-03-08 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 760,
                'date' => '2026-03-07',
                'day_of_week' => 7,
                'completion_percentage' => 0,
                'created_at' => '2026-03-07 00:00:00',
                'updated_at' => '2026-03-07 00:00:00'
            ],
        ]);
    }
}