# 🏢 Co-Working Space Booking System

A modern, full-stack booking management system built with Laravel (Backend) and React (Frontend) for managing room bookings in a co-working space.

## 🚀 Features

### ✅ Core Features
- **Room Management**: List all rooms with capacity and details
- **Booking Creation**: Create bookings with comprehensive validation
- **Booking Management**: View, update, and delete existing bookings
- **Overlap Prevention**: Prevent conflicting bookings automatically
- **Time Validation**: Ensure start time is before end time
- **RESTful API**: Clean, well-documented API endpoints
- **Modern UI**: Beautiful, responsive interface

### 🎯 Advanced Features
- **Service Layer**: Clean separation of business logic
- **Repository Pattern**: Data access abstraction
- **React Context**: Global state management
- **Real-time Validation**: Form validation with immediate feedback
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations
- **Docker Support**: Complete containerization

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 12.x
- **Database**: MySQL 8.0
- **PHP Version**: 8.2+
- **Architecture**: Service & Repository Pattern
- **API**: RESTful with JSON responses

### Frontend
- **Framework**: React 19.x
- **Build Tool**: Create React App
- **Styling**: CSS3 with modern design
- **State Management**: React Context
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database Management**: phpMyAdmin
- **Development**: Hot reloading for both frontend and backend

## 📋 Prerequisites

- Docker and Docker Compose
- Git
- Node.js 18+ (for local development)
- PHP 8.2+ (for local development)

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
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **phpMyAdmin**: http://localhost:8080
   - **Database**: localhost:3306

### Manual Setup

1. **Backend Setup**
   ```bash
   cd booking-system
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

2. **Frontend Setup**
   ```bash
   cd booking-frontend
   npm install
   echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
   npm start
   ```

## 📁 Project Structure

```
php_react/
├── booking-system/          # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Repositories/
│   │   └── Services/
│   ├── database/
│   ├── routes/
│   ├── Dockerfile
│   └── docker-compose.yml
├── booking-frontend/        # React Frontend
│   ├── src/
│   │   ├── components/
│   │   └── contexts/
│   ├── public/
│   ├── Dockerfile
│   └── docker-compose.yml
├── docker-compose.yml       # Main orchestration
└── README.md
```

## 🔌 API Endpoints

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/{id}` - Get specific room
- `POST /api/rooms` - Create new room
- `PUT /api/rooms/{id}` - Update room
- `DELETE /api/rooms/{id}` - Delete room

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/{id}` - Get specific booking
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Delete booking

## 🗄️ Database Schema

### Rooms Table
- `id` - Primary key
- `name` - Room name
- `description` - Room description
- `capacity` - Maximum capacity
- `price_per_night` - Price per night
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Bookings Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `room_id` - Foreign key to rooms table
- `check_in_date` - Check-in date
- `check_out_date` - Check-out date
- `total_price` - Total booking price
- `status` - Booking status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## 🐳 Docker Configuration

### Services
- **mysql**: MySQL 8.0 database
- **backend**: Laravel application
- **frontend**: React application
- **phpmyadmin**: Database management interface

### Ports
- **3000**: React frontend
- **8000**: Laravel backend
- **3306**: MySQL database
- **8080**: phpMyAdmin

## 🧪 Testing

### Backend Tests
```bash
cd booking-system
php artisan test
```

### Frontend Tests
```bash
cd booking-frontend
npm test
```

## 📝 Development

### Code Style
- **Backend**: Laravel Pint for PHP formatting
- **Frontend**: ESLint and Prettier for JavaScript formatting

### Git Workflow
1. Create feature branch
2. Make changes
3. Add tests
4. Submit pull request

## 🚀 Deployment

### Production Build
```bash
# Backend
cd booking-system
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache

# Frontend
cd booking-frontend
npm run build
```

### Docker Production
```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
APP_NAME="Booking System"
APP_ENV=production
APP_KEY=your-app-key
APP_DEBUG=false
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=booking_system
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🎨 UI/UX Features

### Design Principles
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance
- **User Experience**: Intuitive navigation and feedback
- **Performance**: Optimized loading and rendering

### Components
- **Room List**: Display available rooms
- **Booking Form**: Create new bookings
- **Booking Manager**: Manage existing bookings
- **Error Handling**: User-friendly error messages

## 🔒 Security

### Backend Security
- Input validation and sanitization
- SQL injection prevention
- CSRF protection
- Rate limiting

### Frontend Security
- XSS prevention
- Input validation
- Secure API communication

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the individual README files in each directory
- **Issues**: Open an issue in the repository
- **Discussions**: Use GitHub Discussions for questions

## 🔗 Related Projects

- [Backend Documentation](booking-system/README.md)
- [Frontend Documentation](booking-frontend/README.md)

## 🙏 Acknowledgments

- Laravel team for the amazing framework
- React team for the powerful UI library
- Docker team for containerization
- All contributors to this project

---

**Built with ❤️ using Laravel & React** 