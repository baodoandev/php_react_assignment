<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RoomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'capacity' => $this->capacity,
            'current_bookings_count' => $this->whenLoaded('bookings', function () {
                return $this->bookings->where('end_time', '>', now())->count();
            }),
            'next_available' => $this->when($this->relationLoaded('bookings'), function () {
                $nextBooking = $this->bookings
                    ->where('start_time', '>', now())
                    ->sortBy('start_time')
                    ->first();
                
                return $nextBooking ? $nextBooking->start_time->format('Y-m-d H:i:s') : null;
            }),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
