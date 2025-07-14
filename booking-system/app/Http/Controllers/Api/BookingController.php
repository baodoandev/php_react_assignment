<?php
// app/Http/Controllers/Api/BookingController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;

class BookingController extends Controller
{
    protected BookingService $bookingService;
    protected BookingRepositoryInterface $bookingRepository;

    public function __construct(
        BookingService $bookingService,
        BookingRepositoryInterface $bookingRepository
    ) {
        $this->bookingService = $bookingService;
        $this->bookingRepository = $bookingRepository;
    }

    /**
     * POST /api/bookings – Create a booking (with basic validation)
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            $booking = $this->bookingService->createBooking($request->validated());

            return response()->json([
                'success' => true,
                'data' => new BookingResource($booking->load('room')),
                'message' => 'Booking created successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }

    /**
     * DELETE /api/bookings/{id} – Delete a booking
     */
    public function destroy(int $bookingId): JsonResponse
    {
        $booking = $this->bookingRepository->findById($bookingId);
        
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found'
            ], 404);
        }

        try {
            $this->bookingService->deleteBooking($booking);

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}