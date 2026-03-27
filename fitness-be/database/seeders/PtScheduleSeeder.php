<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PtScheduleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pt_schedules')->insert([
            [
                'pt_id' => 1,
                'member_id' => 5,
                'date' => '2026-03-19',
                'start_time' => '06:00:00',
                'end_time' => '07:00:00',
                'reminder_sent' => 0
            ],
            [
                'pt_id' => 1,
                'member_id' => null,
                'date' => '2026-03-21',
                'start_time' => '06:00:00',
                'end_time' => '07:00:00',
                'reminder_sent' => 0
            ]
        ]);
    }
}