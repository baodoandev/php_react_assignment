<?php
// app/Repositories/RoomRepository.php

namespace App\Repositories;

use App\Models\Room;
use App\Repositories\Contracts\RoomRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class RoomRepository implements RoomRepositoryInterface
{
    protected Room $model;

    public function __construct(Room $model)
    {
        $this->model = $model;
    }

    /**
     * Get all rooms
     */
    public function getAll(): Collection
    {
        return $this->model->orderBy('name')->get();
    }

    /**
     * Find room by ID with bookings
     */
    public function findWithBookings(int $id): ?Room
    {
        return $this->model->with(['bookings' => function ($query) {
            $query->where('end_time', '>', now())
                  ->orderBy('start_time');
        }])->find($id);
    }
}