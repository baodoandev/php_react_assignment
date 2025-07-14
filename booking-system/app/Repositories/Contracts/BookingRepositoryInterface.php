<?php
// app/Repositories/Contracts/BookingRepositoryInterface.php

namespace App\Repositories\Contracts;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

interface BookingRepositoryInterface
{
    /**
     * Get bookings for a specific room
     */
    public function getByRoomId(int $roomId): Collection;

    /**
     * Create a new booking
     */
    public function create(array $data): Booking;

    /**
     * Find booking by ID
     */
    public function findById(int $id): ?Booking;

    /**
     * Delete a booking
     */
    public function delete(Booking $booking): bool;

    /**
     * Check for overlapping bookings
     */
    public function hasOverlappingBooking(int $roomId, string $startTime, string $endTime, ?int $excludeBookingId = null): bool;
}