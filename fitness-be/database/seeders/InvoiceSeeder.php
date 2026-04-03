<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\Member;
use App\Models\TrainingPackage;
use Carbon\Carbon;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $members = Member::where('is_deleted', false)->get();
        $packages = TrainingPackage::where('is_deleted', false)->get();

        Invoice::insert([
            [
                'member_id' => $members[1]->id,
                'package_id' => $packages[10]->id,
                'total_price' => $packages[10]->price,
                'payment_method' => 'cash',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(365),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6),
            ],
            [
                'member_id' => $members[2]->id,
                'package_id' => $packages[1]->id,
                'total_price' => $packages[1]->price,
                'payment_method' => 'vnpay',
                'status' => 'pending',
                'valid_until' => Carbon::now()->addDays(90),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
            [
                'member_id' => $members[3]->id,
                'package_id' => $packages[4]->id,
                'total_price' => $packages[4]->price,
                'payment_method' => 'cash',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(30),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(9),
                'updated_at' => Carbon::now()->subDays(9),
            ],
            [
                'member_id' => $members[4]->id,
                'package_id' => $packages[8]->id,
                'total_price' => $packages[8]->price,
                'payment_method' => 'momo',
                'status' => 'reject',
                'valid_until' => null,
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],
            [
                'member_id' => $members[5]->id,
                'package_id' => $packages[2]->id,
                'total_price' => $packages[2]->price,
                'payment_method' => 'vnpay',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(180),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(7),
                'updated_at' => Carbon::now()->subDays(7),
            ],
            [
                'member_id' => $members[6]->id,
                'package_id' => $packages[10]->id,
                'total_price' => $packages[10]->price,
                'payment_method' => 'cash',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(365),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(6),
                'updated_at' => Carbon::now()->subDays(6),
            ],
            [
                'member_id' => $members[7]->id,
                'package_id' => $packages[12]->id,
                'total_price' => $packages[12]->price,
                'payment_method' => 'momo',
                'status' => 'pending',
                'valid_until' => null,
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],
            [
                'member_id' => $members[8]->id,
                'package_id' => $packages[6]->id,
                'total_price' => $packages[6]->price,
                'payment_method' => 'vnpay',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(90),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(4),
                'updated_at' => Carbon::now()->subDays(4),
            ],
            [
                'member_id' => $members[9]->id,
                'package_id' => $packages[9]->id,
                'total_price' => $packages[9]->price,
                'payment_method' => 'cash',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(60),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(3),
                'updated_at' => Carbon::now()->subDays(3),
            ],
            [
                'member_id' => $members[31]->id,
                'package_id' => $packages[1]->id,
                'total_price' => $packages[1]->price,
                'payment_method' => 'cash',
                'status' => 'paid',
                'valid_until' => Carbon::now()->addDays(90),
                'is_deleted' => false,
                'created_at' => Carbon::now()->subDays(10),
                'updated_at' => Carbon::now()->subDays(10),
            ],
        ]);
    }
}