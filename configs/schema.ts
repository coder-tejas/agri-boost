import { integer, json, pgTable, varchar } from "drizzle-orm/pg-core";
export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),

});
export const userSoilAnalysis = pgTable("userSoilAnalysis",{
    id:integer().primaryKey().generatedAlwaysAsIdentity(),
    soilTestData : varchar(),
    FieldData:json(),
    analysis:json(),
    createdOn:varchar(),
    userEmail:varchar().references(()=>usersTable.email)
})
// export const userChatHistory = pgTable("userChatHistory",{
    
// })