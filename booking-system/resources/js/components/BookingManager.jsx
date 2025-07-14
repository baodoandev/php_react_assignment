import React, { useEffect } from 'react';
import { useBookingContext } from '../contexts/BookingContext';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import axios from 'axios';

const BookingManager = ({ room, onRoomChange }) => {
    const { dispatch, loading, error } = useBookingContext();

    useEffect(() => {
        fetchBookings();
    }, [room.id]);

    const fetchBookings = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const response = await axios.get(`/rooms/${room.id}/bookings`);
            
            if (response.data.success) {
                dispatch({ type: 'SET_BOOKINGS', payload: response.data.data });
            } else {
                dispatch({ type: 'SET_ERROR', payload: response.data.message });
            }
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: 'Failed to load bookings' });
            console.error('Error fetching bookings:', err);
        }
    };

    const handleBookingCreated = (newBooking) => {
        dispatch({ type: 'ADD_BOOKING', payload: newBooking });
    };

    const handleBookingDeleted = (bookingId) => {
        dispatch({ type: 'REMOVE_BOOKING', payload: bookingId });
    };

    const handleRefresh = () => {
        fetchBookings();
    };

    return (
        <div className="space-y-6">
            {/* Room Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {room.name}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                                <span className="mr-1">👥</span>
                                Capacity: {room.capacity}
                            </span>
                            <span className="flex items-center">
                                <span className="mr-1">📅</span>
                                Room ID: {room.id}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => onRoomChange(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        title="Back to room selection"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="text-red-600 mr-3">⚠️</div>
                        <div className="flex-1">
                            <p className="text-red-800 font-medium">Error</p>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                        <button
                            onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
                            className="text-red-400 hover:text-red-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Booking Form */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        📝 Create New Booking
                    </h3>
                </div>
                <div className="p-6">
                    <BookingForm 
                        roomId={room.id}
                        onBookingCreated={handleBookingCreated}
                        onError={(error) => dispatch({ type: 'SET_ERROR', payload: error })}
                    />
                </div>
            </div>

            {/* Booking List */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                            📋 Current Bookings
                        </h3>
                        <button
                            onClick={handleRefresh}
                            disabled={loading}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                        >
                            <svg className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
                <div className="p-6">
                    <BookingList 
                        onBookingDeleted={handleBookingDeleted}
                        onError={(error) => dispatch({ type: 'SET_ERROR', payload: error })}
                    />
                </div>
            </div>
        </div>
    );
};

export default BookingManager; 