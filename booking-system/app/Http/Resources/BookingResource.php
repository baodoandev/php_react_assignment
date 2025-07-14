<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'room_id' => $this->room_id,
            'room' => new RoomResource($this->whenLoaded('room')),
            'user_name' => $this->user_name,
            'start_time' => $this->start_time->format('Y-m-d H:i:s'),
            'end_time' => $this->end_time->format('Y-m-d H:i:s'),
            'duration_hours' => round($this->start_time->diffInMinutes($this->end_time) / 60, 2),
            'is_current' => $this->start_time <= now() && $this->end_time > now(),
            'is_upcoming' => $this->start_time > now(),
            'is_past' => $this->end_time <= now(),
            'status' => $this->getStatus(),
            'time_until_start' => $this->when($this->start_time > now(), function () {
                return $this->start_time->diffForHumans();
            }),
            'formatted_time_range' => $this->start_time->format('M j, Y g:i A') . ' - ' . $this->end_time->format('g:i A'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Get the booking status
     */
    private function getStatus(): string
    {
        $now = now();
        
        if ($this->end_time <= $now) {
            return 'completed';
        }
        
        if ($this->start_time <= $now && $this->end_time > $now) {
            return 'active';
        }
        
        return 'upcoming';
    }
}
