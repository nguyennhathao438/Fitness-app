<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Member;
use App\Models\TrainingPackage;
use App\Models\Invoice;
use Cloudinary\Cloudinary;
use DB;
use Throwable;
use App\Models\PasswordOtp;
use App\Models\PersonalTrainerClient;
use Carbon\Carbon;
use App\Models\BodyMetric;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Models\PTSchedule;
use App\Models\Notification;
class MemberController extends Controller
{
    /*
     * /
        Đăng ký hội viên mới 
        Thông tin cá nhân , lịch sử mua gói , trả về token 
     */

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email',
            'password' => 'required|min:6',

            //Lịch sử thanh toán 
            'package_id' => 'required|exists:training_packages,id',
            'payment_method' => 'required|in:momo,vnpay,cash',
        ]);
        $member = null;
        $invoice = null;
        $package = null;
        try {
            DB::transaction(function () use ($request, &$member, &$invoice, &$package) {
                //Lấy thông tin gói 
                $package = TrainingPackage::findOrFail($request->package_id);
                $isValid = true;
                $status = "paid";
                if ($request->payment_method == 'cash') {
                    $isValid = false;
                    $status = 'pending';
                }
                //Tạo người dùng 
                $member = Member::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'is_deleted' => false,
                    'is_valid' => $isValid,
                ]);
                //Tạo lịch sử mua gói 
                $invoice = Invoice::create([
                    'member_id' => $member->id,
                    'package_id' => $package->id,
                    'payment_method' => $request->payment_method,
                    'total_price' => $package->price,
                    'valid_until' => now()->addDays($package->duration_days),
                    'status' => $status,
                ]);
            });
            $serviceIds = $package->packageType->services->pluck('id');
            $waiting = false;
            if ($request->payment_method == 'cash') {
                $waiting = true;
            }
            Notification::create([
    'user_id' => $member->id,
    'type' => 'welcome',
    'title' => 'Chào mừng đến với Gym',
    'message' => 'Bạn đã đăng ký tài khoản thành công và bắt đầu gói ' . $package->name
]);
            // Tạo token luôn sau khi đăng ký (tùy chọn)
            $token = $member->createToken('member-token')->plainTextToken;
            return response()->json([
                'waiting' => $waiting,
                'message' => 'Đăng ký thành công',
                'member' => $member,
                'valid_until' => $invoice->valid_until,
                'token' => $token,
                'service_ids' => $serviceIds,
            ], 201);
        } catch (Throwable $e) {

            return response()->json([
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        $member = $request->user(); // member đang đăng nhập

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:members,email,' . $member->id,
            'phone' => 'required|string|max:20',
            'gender' => 'nullable|string|in:male,female,other'
        ]);

        try {
            // Lấy dữ liệu hợp lệ từ request
            $data = $request->only([
                'name',
                'email',
                'phone',
                'gender',
            ]);

            // Update
            $member->update($data);

            return response()->json([
                'message' => 'Cập nhật thông tin thành công',
                'member' => $member,
            ], 200);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Cập nhật thất bại',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Thống kê progressbar giới tính
    public function memberStats()
    {
        $baseQuery = Member::whereHas('roles', function ($q) {
            $q->where('name', 'Member');
        })
            ->where('is_deleted', false);

        $male = (clone $baseQuery)->where('gender', 'male')->count();
        $female = (clone $baseQuery)->where('gender', 'female')->count();
        $total = $male + $female;

        return response()->json([
            'success' => true,
            'total' => $total,
            'gender' => [
                'male' => $male,
                'female' => $female
            ]
        ]);
    }
    // Thống kê progressbar hội viên theo pt
    public function memberHavePTStats()
    {
        $baseQuery = Member::whereHas('roles', function ($q) {
            $q->where('name', 'Member');
        })
            ->where('is_deleted', false);

        $havePT = PersonalTrainerClient::where('status', 'active')->count();
        $noPT = (clone $baseQuery)->whereDoesntHave('activept')->count();
        $total = $havePT + $noPT;

        return response()->json([
            'success' => true,
            'total' => $total,
            'withPT' => [
                'havePT' => $havePT,
                'noPT' => $noPT,
            ]
        ]);
    }
    //thống kê biểu đồ tròn theo độ tuổi
    public function AgeStats()
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

        return response()->json([
            'success' => true,
            'data' => [
                ['label' => '< 18', 'value' => (int) $stats->under_18],
                ['label' => '18 - 24', 'value' => (int) $stats->from_18_24],
                ['label' => '25 - 34', 'value' => (int) $stats->from_25_34],
                ['label' => '≥ 35', 'value' => (int) $stats->over_35],
            ]
        ]);
    }
    // xóa người dùng
    public function deletedUser($memberId)
    {
        $member = Member::find($memberId);

        if (!$member) {
            return response()->json(['message' => 'User không tồn tại'], 404);
        }
        $hasActivePT = PersonalTrainerClient::where('member_id', $memberId)
            ->where('status', 'active')
            ->exists();

        if ($hasActivePT) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa member đang có PT hướng dẫn'
            ], 400);
        }
        $member->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'message' => 'Xóa user thành công'
        ]);
    }
    public function deletePT($ptId)
    {
        $pt = Member::find($ptId);

        if (!$pt) {
            return response()->json([
                'success' => false,
                'message' => 'PT không tồn tại'
            ], 404);
        }

        // PT đang hướng dẫn member nào không?
        $hasActiveClients = PersonalTrainerClient::where('pt_id', $ptId)
            ->where('status', 'active')
            ->exists();

        if ($hasActiveClients) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa PT đang hướng dẫn member'
            ], 400);
        }

        $pt->update([
            'is_deleted' => true
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Xóa PT thành công'
        ]);
    }


    // sửa thông tin người dùng
    public function editUser(Request $request, $memberId)
    {
        Log::info("Request to edit user", ['memberId' => $memberId, 'requestData' => $request->all()]);
        $member = Member::where('id', $memberId)
            ->where('is_deleted', false)
            ->first();

        if (!$member) {
            return response()->json(['message' => 'User không tồn tại'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        try {
            $data = [
                'name' => $request->name,
                'phone' => $request->phone,
                'gender' => $request->gender,
                'birthday' => $request->birthday,
            ];

            if ($request->hasFile('avatar')) {

                $cloudinary = new Cloudinary(env('CLOUDINARY_URL'));

                $result = $cloudinary->uploadApi()->upload(
                    $request->file('avatar')->getRealPath(),
                    [
                        'folder' => 'members/avatar'
                    ]
                );

                $data['avatar'] = $result['secure_url'];
            }

            $member->update($data);
            $roles = $request->input('roles', []);
            $member->roles()->sync($roles);

            // reload role cho response
            $member->load('roles:id,name');
            return response()->json([
                'success' => true,
                'message' => 'Cập nhật user thành công',
                'member' => $member
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cập nhật thất bại',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    // lấy số lượng người hội viên dùng tháng này
    public function getUserThisMonth()
    {
        $memberThisMonth = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
        $memberLastMonth = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->count();
        if ($memberLastMonth > 0) {
            $percentChange = (($memberThisMonth - $memberLastMonth) / $memberLastMonth) * 100;
        } else {
            // tháng trước = 0
            $percentChange = $memberThisMonth > 0 ? 100 : 0;
        }
        $percentChange = round($percentChange, 2);
        return response()->json([
            'success' => true,
            'data' => [
                'this_month' => $memberThisMonth,
                'last_month' => $memberLastMonth,
                'percent_change' => $percentChange,
            ],
        ]);
    }
    // Thống kê biểu đồ cột theo vai trò và tổng người dùng
    public function getMemberChart(Request $request)
    {
        $type = $request->type ?? 'yearly';
        $year = $request->year ?? now()->year;
        $month = $request->month ?? now()->month;

        $labels = [];
        $memberData = [];
        $ptData = [];
        $allData = [];
        // month
        if ($type === 'monthly') {
            $daysInMonth = Carbon::create($year, $month)->daysInMonth;
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $start = Carbon::create($year, $month, $day)->startOfDay();
                $end = Carbon::create($year, $month, $day)->endOfDay();
                $labels[] = (string) $day;
                $memberData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
                    ->count();
                $ptData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'PT'))
                    ->count();
                $allData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();
            }
        }
        // quaterly
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
                $memberData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
                    ->count();
                $ptData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'PT'))
                    ->count();
                $allData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();
            }
        }
        // Year
        else {
            for ($m = 1; $m <= 12; $m++) {
                $start = Carbon::create($year, $m, 1)->startOfMonth();
                $end = Carbon::create($year, $m, 1)->endOfMonth();
                $labels[] = 'T' . $m;
                $memberData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'Member'))
                    ->count();
                $ptData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->whereHas('roles', fn($q) => $q->where('name', 'PT'))
                    ->count();
                $allData[] = Member::where('is_deleted', false)
                    ->whereBetween('created_at', [$start, $end])
                    ->count();
            }
        }
        return response()->json([
            'success' => true,
            'labels' => $labels,
            'data' => [
                'member' => $memberData,
                'pt' => $ptData,
                'all' => $allData,
            ],
        ]);
    }

    public function changePassword(Request $request)
    {
        $member = $request->user();

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        // Kiểm tra mật khẩu hiện tại
        if (!Hash::check($request->current_password, $member->password)) {
            return response()->json([
                'message' => 'Mật khẩu hiện tại không đúng'
            ], 400);
        }

        // Không cho trùng mật khẩu cũ
        if (Hash::check($request->new_password, $member->password)) {
            return response()->json([
                'message' => 'Mật khẩu mới không được trùng mật khẩu cũ'
            ], 400);
        }

        // Cập nhật mật khẩu
        $member->update([
            'password' => Hash::make($request->new_password),
        ]);
Notification::create([
    'user_id' => $member->id,
    'type' => 'change_password',
    'title' => 'Đổi mật khẩu',
    'message' => 'Mật khẩu tài khoản của bạn đã được thay đổi'
]);
        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ], 200);
    }
    //Nâng cấp (Upgrade) hoặc Gia hạn (Extend) gói tập

    public function upgrade(Request $request)
    {
        $member = $request->user(); // Lấy user từ token

        $request->validate([
            'package_id' => 'required|exists:training_packages,id',
            'payment_method' => 'required|in:momo,vnpay,cash',
            'is_extend' => 'boolean',
        ]);

        $invoice = null;
        $newPackage = null;

        $isExtend = $request->input('is_extend', false);

        try {
            DB::transaction(function () use ($request, $member, &$invoice, &$newPackage, $isExtend) {
                $newPackage = TrainingPackage::findOrFail($request->package_id);

                $status = 'paid';
                if ($request->payment_method == 'cash') {
                    $status = 'pending';
                }

                $startDate = Carbon::now();
                $totalPrice = $newPackage->price;

                $currentInvoice = Invoice::where('member_id', $member->id)
                    ->where('status', 'paid')
                    ->where('valid_until', '>', Carbon::now())
                    ->orderByDesc('id')
                    ->orderBy('valid_until', 'desc')
                    ->with('package')
                    ->first();

                if ($isExtend) {
                    if ($currentInvoice) {
                        $startDate = Carbon::parse($currentInvoice->valid_until);
                    }
                } else {
                    if ($currentInvoice && $currentInvoice->package) {
                        $oldPackage = $currentInvoice->package;

                        $daysRemaining = max(0, Carbon::now()->startOfDay()->diffInDays(Carbon::parse($currentInvoice->valid_until)->startOfDay(), false));

                        if ($daysRemaining > 0 && $oldPackage->duration_days > 0) {
                            $dailyRate = $oldPackage->price / $oldPackage->duration_days;

                            $remainingValue = $daysRemaining * $dailyRate;

                            $totalPrice = max(0, round($newPackage->price - $remainingValue));
                        }
                    }
                }

                // TẠO HÓA ĐƠN MỚI
                $invoice = Invoice::create([
                    'member_id' => $member->id,
                    'package_id' => $newPackage->id,
                    'payment_method' => $request->payment_method,
                    'total_price' => $totalPrice,
                    'valid_until' => $startDate->copy()->addDays($newPackage->duration_days),
                    'status' => $status,

                    // 'type' => $isExtend ? 'extend' : 'upgrade', 
                    // 'description' => ($isExtend ? "Gia hạn gói " : "Nâng cấp lên gói ") . $newPackage->name
                ]);

                if ($status == 'paid') {
                    if (!$member->valid_until || Carbon::parse($invoice->valid_until)->gt(Carbon::parse($member->valid_until))) {
                        $member->update([
                            'valid_until' => $invoice->valid_until
                        ]);
                    }
                }
            });

            $waiting = ($request->payment_method == 'cash');
if(!$waiting){
    Notification::create([
        'user_id' => $member->id,
        'type' => $isExtend ? 'extend_package' : 'upgrade_package',
        'title' => $isExtend ? 'Gia hạn gói tập' : 'Nâng cấp gói tập',
        'message' => ($isExtend ? 'Bạn đã gia hạn gói ' : 'Bạn đã nâng cấp lên gói ') . $newPackage->name
    ]);
}
            return response()->json([
                'success' => true,
                'waiting' => $waiting,
                'message' => $isExtend ? 'Gia hạn thành công!' : 'Nâng cấp thành công!',
                'invoice' => $invoice,
            ], 200);

        } catch (Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // lấy danh sách member
    public function getMember(Request $request)
    {
        $query = Member::query()
            ->where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->with([
                'latestInvoice:id,member_id,package_id,valid_until,created_at',
                'latestInvoice.package:id,package_type_id',
                'latestInvoice.package.packageType:id',
                'latestInvoice.package.packageType.services:id,name',
                'roles:id,name',
                'activept:id,member_id,pt_id,status,start_date,end_date',
                'activept.pt:id,name,avatar',
            ]);

        // TÌM KIẾM (theo tên hoặc SĐT)

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;

            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                    ->orWhere('phone', 'like', "%$keyword%");
            });
        }

        // LỌC THEO GIỚI TÍNH
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }
        // Filter PT
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

        // SẮP XẾP THEO NGÀY TẠO
        $sort = $request->get('sort', 'desc'); // mặc định mới nhất
        $query->orderBy('created_at', $sort);

        // PHÂN TRANG (6 ITEM / TRANG)
        $members = $query->paginate(6);

        // append computed fields
        $members->getCollection()->transform(function ($member) {
            $canAddPT = false;

            // Chưa có PT
            if (!$member->activept && $member->latestInvoice && Carbon::parse($member->latestInvoice->valid_until)->gte(Carbon::today())) {

                $services = optional(
                    optional(
                        optional($member->latestInvoice->package)->packageType
                    )->services
                );

                if ($services && $services->contains('id', 2)) {
                    $canAddPT = true;
                }
            }
            if (!$member->latestInvoice) {
                $member->invoice = null;
                return $member;
            }
            $today = Carbon::today();
            $validUntil = Carbon::parse($member->latestInvoice->valid_until);

            $member->invoice = [
                'start_date' => $member->latestInvoice->created_at->toDateString(),
                'valid_until' => $validUntil->toDateString(),
                'days_left' => max(0, $today->diffInDays($validUntil, false)),
            ];
            $member->can_add_pt = $canAddPT;

            unset($member->latestInvoice);

            return $member;

        });
        // TRẢ JSON CHO FRONTEND
        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }
    public function getStatUser()
    {
        // THỐNG KÊ
        $full = Member::where('is_deleted', false)
            ->count();
        // THỐNG KÊ thẻ member
        $fullMember = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->count();
        // THỐNG KÊ
        $fullPT = Member::where('is_deleted', false)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'PT');
            })
            ->count();
        $fullDeleted = Member::where('is_deleted', true)
            ->whereHas('roles', function ($q) {
                $q->where('name', 'Member');
            })
            ->count();
        return response()->json([
            'success' => true,
            'full' => $full,
            'fullMember' => $fullMember,
            'fullPT' => $fullPT,
            'fullDeleted' => $fullDeleted,
        ]);
    }
    public function getMe(Request $request)
    {
        return response()->json($request->user());
    }
   public function myPT()
{
    $memberId = auth()->id();

    $pt = DB::table('pt_clients')
        ->join('members', 'pt_clients.pt_id', '=', 'members.id')
        ->where('pt_clients.member_id', $memberId)
        ->select('members.id', 'members.name', 'members.email')
        ->first();

    if (!$pt) {
        return response()->json([
            'has_pt' => false
        ]);
    }

    return response()->json([
        'has_pt' => true,
        'pt' => $pt
    ]);
}
public function choosePT(Request $request)
{
    $request->validate([
        'pt_id' => 'required|exists:members,id'
    ]);

    $memberId = auth()->id();

    $already = DB::table('pt_clients')
        ->where('member_id', $memberId)
        ->exists();

    if ($already) {
        return response()->json([
            'message' => 'Bạn đã có PT rồi'
        ], 400);
    }

    DB::table('pt_clients')->insert([
        'pt_id' => $request->pt_id,
        'member_id' => $memberId,
        'created_at' => now(),
        'updated_at' => now()
    ]);
Notification::create([
    'user_id' => $request->pt_id,
    'sender_id' => $memberId,
    'type' => 'member_choose_pt',
    'title' => 'Member mới',
    'message' => 'Một hội viên đã chọn bạn làm PT',
    'data' => [
        'member_id' => $memberId
    ]
]);
    return response()->json([
        'message' => 'Chọn PT thành công'
    ]);
}
public function listPTs()
{
    $pts = DB::table('members')
        ->join('member_role', 'members.id', '=', 'member_role.member_id')
        ->join('roles', 'roles.id', '=', 'member_role.role_id')
        ->where('roles.name', 'PT')
        ->select('members.id', 'members.name', 'members.email')
        ->get();

    return response()->json([
        'success' => true,
        'data' => $pts
    ]);
}
public function cancel($id)
{
    $memberId = auth()->id();

    $schedule = PTSchedule::find($id);

    if (!$schedule) {
        return response()->json([
            'message' => 'Lịch không tồn tại'
        ], 404);
    }

    // Chỉ cho phép hủy nếu chính member đó đã đăng ký
    if ($schedule->member_id != $memberId) {
        return response()->json([
            'message' => 'Bạn không có quyền hủy lịch này'
        ], 403);
    }

    // Không cho hủy nếu còn < 3 ngày (tuỳ luật bạn muốn)
    if (Carbon::now()->diffInDays($schedule->date, false) < 3) {
        return response()->json([
            'message' => 'Chỉ được hủy trước 3 ngày'
        ], 400);
    }

    $schedule->update([
        'member_id' => null
    ]);
Notification::create([
    'user_id' => $schedule->pt_id,
    'sender_id' => $memberId,
    'type' => 'schedule_cancel',
    'title' => 'Lịch tập bị hủy',
    'message' => 'Một hội viên đã hủy lịch tập'
]);
    return response()->json([
        'message' => 'Hủy lịch thành công'
    ]);
}

