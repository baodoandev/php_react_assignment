import React, { useState, useEffect } from 'react';
import RoomList from './RoomList';
import BookingManager from './BookingManager';
import { BookingProvider } from '../contexts/BookingContext';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = '/api/v1';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const BookingSystem = () => {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/rooms');
            if (response.data.success) {
                setRooms(response.data.data);
            }
        } catch (err) {
            setError('Failed to load rooms');
            console.error('Error fetching rooms:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking system...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️</div>
                    <p className="text-gray-600">{error}</p>
                    <button 
                        onClick={fetchRooms}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <BookingProvider>
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            🏢 Co-Working Space Booking System
                        </h1>
                        <p className="text-gray-600">
                            Book your workspace and manage your time efficiently
                        </p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Room List - Left Sidebar */}
                        <div className="lg:col-span-1">
                            <RoomList 
                                rooms={rooms}
                                selectedRoom={selectedRoom}
                                onRoomSelect={setSelectedRoom}
                            />
                        </div>

                        {/* Booking Manager - Main Content */}
                        <div className="lg:col-span-3">
                            {selectedRoom ? (
                                <BookingManager 
                                    room={selectedRoom}
                                    onRoomChange={setSelectedRoom}
                                />
                            ) : (
                                <div className="bg-white rounded-lg shadow p-8 text-center">
                                    <div className="text-gray-400 text-6xl mb-4">🏢</div>
                                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                                        Select a Room
                                    </h2>
                                    <p className="text-gray-500">
                                        Choose a room from the list to view and manage bookings
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BookingProvider>
    );
};

export default BookingSystem; 