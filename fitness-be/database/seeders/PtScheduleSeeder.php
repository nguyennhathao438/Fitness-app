<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\CarbonPeriod;

class PtScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
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
        ];

        $timeSlots = [
            '06:00:00',
            '07:00:00',
            '08:00:00',
            '09:00:00',
            '10:00:00',
            '11:00:00',
            '12:00:00',
            '13:00:00',
            '14:00:00',
            '15:00:00',
        ];

        $dates = CarbonPeriod::create('2026-04-01', '2026-04-10');

        foreach ($dates as $date) {

            // shuffle để random
            $slots = $timeSlots;
            shuffle($slots);

            // member 2
            $start1 = $slots[0];
            $end1 = date('H:i:s', strtotime($start1 . ' +1 hour'));

            // member 7 (khác giờ)
            $start2 = $slots[1];
            $end2 = date('H:i:s', strtotime($start2 . ' +1 hour'));

            // push member 2
            $rows[] = [
                'pt_id' => 31,
                'member_id' => 2,
                'date' => $date->format('Y-m-d'),
                'start_time' => $start1,
                'end_time' => $end1,
                'reminder_sent' => 0
            ];

            // push member 7
            $rows[] = [
                'pt_id' => 31,
                'member_id' => 7,
                'date' => $date->format('Y-m-d'),
                'start_time' => $start2,
                'end_time' => $end2,
                'reminder_sent' => 0
            ];
        }

        DB::table('pt_schedules')->insert($rows);
    }
}