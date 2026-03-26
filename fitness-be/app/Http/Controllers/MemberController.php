<?php

namespace App\Http\Controllers;

use App\Http\Services\MemberService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\Member;
use App\Models\TrainingPackage;
use App\Models\Invoice;
use DB;
use Throwable;
use App\Models\PasswordOtp;
use Carbon\Carbon;
use App\Models\BodyMetric;
use App\Models\PTSchedule;
use App\Models\Notification;
use Cloudinary\Cloudinary;
use App\Models\Role;
class MemberController extends Controller
{
    /*
     * /
        Đăng ký hội viên mới 
        Thông tin cá nhân , lịch sử mua gói , trả về token 
     */
    protected $memberService;

    public function __construct(MemberService $memberService)
    {
        $this->memberService = $memberService;
        $this->middleware('permission:user.create')
            ->only(['store']);

        $this->middleware('permission:user.update')
            ->only(['editUser', 'deletePT']);

        $this->middleware('permission:user.delete')
            ->only(['deletedUser', 'deletePT']);
    }
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
                $vipRole = Role::where('name', 'Member')->first();

                if ($vipRole) {
                    $member->roles()->syncWithoutDetaching([$vipRole->id]);
                }
            });
            $serviceIds = $package->packageType->services->pluck('id');
            $waiting = "paid";
            if ($request->payment_method == 'cash') {
                $waiting = "pending";
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
                'statusInvoice' => $waiting,
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
            'gender' => 'nullable|string|in:male,female,other',
            'avatar' => 'nullable|string',
        ]);

        try {
            // Lấy dữ liệu hợp lệ từ request
            $data = $request->only([
                'name',
                'email',
                'phone',
                'gender',
                'avatar',
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
        $data = $this->memberService->getMemberStats();

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    // Thống kê progressbar hội viên theo pt
    public function memberHavePTStats()
    {
        $data = $this->memberService->getMemberHavePTStats();

        return response()->json([
            'success' => true,
            ...$data
        ]);
    }
    //thống kê biểu đồ tròn theo độ tuổi
    public function AgeStats()
    {
        $data = $this->memberService->getAgeStats();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    // xóa người dùng
    public function deletedUser($memberId)
    {
        $result = $this->memberService->deleteMember($memberId);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message']
        ], $result['status']);
    }
    // xóa PT
    public function deletePT($ptId)
    {
        $result = $this->memberService->deletePT($ptId);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message']
        ], $result['status']);
    }


    // sửa thông tin người dùng
    public function editUser(Request $request, $memberId)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:15',
            'gender' => 'nullable|in:male,female,other',
            'birthday' => 'nullable|date',
            'avatar' => 'nullable|string',
        ]);

        $result = $this->memberService->updateUser($request, $memberId);
        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
            'member' => $result['data'] ?? null
        ], $result['status']);
    }
    // lấy số lượng người hội viên dùng tháng này
    public function getUserThisMonth()
    {
        $data = $this->memberService->getUserThisMonth();

        return response()->json([
            'success' => true,
            'data' => $data
        ]);
    }
    // Thống kê biểu đồ cột theo vai trò và tổng người dùng
    public function getMemberChart(Request $request)
    {
        $data = $this->memberService->getMemberChart(
            $request->type,
            $request->year,
            $request->month
        );

        return response()->json([
            'success' => true,
            ...$data
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
                // Lấy thông tin gói muốn mua
                $newPackage = TrainingPackage::findOrFail($request->package_id);

                // Xác định trạng thái thanh toán
                $status = 'paid';
                if ($request->payment_method == 'cash') {
                    $status = 'pending';
                }

                // TÍNH TOÁN NGÀY BẮT ĐẦU VÀ GIÁ TIỀN
                $startDate = Carbon::now();
                $totalPrice = $newPackage->price;

                // Tìm hóa đơn đang sử dụng (nếu có)
                $currentInvoice = Invoice::where('member_id', $member->id)
                    ->where('status', 'paid')
                    ->where('valid_until', '>', Carbon::now())
                    ->orderByDesc('id')
                    ->orderBy('valid_until', 'desc')
                    ->with('package')
                    ->first();

                if ($isExtend) {
                    // NẾU LÀ GIA HẠN: Nối tiếp ngày, giá tiền giữ nguyên
                    if ($currentInvoice) {
                        $startDate = Carbon::parse($currentInvoice->valid_until);
                    }
                } else {
                    // NẾU LÀ NÂNG CẤP: Tính tiền dư để trừ đi
                    if ($currentInvoice && $currentInvoice->package) {
                        $oldPackage = $currentInvoice->package;

                        // Tính số ngày còn lại (chỉ lấy phần nguyên ngày)
                        $daysRemaining = max(0, Carbon::now()->startOfDay()->diffInDays(Carbon::parse($currentInvoice->valid_until)->startOfDay(), false));

                        if ($daysRemaining > 0 && $oldPackage->duration_days > 0) {
                            // Giá trị của 1 ngày ở gói cũ
                            $dailyRate = $oldPackage->price / $oldPackage->duration_days;

                            // Tổng tiền dư chưa dùng tới
                            $remainingValue = $daysRemaining * $dailyRate;

                            // Số tiền khách phải đóng = Giá gói mới - Tiền dư gói cũ 
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
            if (!$waiting) {
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
        $members = $this->memberService->getMembers($request);
        return response()->json([
            'success' => true,
            'data' => $members
        ]);
    }

    public function getStatUser()
    {
        $data = $this->memberService->getStatUser();

        return response()->json([
            'success' => true,
            ...$data
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
            ->select('id', 'name', 'email', 'phone', 'gender', 'avatar', 'created_at')
            ->first();

        if (!$member) {
            return response()->json([
                'message' => 'Member không tồn tại'
            ], 404);
        }

        // ===== PACKAGE INFO =====
        $invoice = Invoice::where('member_id', $id)
            ->where('status', 'paid')
            ->latest()
            ->first();

        $package = null;

        if ($invoice) {
            $package = TrainingPackage::find($invoice->package_id);
        }

        // ===== SESSIONS =====
        $totalSessions = PTSchedule::where('member_id', $id)->count();

        $completedSessions = PTSchedule::where('member_id', $id)
            ->where('date', '<', now())
            ->count();

        $remainingSessions = $totalSessions - $completedSessions;

        // ===== UPCOMING SESSIONS =====
        $upcoming = PTSchedule::where('member_id', $id)
            ->where('date', '>=', now())
            ->orderBy('date')
            ->take(3)
            ->get(['id', 'date', 'start_time', 'end_time']);
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
