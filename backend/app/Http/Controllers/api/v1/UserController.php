<?php

namespace App\Http\Controllers\api\v1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\RegisterRequest;

class UserController extends Controller
{
    public function register(RegisterRequest $request)
    {
        User::create([
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'password' => bcrypt($request->get('password')),
        ]);

        return response()->json('Register Successful', 200);
    }
}
