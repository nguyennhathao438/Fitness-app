<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkoutHistoryDetailSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('workout_history_detail')->insert([
            [
                'workout_history_id' => 1,
                'exercise_id' => 1,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-01 00:00:00',
                'updated_at' => '2026-03-01 00:00:00'
            ],
            [
                'workout_history_id' => 2,
                'exercise_id' => 2,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-01 00:00:00',
                'updated_at' => '2026-03-01 00:00:00'
            ],
            [
                'workout_history_id' => 3,
                'exercise_id' => 7,
                'set_count' => 3,
                'rep' => 12,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-03 00:00:00',
                'updated_at' => '2026-03-03 00:00:00'
            ],
            [
                'workout_history_id' => 4,
                'exercise_id' => 3,
                'set_count' => 4,
                'rep' => 8,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'incomplete',
                'completion_percentage' => 0,
                'created_at' => '2026-03-03 00:00:00',
                'updated_at' => '2026-03-03 00:00:00'
            ],
            [
                'workout_history_id' => 4,
                'exercise_id' => 4,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-05 00:00:00',
                'updated_at' => '2026-03-05 00:00:00'
            ],
            [
                'workout_history_id' => 5,
                'exercise_id' => 10,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-02 00:00:00',
                'updated_at' => '2026-03-02 00:00:00'
            ],
            [
                'workout_history_id' => 5,
                'exercise_id' => 11,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-06 00:00:00',
                'updated_at' => '2026-03-06 00:00:00'
            ],
            [
                'workout_history_id' => 6,
                'exercise_id' => 11,
                'set_count' => 4,
                'rep' => 10,
                'execution_time' => 0,
                'estimated_time' => 0,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-11 00:00:00',
                'updated_at' => '2026-03-11 00:00:00'
            ],
            [
                'workout_history_id' => 6,
                'exercise_id' => 12,
                'set_count' => 3,
                'rep' => null,
                'execution_time' => 60,
                'estimated_time' => 60,
                'status' => 'completed',
                'completion_percentage' => 0,
                'created_at' => '2026-03-11 00:00:00',
                'updated_at' => '2026-03-11 00:00:00'
            ],
        ]);
    }
}