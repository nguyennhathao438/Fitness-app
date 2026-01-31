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
        // ===== ROLES =====
        $admin = Role::firstOrCreate(
            ['name' => 'admin'],
            ['description' => 'Quản trị hệ thống']
        );

        $pt = Role::firstOrCreate(
            ['name' => 'pt'],
            ['description' => 'Huấn luyện viên']
        );

        $receptionist = Role::firstOrCreate(
            ['name' => 'receptionist'],
            ['description' => 'Lễ tân']
        );

        // ===== GÁN PERMISSION =====
        // Admin: full quyền
        $admin->permissions()->sync(
            Permission::pluck('id')
        );

        // PT
        $pt->permissions()->sync(
            Permission::whereIn('code', [
                'member.view',
                'PT',
                'schedule.update'
            ])->pluck('id')
        );

        // Lễ tân
        $receptionist->permissions()->sync(
            Permission::whereIn('code', [
                'member.view',
                'member.create',
                'payment.create'
            ])->pluck('id')
        );
    }
}
