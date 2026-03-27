<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notifications')->insert([
            [
                'user_id' => 1,
                'sender_id' => 5,
                'type' => 'schedule_registered',
                'title' => 'Học viên đăng ký lịch',
                'message' => 'Phạm Thị D đã đăng ký lịch tập',
                'is_read' => 0
            ],
            [
                'user_id' => 5,
                'sender_id' => 1,
                'type' => 'schedule_created',
                'title' => 'PT tạo lịch mới',
                'message' => 'PT đã tạo lịch tập mới',
                'is_read' => 0
            ]
        ]);
    }
}