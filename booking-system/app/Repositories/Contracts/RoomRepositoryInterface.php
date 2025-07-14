<?php
// app/Repositories/Contracts/RoomRepositoryInterface.php

namespace App\Repositories\Contracts;

use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

interface RoomRepositoryInterface
{
    /**
     * Get all rooms
     */
    public function getAll(): Collection;

    /**
     * Find room by ID with bookings
     */
    public function findWithBookings(int $id): ?Room;
}