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
            ['description' => 'Quả tnrị hệ thống']
        );

        Role::updateOrCreate(
            ['name' => 'PT'],
            ['description' => 'Huấn luyện viên']
        );

        Role::updateOrCreate(
            ['name' => 'MemberVip'],
            ['description' => 'Hội viên vip']
        );
        Role::updateOrCreate(
            ['name' => 'Member'],
            ['description' => 'Hội viên']
        );
        Role::updateOrCreate(
            ['name' => 'MemberUp'],
            ['description' => 'Hội viên nâng cao']
        );
    }
}
