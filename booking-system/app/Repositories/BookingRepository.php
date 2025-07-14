<?php
// app/Repositories/BookingRepository.php

namespace App\Repositories;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository implements BookingRepositoryInterface
{
    protected Booking $model;

    public function __construct(Booking $model)
    {
        $this->model = $model;
    }

    /**
     * Get bookings for a specific room
     */
    public function getByRoomId(int $roomId): Collection
    {
        return $this->model->where('room_id', $roomId)
            ->where('end_time', '>', now()) // Only future bookings
            ->with('room')
            ->orderBy('start_time')
            ->get();
    }

    /**
     * Create a new booking
     */
    public function create(array $data): Booking
    {
        return $this->model->create($data);
    }

    /**
     * Find booking by ID
     */
    public function findById(int $id): ?Booking
    {
        return $this->model->with('room')->find($id);
    }

    /**
     * Delete a booking
     */
    public function delete(Booking $booking): bool
    {
        return $booking->delete();
    }

    /**
     * Check for overlapping bookings
     */
    public function hasOverlappingBooking(int $roomId, string $startTime, string $endTime, ?int $excludeBookingId = null): bool
    {
        $query = $this->model->overlapping($startTime, $endTime, $roomId);

        if ($excludeBookingId) {
            $query->where('id', '!=', $excludeBookingId);
        }

        return $query->exists();
    }
}