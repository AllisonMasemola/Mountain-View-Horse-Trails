-- bookings table
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `trail_id` VARCHAR(255) NOT NULL,
  `trail_name` TEXT NOT NULL,
  `date` TEXT NOT NULL,
  `time` TEXT NOT NULL,
  `riders` INT NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  `payment_id` TEXT,
  `payment_method` TEXT,
  `special_requests` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `paid_at` TIMESTAMP
);

-- customers table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `booking_id` VARCHAR(255) NOT NULL,
  `name` TEXT NOT NULL,
  `email` TEXT NOT NULL,
  `phone` TEXT NOT NULL,
  `emergency_contact` TEXT NOT NULL,
  `emergency_phone` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- riders table
CREATE TABLE IF NOT EXISTS `riders` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `booking_id` VARCHAR(255) NOT NULL,
  `name` TEXT NOT NULL,
  `age` INT NOT NULL,
  `weight` INT NOT NULL,
  `experience` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- trails table
CREATE TABLE IF NOT EXISTS `trails` (
  `id` VARCHAR(36) PRIMARY KEY,
  `name` TEXT NOT NULL,
  `duration` TEXT NOT NULL,
  `distance` TEXT NOT NULL,
  `difficulty` TEXT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT NOT NULL,
  `max_riders` INT NOT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- booking_logs table
CREATE TABLE IF NOT EXISTS `booking_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `booking_id` VARCHAR(255) NOT NULL,
  `action` TEXT NOT NULL,
  `details` JSON,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- time_slots table
CREATE TABLE IF NOT EXISTS `time_slots` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `time` VARCHAR(20) NOT NULL,
  `max_capacity` INT NOT NULL,
  `active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- indexes
CREATE INDEX `idx_bookings_trail_id` ON `bookings` (`trail_id`);
CREATE INDEX `idx_bookings_status` ON `bookings` (`status`);
CREATE INDEX `idx_customers_booking_id` ON `customers` (`booking_id`);
CREATE INDEX `idx_riders_booking_id` ON `riders` (`booking_id`);
CREATE INDEX `idx_booking_logs_booking_id` ON `booking_logs` (`booking_id`);
