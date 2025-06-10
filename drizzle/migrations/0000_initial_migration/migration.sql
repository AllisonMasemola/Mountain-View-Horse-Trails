-- Create tables
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `trail_id` text NOT NULL,
  `trail_name` text NOT NULL,
  `date` text NOT NULL,
  `time` text NOT NULL,
  `riders` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` text NOT NULL DEFAULT 'pending',
  `payment_id` text,
  `payment_method` text,
  `special_requests` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `paid_at` timestamp
);

CREATE TABLE IF NOT EXISTS `customers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `booking_id` text NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `phone` text NOT NULL,
  `emergency_contact` text NOT NULL,
  `emergency_phone` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `riders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `booking_id` text NOT NULL,
  `name` text NOT NULL,
  `age` int NOT NULL,
  `weight` int NOT NULL,
  `experience` text NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `trails` (
  `id` text PRIMARY KEY,
  `name` text NOT NULL,
  `duration` text NOT NULL,
  `distance` text NOT NULL,
  `difficulty` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `max_riders` int NOT NULL,
  `active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `time_slots` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `time` text NOT NULL,
  `max_capacity` int NOT NULL,
  `active` boolean DEFAULT true,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `booking_logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `booking_id` text NOT NULL,
  `action` text NOT NULL,
  `details` json,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX `idx_bookings_trail_id` ON `bookings` (`trail_id`(255));
CREATE INDEX `idx_bookings_status` ON `bookings` (`status`(50));
CREATE INDEX `idx_customers_booking_id` ON `customers` (`booking_id`(255));
CREATE INDEX `idx_riders_booking_id` ON `riders` (`booking_id`(255));
CREATE INDEX `idx_booking_logs_booking_id` ON `booking_logs` (`booking_id`(255));
