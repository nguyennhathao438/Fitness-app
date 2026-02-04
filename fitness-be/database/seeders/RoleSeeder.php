<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::updateOrCreate(
            ['name' => 'Admin'],
            ['description' => 'Quản trị hệ thống']
        );

        Role::updateOrCreate(
            ['name' => 'PT'],
            ['description' => 'Huấn luyện viên']
        );

        Role::updateOrCreate(
            ['name' => 'Receptionist'],
            ['description' => 'Lễ tân']
        );
    }
}
