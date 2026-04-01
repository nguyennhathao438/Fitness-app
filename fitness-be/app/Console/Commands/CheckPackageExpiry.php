<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Models\Notification;
use Carbon\Carbon;
<<<<<<< HEAD
use App\Models\Role;
use Log;
=======

>>>>>>> origin/permissionpage
class CheckPackageExpiry extends Command
{
    protected $signature = 'package:check-expiry';
    protected $description = 'Check package expiry and send notifications';

    public function handle()
    {
<<<<<<< HEAD
        $today = now();
=======
        $today = Carbon::today();
>>>>>>> origin/permissionpage

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

        //Tước quyền khi hết hạn 
        $expiredInvoices = Invoice::where('status', 'paid')
            ->whereDate('valid_until', '<', $today)
            ->with('member.roles')
            ->get();
        foreach ($expiredInvoices as $invoice) {

            $member = $invoice->member;

            if (!$member)
                continue;

            $rolesToRemove = Role::whereIn('name', ['MemberUp', 'MemberVip'])->pluck('id');

            $member->roles()->detach($rolesToRemove);

            // reset thời hạn
            $member->update([
                'valid_until' => null
            ]);

            Log::info("Đã tước quyền do hết hạn", [
                'member_id' => $member->id
            ]);
        }

        $this->info('Package expiry checked + roles updated');

    }
}