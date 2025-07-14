<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\RoomRepositoryInterface;
use App\Repositories\Contracts\BookingRepositoryInterface;
use App\Repositories\RoomRepository;
use App\Repositories\BookingRepository;
use App\Services\BookingService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bind Repository Interfaces to Implementations
        $this->app->bind(RoomRepositoryInterface::class, RoomRepository::class);
        $this->app->bind(BookingRepositoryInterface::class, BookingRepository::class);

        // Bind Services
        $this->app->bind(BookingService::class, function ($app) {
            return new BookingService(
                $app->make(BookingRepositoryInterface::class),
                $app->make(RoomRepositoryInterface::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}