<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'room_id',
        'user_name',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    /**
     * Get the room that owns this booking
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Check if this booking overlaps with another time range
     */
    public function overlaps($startTime, $endTime): bool
    {
        return $this->start_time < $endTime && $this->end_time > $startTime;
    }

    /**
     * Scope to get bookings that overlap with a given time range
     */
    public function scopeOverlapping($query, $startTime, $endTime, $roomId = null)
    {
        $query->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($roomId) {
            $query->where('room_id', $roomId);
        }

        return $query;
    }

    /**
     * Scope to get future bookings
     */
    public function scopeFuture($query)
    {
        return $query->where('start_time', '>', now());
    }
}
