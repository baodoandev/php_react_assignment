import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { Calendar, Clock, Users, X, Plus, AlertCircle } from 'lucide-react';

// API configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

// API service
const api = {
  async get(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  },
  
  async post(endpoint, data) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }
    return response.json();
  },
  
  async delete(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  }
};

// Context for state management
const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'SET_SELECTED_ROOM':
      return { ...state, selectedRoom: action.payload, selectedRoomBookings: [] };
    case 'SET_ROOM_BOOKINGS':
      return { ...state, selectedRoomBookings: action.payload };
    case 'ADD_BOOKING':
      return { 
        ...state, 
        selectedRoomBookings: [...state.selectedRoomBookings, action.payload] 
      };
    case 'REMOVE_BOOKING':
      return { 
        ...state, 
        selectedRoomBookings: state.selectedRoomBookings.filter(b => b.id !== action.payload) 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const initialState = {
  rooms: [],
  selectedRoom: null,
  selectedRoomBookings: [],
  loading: false,
  error: null
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const actions = {
    setRooms: (rooms) => dispatch({ type: 'SET_ROOMS', payload: rooms }),
    setSelectedRoom: (room) => dispatch({ type: 'SET_SELECTED_ROOM', payload: room }),
    setRoomBookings: (bookings) => dispatch({ type: 'SET_ROOM_BOOKINGS', payload: bookings }),
    addBooking: (booking) => dispatch({ type: 'ADD_BOOKING', payload: booking }),
    removeBooking: (id) => dispatch({ type: 'REMOVE_BOOKING', payload: id }),
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  };

  return (
    <BookingContext.Provider value={{ state, actions }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Room List Component
const RoomList = () => {
  const { state, actions } = useBooking();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        actions.setLoading(true);
        const rooms = await api.get('/rooms');
        actions.setRooms(rooms.data || rooms);
      } catch (error) {
        actions.setError('Failed to load rooms');
        console.error('Error fetching rooms:', error);
      } finally {
        actions.setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomSelect = async (room) => {
    try {
      actions.setSelectedRoom(room);
      actions.setLoading(true);
      const bookings = await api.get(`/rooms/${room.id}/bookings`);
      actions.setRoomBookings(bookings.data || bookings);
    } catch (error) {
      actions.setError('Failed to load room bookings');
      console.error('Error fetching bookings:', error);
    } finally {
      actions.setLoading(false);
    }
  };

  return (
    <div className="room-list">
      <h2 className="room-list-title">
        <Users className="icon" />
        Rooms
      </h2>
      {state.loading && !state.selectedRoom && (
        <div className="loading">Loading rooms...</div>
      )}
      {state.rooms.map((room) => (
        <div
          key={room.id}
          className={`room-item ${state.selectedRoom?.id === room.id ? 'selected' : ''}`}
          onClick={() => handleRoomSelect(room)}
        >
          <div className="room-name">{room.name}</div>
          <div className="room-capacity">
            <Users size={14} />
            Capacity: {room.capacity}
          </div>
        </div>
      ))}
    </div>
  );
};

// Booking Form Component
const BookingForm = () => {
  const { state, actions } = useBooking();
  const [formData, setFormData] = useState({
    user_name: '',
    start_time: '',
    end_time: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.user_name.trim()) {
      errors.user_name = 'User name is required';
    }
    
    if (!formData.start_time) {
      errors.start_time = 'Start time is required';
    }
    
    if (!formData.end_time) {
      errors.end_time = 'End time is required';
    }
    
    if (formData.start_time && formData.end_time) {
      if (new Date(formData.start_time) >= new Date(formData.end_time)) {
        errors.end_time = 'End time must be after start time';
      }
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);
      setFormErrors({});
      
      const bookingData = {
        ...formData,
        room_id: state.selectedRoom.id
      };
      
      const newBooking = await api.post('/bookings', bookingData);
      actions.addBooking(newBooking.data || newBooking);
      
      // Reset form
      setFormData({
        user_name: '',
        start_time: '',
        end_time: ''
      });
      
    } catch (error) {
      actions.setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!state.selectedRoom) {
    return (
      <div className="no-room-selected">
        <Calendar className="icon" />
        <p>Select a room to create a booking</p>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <h3>Create New Booking for {state.selectedRoom.name}</h3>
      <div className="booking-form-container">
        <div className="form-group">
          <label htmlFor="user_name">User Name</label>
          <input
            type="text"
            id="user_name"
            name="user_name"
            value={formData.user_name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={formErrors.user_name ? 'error' : ''}
            placeholder="Enter your name"
          />
          {formErrors.user_name && (
            <span className="error-message">{formErrors.user_name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="start_time">Start Time</label>
          <input
            type="datetime-local"
            id="start_time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={formErrors.start_time ? 'error' : ''}
          />
          {formErrors.start_time && (
            <span className="error-message">{formErrors.start_time}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="end_time">End Time</label>
          <input
            type="datetime-local"
            id="end_time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={formErrors.end_time ? 'error' : ''}
          />
          {formErrors.end_time && (
            <span className="error-message">{formErrors.end_time}</span>
          )}
        </div>

        <button 
          type="button" 
          className="submit-btn"
          disabled={submitting}
          onClick={handleSubmit}
        >
          <Plus size={16} />
          {submitting ? 'Creating...' : 'Create Booking'}
        </button>
      </div>
    </div>
  );
};

// Booking List Component
const BookingList = () => {
  const { state, actions } = useBooking();

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await api.delete(`/bookings/${bookingId}`);
      actions.removeBooking(bookingId);
    } catch (error) {
      actions.setError('Failed to delete booking');
      console.error('Error deleting booking:', error);
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!state.selectedRoom) {
    return null;
  }

  return (
    <div className="booking-list">
      <h3>
        <Clock className="icon" />
        Current Bookings for {state.selectedRoom.name}
      </h3>
      
      {state.loading && (
        <div className="loading">Loading bookings...</div>
      )}
      
      {state.selectedRoomBookings.length === 0 ? (
        <div className="no-bookings">
          <Calendar className="icon" />
          <p>No bookings found for this room</p>
        </div>
      ) : (
        <div className="bookings">
          {state.selectedRoomBookings.map((booking) => (
            <div key={booking.id} className="booking-item">
              <div className="booking-info">
                <div className="booking-user">{booking.user_name}</div>
                <div className="booking-time">
                  {formatDateTime(booking.start_time)} - {formatDateTime(booking.end_time)}
                </div>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteBooking(booking.id)}
                title="Delete booking"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Error Display Component
const ErrorDisplay = () => {
  const { state, actions } = useBooking();

  if (!state.error) return null;

  return (
    <div className="error-banner">
      <AlertCircle className="icon" />
      <span>{state.error}</span>
      <button onClick={() => actions.setError(null)}>
        <X size={16} />
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <BookingProvider>
      <div className="app">
        <header className="app-header">
          <h1>Booking Management System</h1>
        </header>
        
        <ErrorDisplay />
        
        <div className="app-content">
          <div className="sidebar">
            <RoomList />
          </div>
          
          <div className="main-content">
            <BookingList />
            <BookingForm />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .app {
          min-height: 100vh;
          background: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
        
        .app-header {
          background: white;
          padding: 1rem 2rem;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .app-header h1 {
          margin: 0;
          color: #1a202c;
          font-size: 1.5rem;
        }
        
        .error-banner {
          background: #fed7d7;
          color: #c53030;
          padding: 0.75rem 1rem;
          margin: 1rem;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .error-banner button {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          margin-left: auto;
        }
        
        .app-content {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .sidebar {
          width: 300px;
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .room-list-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .room-item {
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .room-item:hover {
          border-color: #3182ce;
          background: #f7fafc;
        }
        
        .room-item.selected {
          border-color: #3182ce;
          background: #ebf8ff;
        }
        
        .room-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        
        .room-capacity {
          color: #718096;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .booking-list, .booking-form {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .booking-list h3, .booking-form h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #2d3748;
          font-size: 1.125rem;
          font-weight: 600;
        }
        
        .booking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          margin-bottom: 0.5rem;
        }
        
        .booking-user {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }
        
        .booking-time {
          color: #718096;
          font-size: 0.875rem;
        }
        
        .delete-btn {
          background: #fed7d7;
          color: #c53030;
          border: none;
          border-radius: 0.25rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .delete-btn:hover {
          background: #feb2b2;
        }
        
        .no-bookings, .no-room-selected {
          text-align: center;
          padding: 2rem;
          color: #718096;
        }
        
        .no-bookings .icon, .no-room-selected .icon {
          width: 3rem;
          height: 3rem;
          margin: 0 auto 1rem;
          opacity: 0.5;
        }
        
        .form-group {
          margin-bottom: 1rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #2d3748;
          font-weight: 500;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #3182ce;
        }
        
        .form-group input.error {
          border-color: #e53e3e;
        }
        
        .error-message {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
        
        .submit-btn {
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 0.375rem;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #2c5aa0;
        }
        
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .loading {
          text-align: center;
          padding: 1rem;
          color: #718096;
        }
        
        .icon {
          flex-shrink: 0;
        }
        
        @media (max-width: 768px) {
          .app-content {
            flex-direction: column;
            padding: 1rem;
          }
          
          .sidebar {
            width: 100%;
          }
        }
      `}</style>
    </BookingProvider>
  );
};

export default App;