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
            'Cơ bản' => ['Sử dụng máy tập'],
            'Nâng cao' => ['Sử dụng máy tập', 'Theo dõi chỉ số cơ thể'],
            'VIP' => [
                'Sử dụng máy tập',
                'PT kèm 1-1',
                'Quản lý dinh dưỡng',
                'Theo dõi chỉ số cơ thể',
            ],
        ];

        foreach ($types as $typeName => $serviceNames) {
            $type = PackageType::firstOrCreate(['name' => $typeName]);

            $serviceIds = Service::whereIn('name', $serviceNames)->pluck('id');

            $type->services()->sync($serviceIds);
        }
    }
}
