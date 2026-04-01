<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;
class NotificationController extends Controller
{
    public function index()
    {
        return Notification::where('user_id', auth()->id())
            ->latest()
            ->take(20)
            ->get();
    }
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);

        // kiểm tra quyền
        if ($notification->user_id != auth()->id()) {
            return response()->json([
                'message' => 'Không có quyền'
            ], 403);
        }

        $notification->update([
            'is_read' => true
        ]);

        return response()->json([
            'message' => 'Đã đọc'
        ]);
    }
    public function markAllRead()
    {
        Notification::where('user_id', auth()->id())
            ->where('is_read', false)
            ->update([
                'is_read' => true
            ]);

        return response()->json([
            'message' => 'Đã đọc tất cả'
        ]);
    }

    public function adminNotifications()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->where('is_deleted', false)
            ->whereIn('type', ['order', 'pt_assign'])
            ->latest()
            ->get();
        return response()->json([
            'notifications' => $notifications
        ]);
    }
    public function deleteNotification($id)
    {
        $notification = Notification::findOrFail($id);

        $notification->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Đã xóa'
        ]);
    }
}
