<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,

            MemberSeeder::class,


            ServiceSeeder::class,
            PackageTypeSeeder::class,
            TrainingPackageSeeder::class,

            InvoiceSeeder::class,
            MuscleGroupSeeder::class,
            ExerciseSeeder::class,
            ExerciseMuscleGroupSeeder::class,
            BodyMetricSeeder::class,
            MemberRoleSeeder::class,
            SurveySeeder::class,
            SurveyTrainingTimeSeeder::class,
            PTClientSeeder::class,
            NotificationSeeder::class,
            PtScheduleSeeder::class,
            WorkoutHistorySeeder::class,
            WorkoutHistoryDetailSeeder::class,
            NutritionLogSeeder::class,
        ]);
    }
}
