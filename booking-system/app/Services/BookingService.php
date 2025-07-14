<?php

namespace App\Services;

use App\Models\Booking;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Repositories\Contracts\RoomRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class BookingService
{
    protected BookingRepositoryInterface $bookingRepository;
    protected RoomRepositoryInterface $roomRepository;

    public function __construct(
        BookingRepositoryInterface $bookingRepository,
        RoomRepositoryInterface $roomRepository
    ) {
        $this->bookingRepository = $bookingRepository;
        $this->roomRepository = $roomRepository;
    }

    /**
     * Create a new booking
     */
    public function createBooking(array $data): Booking
    {
        // Check for overlapping bookings
        $hasOverlap = $this->bookingRepository->hasOverlappingBooking(
            $data['room_id'],
            $data['start_time'],
            $data['end_time']
        );

        if ($hasOverlap) {
            throw new Exception('This time slot conflicts with an existing booking');
        }

        // Create the booking
        return $this->bookingRepository->create([
            'room_id' => $data['room_id'],
            'user_name' => $data['user_name'],
            'start_time' => Carbon::parse($data['start_time']),
            'end_time' => Carbon::parse($data['end_time']),
        ]);
    }

    /**
     * Delete a booking
     */
    public function deleteBooking(Booking $booking): bool
    {
        return $this->bookingRepository->delete($booking);
    }

    /**
     * Get all bookings for a room
     */
    public function getRoomBookings(int $roomId)
    {
        return $this->bookingRepository->getByRoomId($roomId);
    }
}