<?php
// database/seeders/RoomSeeder.php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Booking;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            ['name' => 'Meeting Room A', 'capacity' => 8],
            ['name' => 'Meeting Room B', 'capacity' => 12],
            ['name' => 'Conference Hall', 'capacity' => 50],
            ['name' => 'Small Office', 'capacity' => 4],
            ['name' => 'Open Space', 'capacity' => 20],
        ];

        foreach ($rooms as $roomData) {
            Room::create($roomData);
        }

        // Create some sample bookings
        $sampleBookings = [
            [
                'room_id' => 1,
                'user_name' => 'John Doe',
                'start_time' => Carbon::now()->addHours(2),
                'end_time' => Carbon::now()->addHours(4),
            ],
            [
                'room_id' => 1,
                'user_name' => 'Jane Smith',
                'start_time' => Carbon::now()->addDays(1)->setHour(10),
                'end_time' => Carbon::now()->addDays(1)->setHour(12),
            ],
            [
                'room_id' => 2,
                'user_name' => 'Bob Johnson',
                'start_time' => Carbon::now()->addHours(1),
                'end_time' => Carbon::now()->addHours(3),
            ],
            [
                'room_id' => 3,
                'user_name' => 'Alice Brown',
                'start_time' => Carbon::now()->addDays(2)->setHour(14),
                'end_time' => Carbon::now()->addDays(2)->setHour(16),
            ],
        ];

        foreach ($sampleBookings as $bookingData) {
            Booking::create($bookingData);
        }
    }
}
