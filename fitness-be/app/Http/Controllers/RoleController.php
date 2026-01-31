<?php

namespace App\Http\Controllers;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->get();

        return response()->json([
            'success' => true,
            'data' => $roles
        ]);
    }
    public function show(Role $role)
    {
        return response()->json([
            'success' => true,
            'data' => $role->load('permissions')
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
}
