import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import BookingSystem from './components/BookingSystem';

// Create root and render the app
const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<BookingSystem />);
}
