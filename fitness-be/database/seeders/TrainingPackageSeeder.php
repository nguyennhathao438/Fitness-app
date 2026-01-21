<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TrainingPackage;
class TrainingPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TrainingPackage::insert([
            [
                'name' => 'Gói Cơ Bản 1 Tháng',
                'description' => 'Tập tự do, không PT',
                'price' => 300000,
                'duration_days' => 30,
                'has_pt' => false,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Nâng Cao 3 Tháng',
                'description' => 'Tập tự do + giáo án',
                'price' => 800000,
                'duration_days' => 90,
                'has_pt' => false,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói VIP 3 Tháng',
                'description' => 'Có PT cá nhân',
                'price' => 1500000,
                'duration_days' => 90,
                'has_pt' => true,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
