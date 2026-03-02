<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PackageType;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PackageTypeController extends Controller
{
    // Lấy danh sách Loại gói + Dịch vụ đi kèm
     
    public function index(Request $request)
    {
        $query = PackageType::with('services');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Phân trang 5 bản ghi mỗi trang
        $types = $query->orderBy('id', 'desc')->paginate(5);

        return response()->json([
            'status' => true,
            'data' => $types
        ]);
    }

    // Lấy danh sách tất cả Dịch vụ (để đổ vào Checkbox Form)
     
    public function getAllService()
    {
        
        $services = Service::select('id', 'name')->orderBy('name', 'asc')->get();

        return response()->json([
            'status' => true,
            'data' => $services 
        ]);
    }
    // Xem chi tiết 1 Loại gói

    public function show($id)
    {
        $packageType = PackageType::with('services')->find($id);

        if (!$packageType) {
            return response()->json(['status' => false, 'message' => 'Không tìm thấy loại gói'], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $packageType
        ]);
    }

    // Tạo mới Loại gói
     
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'service_ids' => 'array',        
            'service_ids.*' => 'exists:services,id' 
        ]);

        try {
            DB::beginTransaction();

            $packageType = PackageType::create([
                'name' => $request->name
            ]);

            if ($request->has('service_ids')) {
                $packageType->services()->sync($request->service_ids);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Thêm loại gói thành công',
                'data' => $packageType->load('services')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => 'Lỗi server: ' . $e->getMessage()], 500);
        }
    }

    // Cập nhật Loại gói
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'service_ids' => 'array',
            'service_ids.*' => 'exists:services,id'
        ]);

        try {
            DB::beginTransaction();

            $packageType = PackageType::findOrFail($id);

            $packageType->update([
                'name' => $request->name
            ]);

            if ($request->has('service_ids')) {
                $packageType->services()->sync($request->service_ids);
            } else {
                $packageType->services()->detach();
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Cập nhật thành công',
                'data' => $packageType->load('services')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => 'Lỗi server: ' . $e->getMessage()], 500);
        }
    }

    // Xóa Loại gói
     
    public function destroy($id)
    {
        try {
            $packageType = PackageType::findOrFail($id);
            
            if ($packageType->trainingPackages()->count() > 0) {
                return response()->json([
                    'status' => false, 
                    'message' => 'Không thể xóa! Đang có gói tập thuộc loại này.'
                ], 400);
            }

            $packageType->services()->detach();

            $packageType->delete();

            return response()->json([
                'status' => true,
                'message' => 'Đã xóa loại gói thành công'
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false, 
                'message' => 'Lỗi hệ thống: ' . $e->getMessage()
            ], 500);
        }
    }
}