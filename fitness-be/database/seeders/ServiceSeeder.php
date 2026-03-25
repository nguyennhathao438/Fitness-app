<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Service;
class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            ['name' => 'Sử dụng máy tập'],
            ['name' => 'PT kèm 1-1'],
            ['name' => 'Quản lý dinh dưỡng'],
            ['name' => 'Theo dõi chỉ số cơ thể'],
        ];

        Service::insert($services);
    }
}
