<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
use App\Models\PackageType;
class PackageTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'Cơ bản' => [
                'Sử dụng máy tập',
                'Quản lý dinh dưỡng',
                'Giám sát tập luyện'
            ],
            'Nâng cao' => [
                'Sử dụng máy tập',
                'Giám sát tập luyện',
                'Quản lý dinh dưỡng',
                'Xem video hướng dẫn',
                'Nhận diện ảnh dinh dưỡng'
            ],
            'VIP' => [
                'Sử dụng máy tập',
                'PT kèm 1-1',
                'Quản lý dinh dưỡng',
                'Giám sát tập luyện',
                'Xem video hướng dẫn',
                'Nhận diện ảnh dinh dưỡng'
            ],
        ];

        foreach ($types as $typeName => $serviceNames) {
            $type = PackageType::firstOrCreate(['name' => $typeName]);

            $serviceIds = Service::whereIn('name', $serviceNames)->pluck('id');

            $type->services()->sync($serviceIds);
        }
    }
}
