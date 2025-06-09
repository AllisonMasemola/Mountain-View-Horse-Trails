import mysql from 'mysql2/promise'
import { drizzle } from "drizzle-orm/mysql-core"
import { mysqlTable, serial, varchar, timestamp, int, boolean, json, decimal } from "drizzle-orm/mysql-core"

// Initialize MySQL connection pool
const pool = mysql.createPool(process.env.DATABASE_URL || {
  host: 'localhost',
  user: 'username',
  password: 'password',
  database: 'mountain_view_db',
  port: 3306
})

// Define schema
export const bookings = mysqlTable("bookings", {
  id: text("id").primaryKey(),
  trailId: text("trail_id").notNull(),
  trailName: text("trail_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  riders: integer("riders").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentId: text("payment_id"),
  paymentMethod: text("payment_method"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  paidAt: timestamp("paid_at"),
})

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  emergencyContact: text("emergency_contact").notNull(),
  emergencyPhone: text("emergency_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const riders = pgTable("riders", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  weight: integer("weight").notNull(),
  experience: text("experience").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const trails = pgTable("trails", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  duration: text("duration").notNull(),
  distance: text("distance").notNull(),
  difficulty: text("difficulty").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  maxRiders: integer("max_riders").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  time: text("time").notNull(),
  maxCapacity: integer("max_capacity").notNull(),
  active: boolean("active").default(true),
})

export const bookingLogs = pgTable("booking_logs", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  action: text("action").notNull(),
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Initialize Drizzle ORM
export const db = drizzle(pool)
