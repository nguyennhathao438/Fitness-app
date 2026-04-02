<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TrainingPackage;
use App\Models\PackageType;
use App\Models\Service;
use App\Models\Invoice;
use Illuminate\Support\Facades\DB;

class AdminPackageController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:package.create')
            ->only(['store']);

        $this->middleware('permission:package.update')
            ->only(['update']);

        $this->middleware('permission:package.delete')
            ->only(['destroy']);
    }
    // Lấy danh sách gói tập.

    public function index(Request $request)
    {
        $query = TrainingPackage::with('packageType:id,name')
            ->where('is_deleted', false);

        if ($request->filled('search')) {
            $searchTerm = $request->search;
            
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                  ->orWhere('description', 'like', '%' . $searchTerm . '%')
                  ->orWhere('price', 'like', '%' . $searchTerm . '%')
                  ->orWhere('duration_days', 'like', '%' . $searchTerm . '%')
                  ->orWhereHas('packageType', function ($typeQuery) use ($searchTerm) {
                      $typeQuery->where('name', 'like', '%' . $searchTerm . '%');
                  });
            });
        }
        
        if ($request->filled('package_type_id')) {
            $query->where('package_type_id', $request->package_type_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (int)$request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (int)$request->max_price);
        }

        if ($request->filled('sort_price') && in_array($request->sort_price, ['asc', 'desc'])) {
            $query->orderBy('price', $request->sort_price);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        $packages = $query->paginate(5);

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
                    'total_types' => $totalTypes,
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

    public function getPackageStat()
    {
        try {
            $packages = TrainingPackage::select('id', 'name')
                ->where('is_deleted', false)
                ->whereHas('invoices', function ($query) {
                    $query->where('status', 'paid'); // Phải có hóa đơn paid
                })
                ->withCount([
                    'invoices as registered_count' => function ($query) {
                        $query->where('status', 'paid'); // Đếm số lượng hóa đơn paid
                    }
                ])
                ->get();

            $labels = [];
            $registeredData = [];

            foreach ($packages as $pkg) {
                $labels[] = $pkg->name;
                $registeredData[] = $pkg->registered_count;
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'labels' => $labels,
                    'data' => [
                        'registered' => $registeredData
                    ]
                ]
            ]);

        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lỗi lấy dữ liệu biểu đồ: ' . $e->getMessage()
            ], 500);
        }
    }
}