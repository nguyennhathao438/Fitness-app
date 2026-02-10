<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Phân trang 5 dịch vụ mỗi trang
        $services = $query->orderBy('id', 'desc')->paginate(5);

        return response()->json([
            'status' => true,
            'data' => $services
        ]);
    }

    public function store(Request $request) {
        $request->validate(['name' => 'required|string|unique:services,name']);
        $service = Service::create($request->all());
        return response()->json(['status' => true, 'message' => 'Thêm dịch vụ thành công', 'data' => $service]);
    }

    public function update(Request $request, $id) {
        $service = Service::findOrFail($id);
        $request->validate(['name' => 'required|string|unique:services,name,'.$id]);
        $service->update($request->all());
        return response()->json(['status' => true, 'message' => 'Cập nhật thành công', 'data' => $service]);
    }

    public function destroy($id) {
        $service = Service::findOrFail($id);
        if($service->packageTypes()->count() > 0) {
            return response()->json(['status' => false, 'message' => 'Dịch vụ này đang được sử dụng trong Loại Gói!'], 400);
        }
        $service->delete();
        return response()->json(['status' => true, 'message' => 'Xóa thành công']);
    }
}