import { db, poolConnection } from './db/connection'
import { mysqlTable, serial, text, varchar, timestamp, int, boolean, json, decimal } from "drizzle-orm/mysql-core"
// import mysql from 'mysql2/promise'
// import { drizzle } from "drizzle-orm/mysql-core"
// import drizle from 'drizzle-orm'

// Initialize MySQL connection pool
const pool = poolConnection

// Define schema
export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey(),
  trailId: text("trail_id").notNull(),
  trailName: text("trail_name").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  riders: int("riders").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  paymentId: text("payment_id"),
  paymentMethod: text("payment_method"),
  specialRequests: text("special_requests"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  paidAt: timestamp("paid_at"),
})

export const customers = mysqlTable("customers", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  emergencyContact: text("emergency_contact").notNull(),
  emergencyPhone: text("emergency_phone").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const riders = mysqlTable("riders", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  name: text("name").notNull(),
  age: int("age").notNull(),
  weight: int("weight").notNull(),
  experience: text("experience").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const trails = mysqlTable("trails", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  duration: text("duration").notNull(),
  distance: text("distance").notNull(),
  difficulty: text("difficulty").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  maxRiders: int("max_riders").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const timeSlots = mysqlTable("time_slots", {
  id: serial("id").primaryKey(),
  time: text("time").notNull(),
  maxCapacity: int("max_capacity").notNull(),
  active: boolean("active").default(true),
})

export const bookingLogs = mysqlTable("booking_logs", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull(),
  action: text("action").notNull(),
  details: json("details"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Initialize Drizzle ORM
// export const db = drizzle(pool)
