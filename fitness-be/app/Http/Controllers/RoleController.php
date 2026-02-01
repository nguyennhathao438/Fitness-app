<?php

namespace App\Http\Controllers;
use App\Models\Role;
use Illuminate\Http\Request;
use App\Models\Permission;
use DB;
class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::withCount('members')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
    public function show(Role $role)
    {
        $role->load('permissions');

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $role->id,
                'name' => $role->name,
                'description' => $role->description,
                'permissions' => $role->permissions->pluck('code')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
            'permissions' => 'array'
        ]);

        $role = Role::create([
            'name' => $request->name,
            'description' => $request->description
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo role thành công',
            'data' => $role->load('permissions')
        ], 201);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'sometimes|required|unique:roles,name,' . $role->id,
            'permissions' => 'sometimes|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        // Update name nếu có
        if ($request->has('name')) {
            $role->name = $request->name;
        }

        // Update description nếu có
        if ($request->has('description')) {
            $role->description = $request->description;
        }

        $role->save();

        // Sync permissions nếu có gửi lên
        if ($request->has('permissions')) {
            $role->permissions()->sync($request->permissions);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật role thành công',
            'data' => $role->load('permissions')
        ]);
    }
    public function getAllPermission()
    {
        $permissions = Permission::all();

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }
    public function destroy($id)
    {
        // 1. Kiểm tra role tồn tại
        $role = Role::find($id);

        if (!$role) {
            return response()->json([
                'message' => 'Role not found'
            ], 404);
        }

        // 2. Kiểm tra role có user đang sở hữu không
        $userCount = DB::table('member_role')
            ->where('role_id', $id)
            ->count();

        if ($userCount > 0) {
            return response()->json([
                'message' => 'Không thể xóa role vì đang có user sử dụng',
                'users_count' => $userCount
            ], 409); // Conflict
        }

        // 3. Xóa trong transaction
        DB::transaction(function () use ($id, $role) {
            // Xóa quyền của role
            DB::table('role_permission')
                ->where('role_id', $id)
                ->delete();

            // Xóa role
            $role->delete();
        });

        return response()->json([
            'message' => 'Xóa role thành công'
        ], 200);
    }
}
