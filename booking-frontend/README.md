# Booking System Frontend

A modern React-based frontend application for managing room bookings and reservations.

## 🚀 Features

- **Room Listing**: Display all available rooms with details
- **Booking Management**: Create, view, and delete bookings
- **Real-time Validation**: Form validation with immediate feedback
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive user experience
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations

## 🛠️ Tech Stack

- **Framework**: React 19.x
- **Build Tool**: Create React App
- **Styling**: CSS3 with modern design patterns
- **Icons**: Lucide React
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)

## 🚀 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd php_react
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - phpMyAdmin: http://localhost:8080

### Manual Setup

1. **Install dependencies**
   ```bash
   cd booking-frontend
   npm install
   ```

2. **Environment setup**
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## 📁 Project Structure

```
booking-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── index.js            # Application entry point
│   ├── index.css           # Global styles
│   ├── components/         # React components
│   │   ├── BookingForm.jsx
│   │   ├── BookingManager.jsx
│   │   ├── BookingSystem.jsx
│   │   └── RoomList.jsx
│   └── contexts/           # React contexts
│       └── BookingContext.jsx
├── package.json
└── README.md
```

## 🎨 Components Overview

### BookingSystem.jsx
Main application component that orchestrates the entire booking system.

### RoomList.jsx
Displays all available rooms with their details and booking status.

### BookingManager.jsx
Manages the booking creation and deletion process.

### BookingForm.jsx
Form component for creating new bookings with validation.

### BookingContext.jsx
React context for global state management across components.

## 🔌 API Integration

The frontend communicates with the Laravel backend API through the following endpoints:

### Rooms
- `GET /api/rooms` - Fetch all rooms
- `GET /api/rooms/{id}` - Fetch specific room

### Bookings
- `GET /api/bookings` - Fetch all bookings
- `POST /api/bookings` - Create new booking
- `DELETE /api/bookings/{id}` - Delete booking

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

### API Configuration

The frontend is configured to communicate with the backend API. Make sure the backend is running and accessible at the configured URL.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📝 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

### Code Style

The project follows React best practices:
- Functional components with hooks
- Proper prop validation
- Clean component structure
- Consistent naming conventions

### Adding New Components

1. Create a new component file in `src/components/`
2. Export the component as default
3. Import and use in parent components
4. Add appropriate styling

## 🐳 Docker Commands

```bash
# Build and start frontend only
cd booking-frontend
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Access container shell
docker-compose exec frontend sh
```

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly interfaces

### User Experience
- Loading indicators
- Error messages
- Success notifications
- Form validation feedback

### Accessibility
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## 🔒 Security Considerations

- Input validation on frontend
- API error handling
- Secure API communication
- XSS prevention

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# The build folder contains optimized files
```

### Docker Production

```bash
# Build production image
docker build -t booking-frontend:prod .

# Run production container
docker run -p 3000:3000 booking-frontend:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

## 🔗 Related Projects

- [Backend API](../booking-system/README.md) - Laravel backend
- [Main Project](../README.md) - Complete project overview
