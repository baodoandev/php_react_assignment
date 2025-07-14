import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format, addHours } from 'date-fns';
import axios from 'axios';

const BookingForm = ({ roomId, onBookingCreated, onError }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            user_name: '',
            start_time: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            end_time: format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm")
        }
    });

    const startTime = watch('start_time');

    // Update end time when start time changes
    React.useEffect(() => {
        if (startTime) {
            const startDate = new Date(startTime);
            const endDate = addHours(startDate, 1);
            setValue('end_time', format(endDate, "yyyy-MM-dd'T'HH:mm"));
        }
    }, [startTime, setValue]);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            
            const bookingData = {
                room_id: roomId,
                user_name: data.user_name,
                start_time: data.start_time,
                end_time: data.end_time
            };

            const response = await axios.post('/bookings', bookingData);
            
            if (response.data.success) {
                onBookingCreated(response.data.data);
                reset();
                // Show success message
                alert('Booking created successfully!');
            } else {
                onError(response.data.message);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                onError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const errorMessages = Object.values(err.response.data.errors).flat();
                onError(errorMessages.join(', '));
            } else {
                onError('Failed to create booking');
            }
            console.error('Error creating booking:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Name Field */}
            <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-2">
                    👤 User Name *
                </label>
                <input
                    type="text"
                    id="user_name"
                    {...register('user_name', {
                        required: 'User name is required',
                        minLength: {
                            value: 2,
                            message: 'User name must be at least 2 characters'
                        },
                        maxLength: {
                            value: 255,
                            message: 'User name must be less than 255 characters'
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.user_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your name"
                />
                {errors.user_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.user_name.message}</p>
                )}
            </div>

            {/* Start Time Field */}
            <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 Start Time *
                </label>
                <input
                    type="datetime-local"
                    id="start_time"
                    {...register('start_time', {
                        required: 'Start time is required',
                        validate: (value) => {
                            const selectedTime = new Date(value);
                            const now = new Date();
                            return selectedTime > now || 'Start time must be in the future';
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.start_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.start_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.start_time.message}</p>
                )}
            </div>

            {/* End Time Field */}
            <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                    🕐 End Time *
                </label>
                <input
                    type="datetime-local"
                    id="end_time"
                    {...register('end_time', {
                        required: 'End time is required',
                        validate: (value) => {
                            const startTime = new Date(watch('start_time'));
                            const endTime = new Date(value);
                            return endTime > startTime || 'End time must be after start time';
                        }
                    })}
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.end_time ? 'border-red-300' : 'border-gray-300'
                    }`}
                />
                {errors.end_time && (
                    <p className="mt-1 text-sm text-red-600">{errors.end_time.message}</p>
                )}
            </div>

            {/* Duration Display */}
            <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">📊 Booking Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">
                            {(() => {
                                const start = new Date(watch('start_time'));
                                const end = new Date(watch('end_time'));
                                if (start && end && end > start) {
                                    const diffMs = end - start;
                                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
                                    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                    return `${diffHours}h ${diffMinutes}m`;
                                }
                                return 'Invalid';
                            })()}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-600">Start:</span>
                        <span className="ml-2 font-medium">
                            {watch('start_time') ? format(new Date(watch('start_time')), 'MMM dd, yyyy HH:mm') : 'Not set'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? (
                        <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating...
                        </div>
                    ) : (
                        'Create Booking'
                    )}
                </button>
            </div>
        </form>
    );
};

export default BookingForm; 