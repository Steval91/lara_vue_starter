<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        if ($request->filled('sortField') && $request->filled('sortOrder')) {
            $query->orderBy($request->sortField, $request->sortOrder == 1 ? 'asc' : 'desc');
        }

        $perPage = $request->has('perPage') ? $request->perPage : 10;

        if (!in_array($perPage, [10, 20, 50])) {
            $perPage = 10;
        }

        $users = $query->paginate($perPage);

        return Inertia::render('Users/UserIndexServerSide', [
            'users' => $users,
            'perPage' => $perPage,
            'totalRecords' => $users->total(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:200',
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:user,admin',
        ]);
        $validated['password'] = Hash::make('password');

        User::create($validated);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:200',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:user,admin',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:users,id'
        ]);

        User::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }
}
