<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveyTrainingTimeSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement("
            INSERT INTO survey_training_times (survey_id, day_of_week, time_slot, created_at, updated_at)
            SELECT 
                s.id,
                d.day_of_week,
                t.time_slot,
                NOW(),
                NOW()
            FROM surveys s
            JOIN members m ON m.id = s.member_id
            JOIN (
                SELECT 'mon' AS day_of_week UNION ALL
                SELECT 'tue' UNION ALL
                SELECT 'wed' UNION ALL
                SELECT 'thu' UNION ALL
                SELECT 'fri' UNION ALL
                SELECT 'sat' UNION ALL
                SELECT 'sun'
            ) d
            JOIN (
                -- lặp có chủ đích để tạo độ sáng khác nhau
                SELECT 'early_morning' AS time_slot UNION ALL
                SELECT 'morning' UNION ALL
                SELECT 'morning' UNION ALL
                SELECT 'morning' UNION ALL
                SELECT 'afternoon' UNION ALL
                SELECT 'afternoon' UNION ALL
                SELECT 'evening' UNION ALL
                SELECT 'evening' UNION ALL
                SELECT 'evening' UNION ALL
                SELECT 'evening' UNION ALL
                SELECT 'all'
            ) t
            WHERE m.id BETWEEN 1 AND 15
              AND m.id % 2 = 1
              AND (
                    (d.day_of_week IN ('mon','tue','wed','thu','fri') AND RAND() < 0.35)
                 OR (d.day_of_week IN ('sat','sun') AND RAND() < 0.6)
              )
        ");
    }
}
