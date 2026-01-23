<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TrainingPackage;
use App\Models\PackageType;
class TrainingPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $basicType = PackageType::where('name', 'Cơ bản')->first();
        $advancedType = PackageType::where('name', 'Nâng cao')->first();
        $vipType = PackageType::where('name', 'VIP')->first();

        TrainingPackage::insert([
            // ===== GÓI CƠ BẢN =====
            [
                'name' => 'Gói Cơ Bản 1 Tháng',
                'description' => 'Sử dụng máy tập, tập tự do',
                'price' => 300000,
                'duration_days' => 30,
                'package_type_id' => $basicType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Cơ Bản 3 Tháng',
                'description' => 'Tập tự do, sử dụng toàn bộ máy tập',
                'price' => 800000,
                'duration_days' => 90,
                'package_type_id' => $basicType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Cơ Bản 6 Tháng',
                'description' => 'Tập tự do, không giới hạn thời gian trong ngày',
                'price' => 1500000,
                'duration_days' => 180,
                'package_type_id' => $basicType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Cơ Bản 12 Tháng',
                'description' => 'Tập tự do cả năm, tiết kiệm chi phí',
                'price' => 2800000,
                'duration_days' => 365,
                'package_type_id' => $basicType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== GÓI NÂNG CAO =====
            [
                'name' => 'Gói Nâng Cao 1 Tháng',
                'description' => 'Tập tự do + theo dõi chỉ số cơ thể',
                'price' => 500000,
                'duration_days' => 30,
                'package_type_id' => $advancedType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Nâng Cao 3 Tháng',
                'description' => 'Theo dõi chỉ số, tư vấn lộ trình tập luyện',
                'price' => 1200000,
                'duration_days' => 90,
                'package_type_id' => $advancedType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Nâng Cao 6 Tháng',
                'description' => 'Theo dõi tiến trình + đánh giá thể hình định kỳ',
                'price' => 2200000,
                'duration_days' => 180,
                'package_type_id' => $advancedType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói Nâng Cao 12 Tháng',
                'description' => 'Theo dõi toàn diện, tối ưu thể lực',
                'price' => 4000000,
                'duration_days' => 365,
                'package_type_id' => $advancedType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== GÓI VIP =====
            [
                'name' => 'Gói VIP 1 Tháng',
                'description' => 'PT 1-1, quản lý dinh dưỡng, theo dõi cơ thể',
                'price' => 900000,
                'duration_days' => 30,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói VIP 3 Tháng',
                'description' => 'PT 1-1 chuyên sâu, kế hoạch dinh dưỡng cá nhân',
                'price' => 2500000,
                'duration_days' => 90,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói VIP 6 Tháng',
                'description' => 'PT cá nhân + báo cáo tiến trình hàng tháng',
                'price' => 4800000,
                'duration_days' => 180,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gói VIP 12 Tháng',
                'description' => 'PT riêng, quản lý toàn diện thể hình & sức khỏe',
                'price' => 9000000,
                'duration_days' => 365,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // ===== GÓI VIP ĐẶC BIỆT =====
            [
                'name' => 'VIP Giảm Cân Cấp Tốc',
                'description' => 'PT 1-1 + dinh dưỡng chuyên biệt giảm mỡ',
                'price' => 1800000,
                'duration_days' => 45,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'VIP Tăng Cơ Chuyên Sâu',
                'description' => 'PT cá nhân + giáo án tăng cơ',
                'price' => 2000000,
                'duration_days' => 60,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'VIP Phục Hồi Thể Lực',
                'description' => 'PT riêng, bài tập nhẹ phục hồi',
                'price' => 1600000,
                'duration_days' => 60,
                'package_type_id' => $vipType->id,
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
