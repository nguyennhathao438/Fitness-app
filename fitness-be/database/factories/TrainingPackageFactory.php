<?php

namespace Database\Factories;

use App\Models\TrainingPackage;
use App\Models\PackageType; // ✅ BẮT BUỘC
use Illuminate\Database\Eloquent\Factories\Factory;

class TrainingPackageFactory extends Factory
{
    protected $model = TrainingPackage::class;

    public function definition()
    {
        return [
            'name' => 'Gói 1 tháng',
            'price' => 1000000,
            'duration_days' => 30,
            'package_type_id' => PackageType::factory(),
        ];
    }
}
