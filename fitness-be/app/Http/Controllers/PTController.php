<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class PTController extends Controller
{
    public function myMembers()
    {
        $pt = Auth::user();

        $members = $pt->managedMembers()
            ->where('is_deleted', false)
            ->get();

        return response()->json($members);
    }
}