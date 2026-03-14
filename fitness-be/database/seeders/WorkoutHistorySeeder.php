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
                'date' => '2026-03-01',
                'day_of_week' => 7,
                'completion_percentage' => 0,
                'created_at' => '2026-03-01 00:00:00',
                'updated_at' => '2026-03-01 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 740,
                'date' => '2026-03-03',
                'day_of_week' => 4,
                'completion_percentage' => 0,
                'created_at' => '2026-03-03 00:00:00',
                'updated_at' => '2026-03-03 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 650,
                'date' => '2026-03-05',
                'day_of_week' => 6,
                'completion_percentage' => 0,
                'created_at' => '2026-03-05 00:00:00',
                'updated_at' => '2026-03-05 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 435,
                'date' => '2026-03-02',
                'day_of_week' => 3,
                'completion_percentage' => 0,
                'created_at' => '2026-03-02 00:00:00',
                'updated_at' => '2026-03-02 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 555,
                'date' => '2026-03-06',
                'day_of_week' => 7,
                'completion_percentage' => 0,
                'created_at' => '2026-03-06 00:00:00',
                'updated_at' => '2026-03-06 00:00:00'
            ],
            [
                'member_id' => 1,
                'total_time' => 760,
                'date' => '2026-03-11',
                'day_of_week' => 4,
                'completion_percentage' => 0,
                'created_at' => '2026-03-11 00:00:00',
                'updated_at' => '2026-03-11 00:00:00'
            ],
        ]);
    }
}