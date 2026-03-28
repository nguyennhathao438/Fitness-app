<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\PersonalTrainerClient;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PTClientController extends Controller
{
    // Add Pt to member
    public function createPTClient(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'pt_id'     => 'required|exists:members,id',
        ]);

        return DB::transaction(function () use ($request) {

            $member = Member::with('latestInvoice')->findOrFail($request->member_id);

            // Kiểm tra invoice
            $invoice = $member->latestInvoice;

            if (!$invoice) {
                return response()->json([
                    'message' => 'Member chưa có gói tập hợp lệ'
                ], 422);
            }

            if ($invoice->valid_until->lt(now())) {
                return response()->json([
                    'message' => 'Gói tập đã hết hạn'
                ], 422);
            }
            // Gán PT mới
            $ptClient = PersonalTrainerClient::create([
                'pt_id'      => $request->pt_id,
                'member_id'  => $member->id,
                'start_date' => now(),
                'end_date'   => $invoice->valid_until,
                'status'     => 'active',
            ]);
            $vipRole = Role::where('name', 'Member_vip')->first();

            if ($vipRole) {
                $member->roles()->syncWithoutDetaching([$vipRole->id]);
            }
            return response()->json([
                'success' => true,
                'message' => 'Gán PT thành công',
                'data' => $ptClient
            ]);
        });
    }
    // Get All PT max 10 members
    public function getPT()
    {
        $pts = Member::query()
            ->select('id', 'name', 'avatar')
            ->where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'PT');
            })
            ->withCount([
                'ptClientsAsPT as active_clients_count' => function ($q) {
                    $q->where('status', 'active');
                }
            ])
            ->having('active_clients_count', '<', 10)
            ->orderBy('active_clients_count')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $pts
        ]);
    }
    // Hủy PT
    public function cancelPT(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'pt_id'     => 'required|exists:members,id',
        ]);

        return DB::transaction(function () use ($request) {

            $ptClient = PersonalTrainerClient::where('member_id', $request->member_id)
                ->where('pt_id', $request->pt_id)
                ->where('status', 'active')
                ->first();

            if (!$ptClient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy PT đang hoạt động'
                ], 404);
            }

            $ptClient->update([
                'status'   => 'cancel',
                'end_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Hủy PT thành công'
            ]);
        });
    }
    // ChangePT
    public function ChangePT(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'pt_id'     => 'required|exists:members,id',
        ]);

        return DB::transaction(function () use ($request) {

            $ptClient = PersonalTrainerClient::where('member_id', $request->member_id)
                ->where('pt_id', $request->pt_id)
                ->where('status', 'active')
                ->first();

            if (!$ptClient) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy PT đang hoạt động'
                ], 404);
            }

            $ptClient->update([
                'status'   => 'expired',
                'end_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Lưu lịch sử PT thành công'
            ]);
        });
    }
    // get all Member for that pt
    public function getAllforPT($ptID)
    {
        if (!Member::where('id', $ptID)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'PT không tồn tại'
            ], 404);
        }

        $pt = Member::findOrFail($ptID);

        $members = $pt->ptClientsAsPT()
            ->where('status', 'active')
            ->with([
                'member:id,name,avatar,birthday'
            ])
            ->get()
            ->pluck('member')
            ->filter();

        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }
    // Top 5 Personal Trainers with the Most Training Sessions
    public function getTopPT()
    {
        $topPTs = PersonalTrainerClient::query()
            ->select(
                'pt_id',
                DB::raw('COUNT(*) as total_sessions')
            )
            ->where('status', 'expired')
            ->groupBy('pt_id')
            ->orderByDesc('total_sessions')
            ->limit(5)
            ->with([
                'pt:id,name,avatar,birthday'
            ])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $topPTs
        ]);
    }

    public function statsMembers($ptId)
    {
        // Kiểm tra PT tồn tại
        if (!\App\Models\Member::where('id', $ptId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'PT không tồn tại'
            ], 404);
        }

        // Tổng học viên
        $total = \App\Models\PersonalTrainerClient::where('pt_id', $ptId)->count();

        // Đang còn hạn (active + chưa hết ngày)
        $active = \App\Models\PersonalTrainerClient::where('pt_id', $ptId)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->count();

        // Hết hạn (expired hoặc quá hạn)
        $expired = \App\Models\PersonalTrainerClient::where('pt_id', $ptId)
            ->where(function ($q) {
                $q->where('status', 'expired')
                    ->orWhere('end_date', '<', now());
            })
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total'   => $total,
                'active'  => $active,
                'expired' => $expired,
            ]
        ]);
    }
}
