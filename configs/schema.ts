import { integer, json, pgTable, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const subscriptions = pgTable("subscriptions", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userEmail: varchar({ length: 255 }).notNull().references(() => usersTable.email).unique(),
    razorpayCustomerId: varchar({ length: 255 }),
    razorpaySubscriptionId: varchar({ length: 255 }),
    plan: varchar({ length: 50 }).notNull().default("free"),
    status: varchar({ length: 50 }).notNull().default("active"),
    currentPeriodEnd: varchar({ length: 255 }),
    createdAt: varchar({ length: 255 }).notNull().default("NOW()"),
});

export const usageLogs = pgTable("usage_logs", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userEmail: varchar({ length: 255 }).notNull().references(() => usersTable.email),
    feature: varchar({ length: 100 }).notNull(),
    count: integer().notNull().default(0),
    month: varchar({ length: 7 }).notNull(),
}, (table) => [
    uniqueIndex("usage_logs_user_feature_month_idx").on(table.userEmail, table.feature, table.month),
]);

export const userSoilAnalysis = pgTable("userSoilAnalysis",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    soilTestData : varchar(),
    FieldData:json(),
    analysis:json(),
    createdOn:varchar(),
    userEmail:varchar().references(()=>usersTable.email),
    eventId: varchar({ length: 255 }),
})