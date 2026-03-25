<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;

class TypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public $senderId;
    public $receiverId;
    public $isTyping;

    /**
     * Create a new event instance.
     *
     * @param int $senderId
     * @param int $receiverId
     * @param bool $isTyping
     */
    public function __construct($senderId, $receiverId, $isTyping)
    {
        $this->senderId = $senderId;
        $this->receiverId = $receiverId;
        $this->isTyping = $isTyping; // true = đang gõ, false = ngừng gõ
    }

    /**
     * The channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        // Chỉ gửi tới người nhận
        return new PrivateChannel('chat.' . $this->receiverId);
    }

    /**
     * Tên event khi FE lắng nghe
     */
    public function broadcastAs()
    {
        return 'TypingEvent';
    }
}