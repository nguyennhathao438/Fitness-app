<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PTClientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pt_clients')->insert([
            [
                'pt_id'  => 4,
                'member_id'  => 24,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-05-08',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 1),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 1),
            ],
            [
                'pt_id'  => 16,
                'member_id'  => 27,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-04-23',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 7),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 7),
            ],
            [
                'pt_id'  => 16,
                'member_id'  => 25,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-04-14',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 16),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 16),
            ],
            [
                'pt_id'  => 16,
                'member_id'  => 30,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-04-26',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 21),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 21),
            ],
            [
                'pt_id'  => 16,
                'member_id'  => 3,
                'start_date' => '2026-02-10',
                'end_date'   => '2027-01-30',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 26),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 26),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 26,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-07-03',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 33),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 33),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 19,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-05-22',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 38),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 38),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 21,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-04-19',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 43),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 43),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 17,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-03-27',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 47),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 47),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 20,
                'start_date' => '2026-02-10',
                'end_date'   => '2027-01-10',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 52),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 52),
            ],
            [
                'pt_id'  => 16,
                'member_id'      => 29,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-05-10',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 23, 59),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 23, 59),
            ],
            [
                'pt_id'  => 8,
                'member_id'      => 28,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-05-08',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 3),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 3),
            ],
            [
                'pt_id'  => 12,
                'member_id'      => 11,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-08-03',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 8),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 8),
            ],
            [
                'pt_id'  => 10,
                'member_id'      => 23,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-05-06',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 13),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 13),
            ],
            [
                'pt_id'  => 8,
                'member_id'      => 22,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-07-29',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 8,
                'member_id'      => 22,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-07-29',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 8,
                'member_id'      => 22,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-07-29',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 8,
                'member_id'      => 22,
                'start_date' => '2026-02-10',
                'end_date'   => '2026-07-29',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 31,
                'member_id'      => 2,
                'start_date' => '2026-03-22',
                'end_date'   => '2027-03-22',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 31,
                'member_id'      => 7,
                'start_date' => '2026-03-28',
                'end_date'   => '2027-03-28',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
            [
                'pt_id'  => 31,
                'member_id'      => 32,
                'start_date' => '2026-03-24',
                'end_date'   => '2026-06-22',
                'status'     => 'active',
                'created_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
                'updated_at' => Carbon::create(2026, 2, 10, 11, 25, 20),
            ],
        ]);
        DB::statement("
            INSERT INTO pt_clients (pt_id, member_id, start_date, end_date, status, created_at, updated_at)
            VALUES
            (4, 1, '2025-10-01', '2025-11-01', 'expired', NOW(), NOW()),
            (4, 3, '2025-09-15', '2025-10-15', 'expired', NOW(), NOW()),
            (4, 5, '2025-08-01', '2025-09-01', 'expired', NOW(), NOW()),
            (4, 7, '2025-07-01', '2025-08-01', 'expired', NOW(), NOW()),

            (6, 1, '2025-10-05', '2025-11-05', 'expired', NOW(), NOW()),
            (6, 3, '2025-09-01', '2025-10-01', 'expired', NOW(), NOW()),
            (6, 9, '2025-08-01', '2025-09-01', 'expired', NOW(), NOW()),
            (6, 11,'2025-07-01', '2025-08-01', 'expired', NOW(), NOW()),

            (8, 5, '2025-10-10', '2025-11-10', 'expired', NOW(), NOW()),
            (8, 7, '2025-09-01', '2025-10-01', 'expired', NOW(), NOW()),
            (8, 9, '2025-08-01', '2025-09-01', 'expired', NOW(), NOW()),
            (8, 13,'2025-07-01', '2025-08-01', 'expired', NOW(), NOW()),

            (10,1, '2025-10-01', '2025-11-01', 'expired', NOW(), NOW()),
            (10,3, '2025-09-01', '2025-10-01', 'expired', NOW(), NOW()),
            (10,5, '2025-08-01', '2025-09-01', 'expired', NOW(), NOW()),
            (10,15,'2025-07-01', '2025-08-01', 'expired', NOW(), NOW()),

            (12,7, '2025-10-01', '2025-11-01', 'expired', NOW(), NOW()),
            (12,9, '2025-09-01', '2025-10-01', 'expired', NOW(), NOW()),
            (12,11,'2025-08-01', '2025-09-01', 'expired', NOW(), NOW()),
            (12,13,'2025-07-01', '2025-08-01', 'expired', NOW(), NOW())
        ");
    }
}
