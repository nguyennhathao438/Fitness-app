<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('members')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000000',
                'gender' => 'other',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nguyễn Văn A',
                'email' => 'a@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000001',
                'gender' => 'male',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Trần Thị B',
                'email' => 'b@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000002',
                'gender' => 'female',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lê Văn C',
                'email' => 'c@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000003',
                'gender' => 'male',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phạm Thị D',
                'email' => 'd@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000004',
                'gender' => 'female',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hoàng Văn E',
                'email' => 'e@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000005',
                'gender' => 'male',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Vũ Thị F',
                'email' => 'f@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000006',
                'gender' => 'female',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Đặng Văn G',
                'email' => 'g@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000007',
                'gender' => 'male',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Bùi Thị H',
                'email' => 'h@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000008',
                'gender' => 'female',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Phan Văn I',
                'email' => 'i@gym.com',
                'password' => Hash::make('123456'),
                'phone' => '0900000009',
                'gender' => 'male',
                'is_deleted' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
