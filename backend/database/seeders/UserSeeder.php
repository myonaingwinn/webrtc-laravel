<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $uuid1 = (string) Str::uuid();
        $uuid2 = (string) Str::uuid();
        $uuid3 = (string) Str::uuid();
        $uuid4 = (string) Str::uuid();
        $uuid5 = (string) Str::uuid();
        $uuid6 = (string) Str::uuid();

        User::create([
            'name' => 'Aye Thi Khaing',
            'email' => 'atk@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid1,
        ]);

        User::create([
            'name' => 'Hlaine Poe Ei',
            'email' => 'hpe@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid2,
        ]);

        User::create([
            'name' => 'Sandar Su',
            'email' => 'sds@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid3,
        ]);

        User::create([
            'name' => 'Theint Theint Hmawe',
            'email' => 'tth@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid4,
        ]);

        User::create([
            'name' => 'Myo Naing Winn',
            'email' => 'mnw@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid5,
        ]);

        User::create([
            'name' => 'Htet Linn',
            'email' => 'hl@gmail.com',
            'password' => Hash::make('password'),
            'uuid' => $uuid6,
        ]);
    }
}
