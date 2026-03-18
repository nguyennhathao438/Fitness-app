<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SurveySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy member_id là số lẻ
        $memberIds = DB::table('members')
            ->whereRaw('id % 2 = 1')
            ->pluck('id');

        // Build data insert
        $data = $memberIds->map(function ($memberId) {
            return [
                'member_id'   => $memberId,
                'target_type' => 'other',
                'created_at'  => now(),
                'updated_at'  => now(),
            ];
        })->toArray();

        DB::table('surveys')->insert($data);
    }
}
