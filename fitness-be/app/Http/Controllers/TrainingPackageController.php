<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\TrainingPackage;
use App\Models\PackageType;
use App\Models\Service;
use Illuminate\Http\Request;
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

}
