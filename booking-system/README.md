# Booking System Backend

A Laravel-based REST API for managing room bookings and reservations.

## 🚀 Features

- **Room Management**: CRUD operations for rooms
- **Booking System**: Create, read, update, and delete bookings
- **User Management**: User authentication and authorization
- **API Resources**: Structured JSON responses
- **Repository Pattern**: Clean separation of concerns
- **Service Layer**: Business logic encapsulation

## 🛠️ Tech Stack

- **Framework**: Laravel 12.x
- **Database**: MySQL 8.0
- **PHP Version**: 8.2+
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Docker and Docker Compose
- Git

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
   - Backend API: http://localhost:8000
   - phpMyAdmin: http://localhost:8080
   - Database: localhost:3306

### Manual Setup

1. **Install dependencies**
   ```bash
   cd booking-system
   composer install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. **Database configuration**
   ```bash
   # Update .env file with database credentials
   php artisan migrate
   php artisan db:seed
   ```

4. **Start the server**
   ```bash
   php artisan serve
   ```

## 📁 Project Structure

```
booking-system/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       ├── BookingController.php
│   │   │       └── RoomController.php
│   │   ├── Requests/
│   │   │   └── StoreBookingRequest.php
│   │   └── Resources/
│   │       ├── BookingResource.php
│   │       └── RoomResource.php
│   ├── Models/
│   │   ├── Booking.php
│   │   ├── Room.php
│   │   └── User.php
│   ├── Repositories/
│   │   ├── BookingRepository.php
│   │   ├── RoomRepository.php
│   │   └── Contracts/
│   └── Services/
│       └── BookingService.php
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/
    └── api.php
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

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
APP_NAME="Booking System"
APP_ENV=local
APP_KEY=your-app-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=booking_system
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password
```

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/BookingTest.php
```

## 📝 Development

### Code Style
```bash
# Format code using Laravel Pint
./vendor/bin/pint
```

### Database Migrations
```bash
# Create new migration
php artisan make:migration create_table_name

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback
```

### Seeders
```bash
# Run seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=RoomSeeder
```

## 🐳 Docker Commands

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build

# Access container shell
docker-compose exec backend bash
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
