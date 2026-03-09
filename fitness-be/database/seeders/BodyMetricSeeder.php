<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BodyMetricSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('body_metrics')->insert([
            [
                'member_id' => 5,
                'weight' => 64,
                'height' => 175,
                'muscle' => 40,
                'body_fat' => 18,
                'visceral_fat' => 8,
                'body_water' => 55
            ]
        ]);
    }
}