public function getMemberDetailForPT($id)
{
    $member = Member::where('id', $id)
        ->where('is_deleted', false)
        ->select('id','name','email','phone','gender','avatar','created_at')
        ->first();

    if(!$member){
        return response()->json([
            'message' => 'Member không tồn tại'
        ],404);
    }

    // ===== PACKAGE INFO =====
    $invoice = Invoice::where('member_id',$id)
        ->where('status','paid')
        ->latest()
        ->first();

    $package = null;

    if($invoice){
        $package = TrainingPackage::find($invoice->package_id);
    }

    // ===== SESSIONS =====
    $totalSessions = PTSchedule::where('member_id',$id)->count();

    $completedSessions = PTSchedule::where('member_id',$id)
        ->where('date','<',now())
        ->count();

    $remainingSessions = $totalSessions - $completedSessions;

    // ===== UPCOMING SESSIONS =====
    $upcoming = PTSchedule::where('member_id',$id)
        ->where('date','>=',now())
        ->orderBy('date')
        ->take(3)
        ->get(['id','date','start_time','end_time']);
$bodyMetrics = BodyMetric::where('member_id', $id)
    ->orderBy('created_at', 'desc')
    ->first();
    return response()->json([
    'member' => $member,

    'package' => [
        'name' => $package?->name,
        'valid_until' => $invoice?->valid_until
    ],

    'sessions' => [
        'total' => $totalSessions,
        'completed' => $completedSessions,
        'remaining' => $remainingSessions
    ],

    'upcoming_sessions' => $upcoming,

    // thêm phần này
    'body_metrics' => $bodyMetrics
]);
}
}
