<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // ===== USER =====
            [
                'action' => 'read',
                'code' => 'user.read',
                'name' => 'Quản lý người dùng',
            ],
            [
                'action' => 'create',
                'code' => 'user.create',
                'name' => 'Quản lý người dùng',
            ],
            [
                'action' => 'update',
                'code' => 'user.update',
                'name' => 'Quản lý người dùng',
            ],
            [
                'action' => 'delete',
                'code' => 'user.delete',
                'name' => 'Quản lý người dùng',
            ],

            // ===== SERVICE =====
            [
                'action' => 'read',
                'code' => 'service.read',
                'name' => 'Quản lý dịch vụ',
            ],
            [
                'action' => 'create',
                'code' => 'service.create',
                'name' => 'Quản lý dịch vụ',
            ],
            [
                'action' => 'update',
                'code' => 'service.update',
                'name' => 'Quản lý dịch vụ',
            ],
            [
                'action' => 'delete',
                'code' => 'service.delete',
                'name' => 'Quản lý dịch vụ',
            ],

            // ===== INVOICE =====
            [
                'action' => 'read',
                'code' => 'invoice.read',
                'name' => 'Quản lý hóa đơn',
            ],
            [
                'action' => 'create',
                'code' => 'invoice.create',
                'name' => 'Quản lý hóa đơn',
            ],
            [
                'action' => 'update',
                'code' => 'invoice.update',
                'name' => 'Quản lý hóa đơn',
            ],
            [
                'action' => 'delete',
                'code' => 'invoice.delete',
                'name' => 'Quản lý hóa đơn',
            ],
            // ===== SCHEDULE =====
            [
                'action' => 'read',
                'code' => 'schedule.read',
                'name' => 'Lịch làm việc',
            ],
            [
                'action' => 'create',
                'code' => 'schedule.create',
                'name' => 'Lịch làm việc',
            ],
            [
                'action' => 'delete',
                'code' => 'schedule.delete',
                'name' => 'Lịch làm việc',
            ],
        ];

        DB::table('permissions')->insert($permissions);
    }
}
