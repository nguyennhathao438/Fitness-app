<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TrainingPackage;
use App\Models\PackageType;
use App\Models\Service; 

class AdminPackageController extends Controller
{
    // Lấy danh sách gói tập.
     
    public function index(Request $request)
    {
        $query = TrainingPackage::with('packageType:id,name')
                    ->where('is_deleted', false);

        // Lọc và tìm kiếm giữ nguyên logic cũ
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        if ($request->filled('package_type_id')) {
            $query->where('package_type_id', $request->package_type_id);
        }

        // Phân trang 5 bản ghi mỗi trang
        $packages = $query->orderBy('created_at', 'desc')->paginate(5);

        return response()->json([
            'success' => true, 
            'data' => $packages 
        ]);
    }

    // Xem chi tiết gói tập.
     
    public function show($id)
    {
        $package = TrainingPackage::with('packageType:id,name')
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

    // Tạo gói tập mới.
     
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'package_type_id' => 'required|exists:package_types,id',
            'description' => 'nullable|string',
        ], [
            'name.required' => 'Vui lòng nhập tên gói',
            'price.required' => 'Vui lòng nhập giá tiền',
            'duration_days.required' => 'Vui lòng nhập thời hạn (ngày)',
            'package_type_id.required' => 'Vui lòng chọn loại gói',
        ]);

        $package = TrainingPackage::create([
            'name' => $request->name,
            'price' => $request->price,
            'duration_days' => $request->duration_days,
            'package_type_id' => $request->package_type_id,
            'description' => $request->description,
            'is_deleted' => false
        ]);

        return response()->json([
            'success' => true, 
            'message' => 'Thêm gói tập thành công', 
            'data' => $package
        ]);
    }

    // Cập nhật thông tin gói tập.
     
    public function update(Request $request, $id)
    {
        $package = TrainingPackage::where('is_deleted', false)->find($id);
        
        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy gói tập'
            ], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'required|integer|min:1',
            'package_type_id' => 'required|exists:package_types,id',
            'description' => 'nullable|string',
        ]);

        $package->update($request->all());

        return response()->json([
            'success' => true, 
            'message' => 'Cập nhật thành công', 
            'data' => $package
        ]);
    }

    // Xóa mềm gói tập.
     
    public function destroy($id)
    {
        $package = TrainingPackage::where('is_deleted', false)->find($id);

        if (!$package) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy gói tập'
            ], 404);
        }

        $package->update(['is_deleted' => true]);

        return response()->json([
            'success' => true, 
            'message' => 'Đã xóa gói tập thành công'
        ]);
    }

    // Lấy danh sách Loại gói.
     
    public function getTypes()
    {
        $types = PackageType::select('id', 'name')->get();
        return response()->json($types);
    }

    //Thống kê Dashboard.
     
    public function stats()
    {
        try {
            $totalPackages = TrainingPackage::where('is_deleted', false)->count();

            $totalTypes = PackageType::count();

            $totalServices = Service::count();

            return response()->json([
                'status' => true,
                'data' => [
                    'total_packages' => $totalPackages,
                    'total_types'    => $totalTypes,
                    'total_services' => $totalServices,
                ]
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Lỗi lấy thống kê: ' . $e->getMessage()
            ], 500);
        }
    }
}