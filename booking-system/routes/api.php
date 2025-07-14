<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Room;
use App\Models\Booking;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route first
Route::get('/test', function () {
    return response()->json(['message' => 'API routes working!', 'timestamp' => now()]);
});

// Core API Routes with v1 prefix
Route::prefix('v1')->group(function () {
    
    // GET /api/v1/rooms – List all rooms
    Route::get('/rooms', [App\Http\Controllers\Api\RoomController::class, 'index']);
    
    // GET /api/v1/rooms/{id}/bookings – List bookings of a room
    Route::get('/rooms/{roomId}/bookings', [App\Http\Controllers\Api\RoomController::class, 'bookings']);
    
    // POST /api/v1/bookings – Create a booking (with basic validation)
    Route::post('/bookings', [App\Http\Controllers\Api\BookingController::class, 'store']);
    
    // DELETE /api/v1/bookings/{id} – Delete a booking
    Route::delete('/bookings/{bookingId}', [App\Http\Controllers\Api\BookingController::class, 'destroy']);
});