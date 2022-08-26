<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if (Auth::attempt($credentials)) {
            return response()->json($user, 200);
        } else {
            return response()->json('Invalid name or email or password', 400);
        }
    }

    public function register(RegisterRequest $request)
    {
        $uuid = (string)Str::uuid();

        User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => bcrypt($request->get('password')),
            'uuid' => $uuid,
        ]);

        return response()->json('Register Successful', 200);
    }
}
