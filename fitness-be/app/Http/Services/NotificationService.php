<?php

namespace App\Http\Services;

use App\Models\Member;
use App\Models\Notification;
use App\Events\NewOrderNotification;
use App\Models\PersonalTrainerClient;

class NotificationService
{
    private function sendToAdmins($type, $title, $message, $invoice)
    {
        $admins = Member::whereHas('roles', function ($q) {
            $q->where('name', 'Admin');
        })->get();

        foreach ($admins as $admin) {

            $notification = Notification::create([
                'user_id' => $admin->id,
                'sender_id' => $invoice->member_id,
                'type' => $type,
                'title' => $title,
                'message' => $message,
                'data' => [
                    'order_id' => $invoice->id,
                    'member_id' => $invoice->member_id
                ],
                'is_read' => false,
                'is_deleted' => false
            ]);

            event(new NewOrderNotification($notification));
        }
    }
    public function sendOrderNotification($invoice)
    {
        $this->sendToAdmins(
            'order',
            'Đơn hàng mới',
            'Hội viên ' . $invoice->member->name . ' có đơn hàng cần được duyệt',
            $invoice
        );
    }
    public function hasPTService($package)
    {
        if (!$package || !$package->packageType) return false;

        return $package
            ->packageType
            ->services
            ->pluck('id')
            ->contains(2);
    }
    public function memberHasPT($memberId)
    {
        return PersonalTrainerClient::where('member_id', $memberId)
            ->where('status', 'active')
            ->exists();
    }
    public function sendAssignPTNotification($invoice)
    {
        $this->sendToAdmins(
            'pt_assign',
            'Có hội viên cần phân PT',
            'Hội viên ' . $invoice->member->name . ' cần được phân PT',
            $invoice
        );
    }
}