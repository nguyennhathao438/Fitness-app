<?php

namespace App\Http\Services;

use App\Models\Member;
use App\Models\PersonalTrainerClient;
use Carbon\Carbon;
use Cloudinary\Cloudinary;

class MemberService
{
    // thống kê giới tính(Member)
    public function getMemberStats()
    {
        $baseQuery = Member::whereHas('roles', function ($q) {
            $q->where('name', 'Member');
        })->where('is_deleted', false);

        $male = (clone $baseQuery)->where('gender', 'male')->count();
        $female = (clone $baseQuery)->where('gender', 'female')->count();
        $total = $male + $female;

        return [
            'total' => $total,
            'gender' => [
                'male' => $male,
                'female' => $female
            ]
        ];
    }
    // Thống kê loại hội viên (Member)
    public function getMemberHavePTStats()
    {
        $baseQuery = Member::whereHas('roles', function ($q) {
            $q->where('name', 'Member');
        })->where('is_deleted', false);

        $havePT = (clone $baseQuery)
            ->whereHas('activept') 
            ->count();

        // Member không có PT
        $noPT = (clone $baseQuery)
            ->whereDoesntHave('activept')
            ->count();

        $total = $havePT + $noPT;

        return [
            'total' => $total,
            'withPT' => [
                'havePT' => $havePT,
                'noPT' => $noPT,
            ]
        ];
    }
    //thống kê biểu đồ tròn theo độ tuổi(Member)
    public function getAgeStats()
    {
        $stats = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->whereNotNull('birthday')
            ->selectRaw("
                SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) < 18) AS under_18,
                SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN 18 AND 24) AS from_18_24,
                SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) BETWEEN 25 AND 34) AS from_25_34,
                SUM(TIMESTAMPDIFF(YEAR, birthday, CURDATE()) >= 35) AS over_35
            ")
            ->first();

        return [
            [
                'label' => '< 18',
                'value' => (int) $stats->under_18
            ],
            [
                'label' => '18 - 24',
                'value' => (int) $stats->from_18_24
            ],
            [
                'label' => '25 - 34',
                'value' => (int) $stats->from_25_34
            ],
            [
                'label' => '≥ 35',
                'value' => (int) $stats->over_35
            ]
        ];
    }
    // xóa người dùng
    public function deleteMember($memberId)
    {
        $member = Member::with('latestInvoice')->find($memberId);

        if (!$member) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'User không tồn tại'
            ];
        }
        $hasActivePT = PersonalTrainerClient::where('member_id', $memberId)
            ->where('status', 'active')
            ->exists();

        if ($hasActivePT) {
            return [
                'success' => false,
                'status' => 400,
                'message' => 'Không thể xóa member đang có PT hướng dẫn'
            ];
        }
        $latestInvoice = $member->latestInvoice;
        if($latestInvoice && $latestInvoice->valid_until > now()) {
            return [
                'success' => false,
                'status' => 400,
                'message' => 'Hội viên đang còn hạn gói tập'
            ];
        }
        $member->update([
            'is_deleted' => true
        ]);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Xóa user thành công'
        ];
    }
    // Xóa PT
    public function deletePT($ptId)
    {
        $pt = Member::find($ptId);

        if (!$pt) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'PT không tồn tại'
            ];
        }

        $hasActiveClients = PersonalTrainerClient::where('pt_id', $ptId)
            ->where('status', 'active')
            ->exists();

        if ($hasActiveClients) {
            return [
                'success' => false,
                'status' => 400,
                'message' => 'Không thể xóa PT đang hướng dẫn member'
            ];
        }

        $pt->update([
            'is_deleted' => true
        ]);

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Xóa PT thành công'
        ];
    }
    //sửa thông tin người dùng
    public function updateUser($request, $memberId)
    {
        $member = Member::where('id', $memberId)
            ->where('is_deleted', false)
            ->first();

        if (!$member) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'User không tồn tại'
            ];
        }

        try {
            $data = [
                'name' => $request->name,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
            ];

            // upload avatar
            if ($request->avatar) {
            $data['avatar'] = $request->avatar;
            }
            $member->update($data);

            // sync role
            $roles = $request->input('roles', []);
            $member->roles()->sync($roles);

            $member->load('roles:id,name');

            return [
                'success' => true,
                'status' => 200,
                'message' => 'Cập nhật user thành công',
                'data' => $member
            ];

        } catch (\Throwable $e) {
            return [
                'success' => false,
                'status' => 500,
                'message' => 'Cập nhật thất bại',
                'error' => $e->getMessage()
            ];
        }
    }
    // thống kê hv dùng tháng này(Dashboard)
    public function getUserThisMonth()
    {
        $now = Carbon::now();
        $lastMonth = Carbon::now()->subMonth();

        $baseQuery = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            });

        $memberThisMonth = (clone $baseQuery)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        $memberLastMonth = (clone $baseQuery)
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        // tính % tăng trưởng
        if ($memberLastMonth > 0) {
            $percentChange = (($memberThisMonth - $memberLastMonth) / $memberLastMonth) * 100;
        } else {
            $percentChange = $memberThisMonth > 0 ? 100 : 0;
        }

        return [
            'this_month' => $memberThisMonth,
            'last_month' => $memberLastMonth,
            'percent_change' => round($percentChange, 2),
        ];
    }
    // Thống kê người dùng(Dashboard)
    public function getMemberChart($type = 'yearly', $year = null, $month = null)
    {
        $year = $year ?? now()->year;
        $month = $month ?? now()->month;

        $labels = [];
        $memberData = [];
        $ptData = [];
        $allData = [];

        $baseQuery = Member::where('is_deleted', false);

        // helper function để đỡ lặp code
        $countData = function ($start, $end, $role = null) use ($baseQuery) {
            $query = (clone $baseQuery)->whereBetween('created_at', [$start, $end]);

            if ($role) {
                $query->whereHas('roles', fn($q) => $q->where('name', $role));
            }

            return $query->count();
        };

        // MONTHLY
        if ($type === 'monthly') {
            $daysInMonth = Carbon::create($year, $month)->daysInMonth;

            for ($day = 1; $day <= $daysInMonth; $day++) {
                $start = Carbon::create($year, $month, $day)->startOfDay();
                $end = Carbon::create($year, $month, $day)->endOfDay();

                $labels[] = (string) $day;
                $memberData[] = $countData($start, $end, 'Member');
                $ptData[] = $countData($start, $end, 'PT');
                $allData[] = $countData($start, $end);
            }
        }

        // QUARTERLY
        elseif ($type === 'quarterly') {
            $quarters = [
                ['Q1', 1, 3],
                ['Q2', 4, 6],
                ['Q3', 7, 9],
                ['Q4', 10, 12],
            ];

            foreach ($quarters as [$label, $startMonth, $endMonth]) {
                $start = Carbon::create($year, $startMonth, 1)->startOfMonth();
                $end = Carbon::create($year, $endMonth, 1)->endOfMonth();

                $labels[] = $label;
                $memberData[] = $countData($start, $end, 'Member');
                $ptData[] = $countData($start, $end, 'PT');
                $allData[] = $countData($start, $end);
            }
        }

        // YEARLY
        else {
            for ($m = 1; $m <= 12; $m++) {
                $start = Carbon::create($year, $m, 1)->startOfMonth();
                $end = Carbon::create($year, $m, 1)->endOfMonth();

                $labels[] = 'T' . $m;
                $memberData[] = $countData($start, $end, 'Member');
                $ptData[] = $countData($start, $end, 'PT');
                $allData[] = $countData($start, $end);
            }
        }

        return [
            'labels' => $labels,
            'data' => [
                'member' => $memberData,
                'pt' => $ptData,
                'all' => $allData,
            ]
        ];
    }
    // lấy danh sách Members
    public function getMembers($request)
    {
        $query = Member::query()
            ->where('is_deleted', false)
            ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
            ->with([
                'latestInvoice:id,member_id,package_id,valid_until,created_at',
                'latestInvoice.package:id,package_type_id',
                'latestInvoice.package.packageType:id',
                'latestInvoice.package.packageType.services:id,name',
                'roles:id,name',
                'activept:id,member_id,pt_id,status,start_date,end_date',
                'activept.pt:id,name,avatar',
            ]);

        // SEARCH
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                ->orWhere('phone', 'like', "%$keyword%");
            });
        }

        // FILTER GENDER
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // FILTER PT
        if ($request->filled('has_pt')) {
            if ($request->has_pt == 1) {
                $query->whereHas('activept');
            } elseif ($request->has_pt == 0) {
                $query->whereDoesntHave('activept')
                    ->whereHas('latestInvoice', function ($q) {
                        $q->whereDate('valid_until', '>=', Carbon::today())
                        ->whereHas('package.packageType.services', function ($q2) {
                            $q2->where('services.id', 2);
                        });
                    });
            }
        }

        // SORT
        $sort = $request->get('sort', 'desc');
        $query->orderBy('created_at', $sort);

        // PAGINATION
        $members = $query->paginate(6);

        // TRANSFORM
        $members->getCollection()->transform(function ($member) {
            $today = Carbon::today();
            $canAddPT = false;

            if (
                !$member->activept &&
                $member->latestInvoice &&
                Carbon::parse($member->latestInvoice->valid_until)->gte($today)
            ) {
                $services = optional(
                    optional(
                        optional($member->latestInvoice->package)->packageType
                    )->services
                );

                if ($services && $services->contains('id', 2)) {
                    $canAddPT = true;
                }
            }

            // format invoice
            if ($member->latestInvoice) {
                $validUntil = Carbon::parse($member->latestInvoice->valid_until);

                $member->invoice = [
                    'start_date' => $member->latestInvoice->created_at->toDateString(),
                    'valid_until' => $validUntil->toDateString(),
                    'days_left' => max(0, $today->diffInDays($validUntil, false)),
                ];
            } else {
                $member->invoice = null;
            }

            $member->can_add_pt = $canAddPT;

            unset($member->latestInvoice);

            return $member;
        });

        return $members;
    }
    // thống kê header(User)
    public function getStatUser()
    {
        $baseQuery = Member::query();

        $full = (clone $baseQuery)
            ->where('is_deleted', false)
            ->count();

        $fullMember = (clone $baseQuery)
            ->where('is_deleted', false)
            ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
            ->count();

        $fullPT = (clone $baseQuery)
            ->where('is_deleted', false)
            ->whereHas('roles', fn($q) => $q->where('name', 'PT'))
            ->count();

        $fullDeleted = (clone $baseQuery)
            ->where('is_deleted', true)
            ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
            ->count();

        return [
            'full' => $full,
            'fullMember' => $fullMember,
            'fullPT' => $fullPT,
            'fullDeleted' => $fullDeleted,
        ];
    }
}
?>