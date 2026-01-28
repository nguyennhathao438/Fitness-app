<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PTClient;
use Illuminate\Support\Facades\Auth;

class PTController extends Controller
{
    public function members(Request $request)
{
    $ptId = $request->user()->id;

    $members = PTClient::with('member')
        ->where('pt_id', $ptId)
        ->where('status', 'active')
        ->get()
        ->map(function ($item) {
            return [
                'member_id' => $item->member->id,
                'name' => $item->member->name,
                'phone' => $item->member->phone,
                'avatar' => $item->member->avatar,
                'status' => $item->status,
                'start_date' => $item->start_date,
                'end_date' => $item->end_date,
                'target_type' => null,
                'last_training' => null,
            ];
        });

    return response()->json([
        'success' => true,
        'data' => $members,
    ]);
}

}
