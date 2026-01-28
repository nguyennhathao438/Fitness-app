<?php

namespace Database\Factories;

use App\Models\PackageType;
use Illuminate\Database\Eloquent\Factories\Factory;

class PackageTypeFactory extends Factory
{
    protected $model = PackageType::class;

    public function definition()
    {
        return [
            'name' => 'PT',
        ];
    }
}
    