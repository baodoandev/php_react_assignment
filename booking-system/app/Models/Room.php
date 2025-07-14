<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'capacity',
    ];

    protected $casts = [
        'capacity' => 'integer',
    ];

    /**
     * Get all bookings for this room
     */
    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Get current bookings (not expired)
     */
    public function currentBookings(): HasMany
    {
        return $this->hasMany(Booking::class)
            ->where('end_time', '>', now());
    }

    /**
     * Get bookings for a specific date range
     */
    public function bookingsInRange($startDate, $endDate): HasMany
    {
        return $this->hasMany(Booking::class)
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_time', [$startDate, $endDate])
                    ->orWhereBetween('end_time', [$startDate, $endDate])
                    ->orWhere(function ($query) use ($startDate, $endDate) {
                        $query->where('start_time', '<=', $startDate)
                            ->where('end_time', '>=', $endDate);
                    });
            });
    }
}
