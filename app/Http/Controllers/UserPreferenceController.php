<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserPreference;

class UserPreferenceController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'categories' => 'nullable|array',
            'sources' => 'nullable|array',
            'authors' => 'nullable|array',
        ]);
    
        $userPreference = UserPreference::updateOrCreate(
            ['user_id' => $validatedData['user_id']],
            $validatedData
        );
    
        return response()->json($userPreference, 201);
    }
    public function getByUserId($userId)
    {
        $userPreference = UserPreference::where('user_id', $userId)->first();

        if (!$userPreference) {
            return response()->json(['message' => 'User preference not found'], 404);
        }

        return response()->json($userPreference, 200);
    }
}
