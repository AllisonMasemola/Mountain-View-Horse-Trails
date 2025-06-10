import {
    mysqlTable,
    int,
    text,
    varchar,
    decimal,
    boolean,
    timestamp,
    json,
    primaryKey,
    index
  } from "drizzle-orm/mysql-core";
  
  // Bookings
  export const bookings = mysqlTable("bookings", {
    id: int("id").primaryKey().autoincrement(),
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
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
    paidAt: timestamp("paid_at"),
  }, (table) => ({
    trailIdIdx: index("idx_bookings_trail_id").on(table.trailId),
    statusIdx: index("idx_bookings_status").on(table.status),
  }));
  
  // Customers
  export const customers = mysqlTable("customers", {
    id: int("id").primaryKey().autoincrement(),
    bookingId: text("booking_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    emergencyContact: text("emergency_contact").notNull(),
    emergencyPhone: text("emergency_phone").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  }, (table) => ({
    bookingIdIdx: index("idx_customers_booking_id").on(table.bookingId),
  }));
  
  // Riders
  export const riders = mysqlTable("riders", {
    id: int("id").primaryKey().autoincrement(),
    bookingId: text("booking_id").notNull(),
    name: text("name").notNull(),
    age: int("age").notNull(),
    weight: int("weight").notNull(),
    experience: text("experience").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  }, (table) => ({
    bookingIdIdx: index("idx_riders_booking_id").on(table.bookingId),
  }));
  
  // Trails
  export const trails = mysqlTable("trails", {
    id: int("id").primaryKey().autoincrement(),
    name: text("name").notNull(),
    duration: text("duration").notNull(),
    distance: text("distance").notNull(),
    difficulty: text("difficulty").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    description: text("description").notNull(),
    maxRiders: int("max_riders").notNull(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  });
  
  // Time Slots
  export const timeSlots = mysqlTable("time_slots", {
    id: int("id").primaryKey().autoincrement(),
    time: text("time").notNull(),
    maxCapacity: int("max_capacity").notNull(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
  });
  
  // Booking Logs
  export const bookingLogs = mysqlTable("booking_logs", {
    id: int("id").primaryKey().autoincrement(),
    bookingId: text("booking_id").notNull(),
    action: text("action").notNull(),
    details: json("details"),
    createdAt: timestamp("created_at").defaultNow(),
  }, (table) => ({
    bookingIdIdx: index("idx_booking_logs_booking_id").on(table.bookingId),
  }));
  