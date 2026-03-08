<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Events\MessageSent;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    // Gửi tin nhắn
    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:members,id',
            'content' => 'required|string'
        ]);

        // Lưu vào database
        $message = Message::create([
            'sender_id'   => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'content'     => $request->content,
        ]);

        // Broadcast cho người nhận
        broadcast(new MessageSent($message))->toOthers();

        // Trả về cho sender
        return response()->json([
            'status' => 'success',
            'message' => $message->load([
                'sender:id,name',
            ])
        ]);
    }

    // Lấy lịch sử chat giữa 2 người
    public function getMessages(Request $request, $userId)
    {
        $currentUser = $request->user()->id;
        $keyword = $request->query('keyword'); 

        $messages = Message::where(function ($q) use ($currentUser, $userId) {
                $q->where('sender_id', $currentUser)
                ->where('receiver_id', $userId);
            })
            ->orWhere(function ($q) use ($currentUser, $userId) {
                $q->where('sender_id', $userId)
                ->where('receiver_id', $currentUser);
            })
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->reverse();

        return response()->json($messages->values());
    }
    // lấy danh sách pt chat với admin
    public function getChatPartners(Request $request)
    {
        $adminId = $request->user()->id;
        $keyword = $request->keyword;

        // tìm id PT của mỗi message
        $messages = DB::table('message')
    ->selectRaw("
        CASE 
            WHEN sender_id = $adminId THEN receiver_id
            ELSE sender_id
        END as pt_id,
        content,
        created_at
    ")
    ->where(function ($q) use ($adminId) {
        $q->where('sender_id', $adminId)
          ->orWhere('receiver_id', $adminId);
    });

    $latestMessages = DB::table(DB::raw("({$messages->toSql()}) as m"))
    ->mergeBindings($messages)
    ->select('pt_id', DB::raw('MAX(created_at) as last_time'))
    ->groupBy('pt_id');

    $query = Member::where('members.is_deleted', false)
    ->whereHas('roles', function ($q) {
        $q->where('name', 'PT');
    })
    ->leftJoinSub($latestMessages, 'lm', function ($join) {
        $join->on('members.id', '=', 'lm.pt_id');
    })
    ->leftJoin('message', function ($join) use ($adminId) {
    $join->on('message.created_at', '=', 'lm.last_time')
        ->where(function ($q) use ($adminId) {
            $q->where('message.sender_id', $adminId)
              ->orWhere('message.receiver_id', $adminId);
        });
})
    ->select(
        'members.id',
        'members.name',
        'members.avatar',
        'message.content as last_message',
        'lm.last_time'
    );

        if ($keyword) {
            $query->where('members.name', 'like', "%$keyword%");
        }

        $pts = $query
            ->orderByDesc('lm.last_time')
            ->get();

        return response()->json($pts);
    }
    // lấy admin và danh sách hội viên của pt đó
    public function getPTClients(Request $request)
    {
    $ptId = $request->user()->id;
    $keyword = $request->keyword;

    // lấy danh sách member thuộc PT
    $memberIds = DB::table('pt_clients')
        ->where('pt_id', $ptId)
        ->where('status', 'active')
        ->pluck('member_id');

    // lấy admin
    $adminIds = DB::table('member_role')
        ->join('roles', 'roles.id', '=', 'member_role.role_id')
        ->where('roles.name', 'Admin')
        ->pluck('member_role.member_id');

    $userIds = $memberIds
    ->merge($adminIds)
    ->unique()
    ->values();

    // query message
    $messages = DB::table('message')
        ->selectRaw("
            CASE 
                WHEN sender_id = $ptId THEN receiver_id
                ELSE sender_id
            END as user_id,
            content,
            created_at
        ")
        ->where(function ($q) use ($ptId) {
            $q->where('sender_id', $ptId)
              ->orWhere('receiver_id', $ptId);
        });

    $latestMessages = DB::table(DB::raw("({$messages->toSql()}) as m"))
        ->mergeBindings($messages)
        ->select('user_id', DB::raw('MAX(created_at) as last_time'))
        ->groupBy('user_id');

    $query = Member::whereIn('members.id', $userIds)
        ->where('members.is_deleted', false)
        ->leftJoinSub($latestMessages, 'lm', function ($join) {
            $join->on('members.id', '=', 'lm.user_id');
        })
        ->leftJoin('message', function ($join) use ($ptId) {
            $join->on('message.created_at', '=', 'lm.last_time')
                ->where(function ($q) use ($ptId) {
                    $q->where('message.sender_id', $ptId)
                      ->orWhere('message.receiver_id', $ptId);
                });
        })
        ->select(
            'members.id',
            'members.name',
            'members.avatar',
            'message.content as last_message',
            'lm.last_time'
        );

    if ($keyword) {
        $query->where('members.name', 'like', "%$keyword%");
    }

    $users = $query
        ->orderByDesc('lm.last_time')
        ->get();

    return response()->json($users);
    }
    // lấy chat pt của hội viên đó
    public function getChatWithPT(Request $request)
    {
        $memberId = $request->user()->id;

        // lấy PT mà member đang thuê
        $ptIds = DB::table('pt_clients')
            ->where('member_id', $memberId)
            ->where('status', 'active')
            ->pluck('pt_id');

        $pts = Member::whereIn('members.id', $ptIds)
            ->where('members.is_deleted', false)
            ->select(
                'members.id',
                'members.name',
                'members.avatar'
            )
            ->get();

        return response()->json($pts);
    }
}