<?php

namespace Database\Seeders;

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
            ['code' => 'PT', 'description' => 'Tạo hóa đơn'],
            ['code' => 'ADMIN', 'description' => 'Tạo hóa đơn'],
            // User
            ['code' => 'user.view', 'description' => 'Xem người dùng'],
            ['code' => 'user.create', 'description' => 'Thêm người dùng'],
            ['code' => 'user.update', 'description' => 'Sửa người dùng'],
            ['code' => 'user.delete', 'description' => 'Xóa người dùng'],

            // Member
            ['code' => 'member.view', 'description' => 'Xem hội viên'],
            ['code' => 'member.create', 'description' => 'Thêm hội viên'],
            ['code' => 'member.update', 'description' => 'Sửa hội viên'],

            // Package
            ['code' => 'package.create', 'description' => 'Thêm gói tập'],
            ['code' => 'package.update', 'description' => 'Sửa gói tập'],
            ['code' => 'package.delete', 'description' => 'Xóa gói tập'],

            // Schedule & Payment
            ['code' => 'schedule.update', 'description' => 'Cập nhật lịch tập'],
            ['code' => 'payment.create', 'description' => 'Tạo hóa đơn'],


        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['code' => $permission['code']],
                ['description' => $permission['description']]
            );
        }
    }
}
