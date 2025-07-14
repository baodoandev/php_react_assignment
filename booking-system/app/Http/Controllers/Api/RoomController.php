<?php
// app/Http/Controllers/Api/RoomController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoomResource;
use App\Http\Resources\BookingResource;
use App\Repositories\Contracts\RoomRepositoryInterface;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class RoomController extends Controller
{
    protected RoomRepositoryInterface $roomRepository;
    protected BookingService $bookingService;

    public function __construct(
        RoomRepositoryInterface $roomRepository,
        BookingService $bookingService
    ) {
        $this->roomRepository = $roomRepository;
        $this->bookingService = $bookingService;
    }

    /**
     * GET /api/rooms – List all rooms
     */
    public function index(): JsonResponse
    {
        $rooms = $this->roomRepository->getAll();
        
        return response()->json([
            'success' => true,
            'data' => RoomResource::collection($rooms),
            'message' => 'Rooms retrieved successfully'
        ]);
    }

    /**
     * GET /api/rooms/{id}/bookings – List bookings of a room
     */
    public function bookings(int $roomId): JsonResponse
    {
        $room = $this->roomRepository->findWithBookings($roomId);
        
        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Room not found'
            ], 404);
        }

        $bookings = $this->bookingService->getRoomBookings($roomId);

        return response()->json([
            'success' => true,
            'data' => BookingResource::collection($bookings),
            'message' => 'Room bookings retrieved successfully',
            'room' => new RoomResource($room)
        ]);
    }
}