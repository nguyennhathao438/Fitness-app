<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ExerciseMuscleGroupSeeder extends Seeder
{
    public function run(): void
    {
        $muscles = DB::table('muscle_groups')->pluck('id', 'name');
        $exercises = DB::table('exercises')->pluck('id', 'name');

        $data = [
            ['Barbell Bench Press', ['Ngực', 'Tay sau', 'Vai trước']],
            ['Incline Dumbbell Press', ['Ngực', 'Vai trước', 'Tay sau']],
            ['Pull Up', ['Lưng xô', 'Tay trước', 'Cẳng tay']],
            ['Lat Pulldown', ['Lưng xô', 'Tay trước']],
            ['Barbell Row', ['Lưng xô', 'Lưng dưới', 'Tay trước']],
            ['Shoulder Press', ['Vai trước', 'Vai giữa', 'Tay sau']],
            ['Lateral Raise', ['Vai giữa']],
            ['Barbell Curl', ['Tay trước', 'Cẳng tay']],
            ['Tricep Pushdown', ['Tay sau']],
            ['Squat', ['Đùi trước', 'Đùi sau', 'Mông']],
            ['Romanian Deadlift', ['Đùi sau', 'Mông', 'Lưng dưới']],
            ['Plank', ['Bụng', 'Cơ xiên bụng', 'Toàn thân']],
        ];

        foreach ($data as [$exerciseName, $muscleNames]) {
            foreach ($muscleNames as $muscleName) {
                DB::table('exercise_muscle_group')->insert([
                    'exercise_id' => $exercises[$exerciseName],
                    'muscle_group_id' => $muscles[$muscleName],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
            }
        }
    }
}
