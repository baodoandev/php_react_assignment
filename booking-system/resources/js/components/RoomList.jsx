import React from 'react';

const RoomList = ({ rooms, selectedRoom, onRoomSelect }) => {
    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    📋 Available Rooms
                </h2>
                <p className="text-sm text-gray-600">
                    {rooms.length} room{rooms.length !== 1 ? 's' : ''} available
                </p>
            </div>
            
            <div className="p-4">
                {rooms.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-2">🏢</div>
                        <p className="text-gray-500 text-sm">No rooms available</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {rooms.map((room) => (
                            <button
                                key={room.id}
                                onClick={() => onRoomSelect(room)}
                                className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                    selectedRoom?.id === room.id
                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900 mb-1">
                                            {room.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-2">👥</span>
                                            <span>Capacity: {room.capacity}</span>
                                        </div>
                                    </div>
                                    {selectedRoom?.id === room.id && (
                                        <div className="text-blue-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomList; 