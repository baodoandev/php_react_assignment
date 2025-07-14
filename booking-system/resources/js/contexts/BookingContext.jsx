import React, { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
    bookings: [],
    loading: false,
    error: null,
    refreshTrigger: 0
};

const bookingReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };
        case 'SET_BOOKINGS':
            return { ...state, bookings: action.payload, loading: false, error: null };
        case 'ADD_BOOKING':
            return { 
                ...state, 
                bookings: [...state.bookings, action.payload],
                loading: false,
                error: null
            };
        case 'REMOVE_BOOKING':
            return {
                ...state,
                bookings: state.bookings.filter(booking => booking.id !== action.payload),
                loading: false,
                error: null
            };
        case 'REFRESH':
            return { ...state, refreshTrigger: state.refreshTrigger + 1 };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

export const BookingProvider = ({ children }) => {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    const value = {
        ...state,
        dispatch
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBookingContext = () => {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBookingContext must be used within a BookingProvider');
    }
    return context;
}; 