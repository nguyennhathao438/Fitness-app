<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TrainingPackage;
use App\Models\PackageType;
use App\Models\Service;
use Illuminate\Http\Request;
use App\Models\Invoice;
use Carbon\Carbon; 
class TrainingPackageController extends Controller
{
    //Lấy danh sách gói tập theo loại ở trang đăng ký
    public function index(Request $request)
    {
        $query = TrainingPackage::with([
            'packageType:id,name',
            'packageType.services:id,name'
        ])
            ->where('is_deleted', false);

        // Lọc theo loại gói tập
        if ($request->filled('package_type_id')) {
            $query->where('package_type_id', $request->package_type_id);
        }

        $packages = $query->get();

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }
    public function getPackageCompare()
    {
        // Lấy tất cả loại gói
        $packageTypes = PackageType::select('id', 'name')->get();

        // Lấy tất cả dịch vụ + loại gói được phép
        $services = Service::with('packageTypes:id')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'packages' => $service->packageTypes->pluck('id'),
                ];
            });

        return response()->json([
            'package_types' => $packageTypes,
            'services' => $services,
        ]);
    }
    public function show($id)
    {
        $package = TrainingPackage::with([
            'packageType:id,name',
            'packageType.services:id,name'
        ])
            ->where('is_deleted', false)
            ->find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Gói tập không tồn tại'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $package
        ]);
    }
     
    private function getCurrentMemberLevel($memberId)
    {
        if (!$memberId) return 0;

        $lastInvoice = Invoice::where('member_id', $memberId)
            ->where('is_deleted', false)
            ->whereDate('valid_until', '>', Carbon::now()) 
            ->orderBy('id', 'desc')
            ->with('package') 
            ->first();

        if ($lastInvoice && $lastInvoice->package) {
            return $lastInvoice->package->package_type_id;
        }
        return 0;
    }

    // Lấy danh sách LOẠI GÓI có thể nâng cấp (Để hiện Tabs)
     
    public function getUpgradableTypes(Request $request)
    {
        $memberId = $request->input('member_id');
        $currentLevel = $this->getCurrentMemberLevel($memberId);

        // Chỉ lấy các Loại gói có ID lớn hơn Level hiện tại
        $types = PackageType::where('id', '>', $currentLevel)
            ->select('id', 'name')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $types
        ]);
    }

    // Lấy GÓI TẬP theo Loại (Khi bấm vào Tab)

    public function getUpgradablePackagesByType(Request $request)
    {
        $memberId = $request->input('member_id');
        $typeId = $request->input('package_type_id'); 

        $currentLevel = $this->getCurrentMemberLevel($memberId);

        if ($typeId <= $currentLevel) {
            return response()->json([
                'success' => true,
                'data' => [] 
            ]);
        }

        // Lấy danh sách gói
        $packages = TrainingPackage::with('packageType')
            ->where('is_deleted', false)
            ->where('package_type_id', $typeId) 
            ->orderBy('price', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $packages
        ]);
    }

    // Lấy thông tin chi tiết gói tập hiện tại của Member

    public function getCurrentPackageInfo(Request $request)
    {
        $memberId = $request->user()->id; // Lấy từ token

        // Tìm hóa đơn đang Active 
        $activeInvoice = Invoice::where('member_id', $memberId)
            ->where('status', 'paid')
            ->where('valid_until', '>', Carbon::now())
            ->orderBy('id', 'desc') 
            ->with('package') 
            ->first();

        if ($activeInvoice && $activeInvoice->package) {
            return response()->json([
                'success' => true,
                'data' => [
                    'package_id' => $activeInvoice->package_id, 
                    'package_name' => $activeInvoice->package->name,
                    'duration_days' => $activeInvoice->package->duration_days,
                    'price' => $activeInvoice->package->price,
                    'valid_until' => $activeInvoice->valid_until,
                    'days_remaining' => Carbon::now()->diffInDays($activeInvoice->valid_until, false),
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Bạn chưa có gói tập nào đang hoạt động'
        ]);
    }
}
