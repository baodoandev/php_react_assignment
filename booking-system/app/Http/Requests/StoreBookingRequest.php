<?php
// app/Http/Requests/StoreBookingRequest.php

namespace App\Http\Requests;

use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Set to false if you need authentication
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $bookingId = $this->route('booking')?->id;

        return [
            'room_id' => [
                'required',
                'integer',
                'exists:rooms,id'
            ],
            'user_name' => [
                'required',
                'string',
                'max:255',
                'min:2'
            ],
            'start_time' => [
                'required',
                'date',
                'after:now',
                function ($attribute, $value, $fail) {
                    // Additional validation: start time should be in business hours
                    $startTime = Carbon::parse($value);
                    $hour = $startTime->hour;
                    
                    if ($hour < 8 || $hour > 22) {
                        $fail('Bookings are only allowed between 8:00 AM and 10:00 PM.');
                    }
                },
            ],
            'end_time' => [
                'required',
                'date',
                'after:start_time',
                function ($attribute, $value, $fail) use ($bookingId) {
                    // Check for overlapping bookings
                    $roomId = $this->input('room_id');
                    $startTime = $this->input('start_time');
                    $endTime = $value;

                    if ($roomId && $startTime && $endTime) {
                        $overlappingQuery = Booking::overlapping($startTime, $endTime, $roomId);
                        
                        // Exclude current booking if updating
                        if ($bookingId) {
                            $overlappingQuery->where('id', '!=', $bookingId);
                        }
                        
                        if ($overlappingQuery->exists()) {
                            $fail('This time slot overlaps with an existing booking.');
                        }
                    }
                },
                function ($attribute, $value, $fail) {
                    // Additional validation: end time should be in business hours
                    $endTime = Carbon::parse($value);
                    $hour = $endTime->hour;
                    
                    if ($hour > 23 || ($hour == 23 && $endTime->minute > 0)) {
                        $fail('Bookings must end by 11:00 PM.');
                    }
                },
                function ($attribute, $value, $fail) {
                    // Maximum booking duration (8 hours)
                    $startTime = Carbon::parse($this->input('start_time'));
                    $endTime = Carbon::parse($value);
                    
                    if ($startTime->diffInHours($endTime) > 8) {
                        $fail('Booking duration cannot exceed 8 hours.');
                    }
                },
                function ($attribute, $value, $fail) {
                    // Minimum booking duration (30 minutes)
                    $startTime = Carbon::parse($this->input('start_time'));
                    $endTime = Carbon::parse($value);
                    
                    if ($startTime->diffInMinutes($endTime) < 30) {
                        $fail('Booking duration must be at least 30 minutes.');
                    }
                },
            ],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'room_id.required' => 'Please select a room.',
            'room_id.exists' => 'The selected room does not exist.',
            'user_name.required' => 'Please provide a user name.',
            'user_name.min' => 'User name must be at least 2 characters.',
            'start_time.required' => 'Please provide a start time.',
            'start_time.after' => 'Start time must be in the future.',
            'end_time.required' => 'Please provide an end time.',
            'end_time.after' => 'End time must be after start time.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Ensure times are properly formatted
        if ($this->has('start_time')) {
            $this->merge([
                'start_time' => Carbon::parse($this->input('start_time'))->format('Y-m-d H:i:s'),
            ]);
        }

        if ($this->has('end_time')) {
            $this->merge([
                'end_time' => Carbon::parse($this->input('end_time'))->format('Y-m-d H:i:s'),
            ]);
        }

        // Clean up user name
        if ($this->has('user_name')) {
            $this->merge([
                'user_name' => trim($this->input('user_name')),
            ]);
        }
    }
}