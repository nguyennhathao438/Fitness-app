<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender');
    }

    // Xác định kênh phát sóng. Broadcast tới cả sender và receiver
    public function broadcastOn()
{
    return [
        new PrivateChannel('chat.' . $this->message->sender_id),
        new PrivateChannel('chat.' . $this->message->receiver_id),
    ];
}

    //  Tên event khi FE nhận được
    public function broadcastAs()
    {
        return 'MessageSent';
    }
}