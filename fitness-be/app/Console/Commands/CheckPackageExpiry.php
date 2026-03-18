<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Models\Notification;
use Carbon\Carbon;

class CheckPackageExpiry extends Command
{
    protected $signature = 'package:check-expiry';
    protected $description = 'Check package expiry and send notifications';

    public function handle()
    {
        $today = Carbon::today();

        $invoices = Invoice::where('status', 'paid')
            ->whereDate('valid_until', '>=', $today)
            ->get();

        foreach ($invoices as $invoice) {

            $daysLeft = Carbon::parse($invoice->valid_until)->diffInDays($today);

            if (in_array($daysLeft, [7, 3, 1])) {

                Notification::create([
                    'user_id' => $invoice->member_id,
                    'type' => 'package_expiring',
                    'title' => 'Gói tập sắp hết hạn',
                    'message' => "Gói tập của bạn sẽ hết hạn sau {$daysLeft} ngày"
                ]);
            }
        }

        $this->info('Package expiry checked');
    }
}