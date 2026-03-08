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
        $members  = Member::all();
        $packages = TrainingPackage::all();

        Invoice::insert([
            // ===== PAID - MOMO =====
            $this->invoice(
                $members[0]->id,
                $packages[0],
                'momo',
                'paid',
                12
            ),

            // ===== PAID - VNPAY =====
            $this->invoice(
                $members[2]->id,
                $packages[11],
                'vnpay',
                'paid',
                11
            ),

            // ===== PAID - CASH =====
            $this->invoice(
                $members[4]->id,
                $packages[4],
                'cash',
                'paid',
                9
            ),

            // ===== REJECT - MOMO =====
            [
                'member_id' => $members[6]->id,
                'package_id' => $packages[8]->id,
                'payment_method' => 'momo',
                'status' => 'reject',
                'valid_until' => null,
                'created_at' => Carbon::now()->subDays(8),
                'updated_at' => Carbon::now()->subDays(8),
            ],

            // ===== PAID - VNPAY =====
            $this->invoice(
                $members[8]->id,
                $packages[2],
                'vnpay',
                'paid',
                7
            ),

            // ===== PAID - CASH =====
            $this->invoice(
                $members[10]->id,
                $packages[10],
                'cash',
                'paid',
                6
            ),

            // ===== PENDING - CASH (chỉ cash mới pending) =====
            [
                'member_id' => $members[12]->id,
                'package_id' => $packages[12]->id,
                'payment_method' => 'cash',
                'status' => 'pending',
                'valid_until' => Carbon::now()
                    ->subDays(5)
                    ->addDays($packages[12]->duration_days),
                'created_at' => Carbon::now()->subDays(5),
                'updated_at' => Carbon::now()->subDays(5),
            ],

            // ===== PAID - VNPAY =====
            $this->invoice(
                $members[14]->id,
                $packages[6],
                'vnpay',
                'paid',
                4
            ),
            $this->invoice(
                $members[16]->id,
                $packages[9],
                'vnpay',
                'paid',
                45
            ),
            $this->invoice(
                $members[17]->id,
                $packages[9],
                'vnpay',
                'paid',
                1
            ),
            $this->invoice(
                $members[18]->id,
                $packages[10],
                'vnpay',
                'paid',
                79
            ),
            $this->invoice(
                $members[19]->id,
                $packages[11],
                'vnpay',
                'paid',
                31
            ),
            $this->invoice(
                $members[20]->id,
                $packages[9],
                'vnpay',
                'paid',
                22
            ),
            $this->invoice(
                $members[21]->id,
                $packages[10],
                'vnpay',
                'paid',
                11
            ),
            $this->invoice(
                $members[22]->id,
                $packages[9],
                'vnpay',
                'paid',
                5
            ),
            $this->invoice(
                $members[23]->id,
                $packages[9],
                'vnpay',
                'paid',
                3
            ),
            $this->invoice(
                $members[24]->id,
                $packages[9],
                'vnpay',
                'paid',
                27
            ),
            $this->invoice(
                $members[25]->id,
                $packages[10],
                'vnpay',
                'paid',
                37
            ),
            $this->invoice(
                $members[26]->id,
                $packages[9],
                'vnpay',
                'paid',
                18
            ),
            $this->invoice(
                $members[27]->id,
                $packages[9],
                'vnpay',
                'paid',
                3
            ),
            $this->invoice(
                $members[28]->id,
                $packages[9],
                'vnpay',
                'paid',
                1
            ),
            $this->invoice(
                $members[29]->id,
                $packages[9],
                'vnpay',
                'paid',
                15
            ),
            // ==== HÓA ĐƠN CŨ (6–8 tháng trước) ===
            $this->oldInvoice($members[0]->id,  $packages[0], 8, 20),
            $this->oldInvoice($members[2]->id,  $packages[1], 7, 15),
            $this->oldInvoice($members[4]->id,  $packages[4], 6, 10),
            $this->oldInvoice($members[6]->id,  $packages[6], 8, 5),
            $this->oldInvoice($members[8]->id,  $packages[9], 7, 2),
            $this->oldInvoice($members[8]->id,  $packages[10], 21, 2),
            $this->oldInvoice($members[21]->id,  $packages[5], 10, 2),
            $this->oldInvoice($members[12]->id,  $packages[9], 11, 6),
            $this->oldInvoice($members[16]->id,  $packages[5], 12, 7),
            $this->oldInvoice($members[17]->id,  $packages[9], 12, 3),
            $this->oldInvoice($members[23]->id,  $packages[4], 12, 3),
            $this->oldInvoice($members[24]->id,  $packages[5], 3, 9),
            $this->oldInvoice($members[25]->id,  $packages[9], 12, 2),
        ]);
    }

    /**
     * Helper tạo invoice PAID
     */
    private function invoice(
        int $memberId,
        TrainingPackage $package,
        string $method,
        string $status,
        int $daysAgo
    ): array {
        $updatedAt = Carbon::now()->subDays($daysAgo);

        return [
            'member_id'     => $memberId,
            'package_id'    => $package->id,
            'payment_method'=> $method,
            'status'        => $status,
            'valid_until'   => $updatedAt->copy()->addDays($package->duration_days),
            'created_at'    => $updatedAt,
            'updated_at'    => $updatedAt,
        ];
    }
    /**
 * Helper tạo hóa đơn CŨ (paid - momo)
 * Lệch 6–8 tháng trước để thống kê
 */
    private function oldInvoice(
        int $memberId,
        TrainingPackage $package,
        int $monthsAgo,
        int $daysAgo
    ): array {
        $time = Carbon::now()
            ->subMonths($monthsAgo)
            ->subDays($daysAgo);

        return [
            'member_id'      => $memberId,
            'package_id'     => $package->id,
            'payment_method' => 'momo',
            'status'         => 'paid',
            'valid_until'    => $time->copy()->addDays($package->duration_days),
            'created_at'     => $time,
            'updated_at'     => $time,
        ];
    }

}
