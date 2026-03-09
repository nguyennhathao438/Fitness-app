<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PtMemberSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('pt_member')->insert([
            [
                'pt_id' => 1,
                'member_id' => 5
            ],
            [
                'pt_id' => 3,
                'member_id' => 2
            ],
            [
                'pt_id' => 4,
                'member_id' => 9
            ]
        ]);
    }
}