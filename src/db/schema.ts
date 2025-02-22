import { sql } from "drizzle-orm";
import { text, SQLiteBoolean, sqliteTable, integer, blob } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    role: text('role', { enum: ['SUPERADMIN', 'HUBADMIN', 'HUBMANAGER', 'USER'] }).default('USER').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull()
});

// Hubs table
export const hubs = sqliteTable('hubs', {
    id: text('id').primaryKey(),
    name: text('name'),
    address: text('address').notNull(),
    pincode: text('pincode').notNull(),
    hubAdminId: text('hub_admin_id')
        .references(() => users.id)
        .notNull(),
    kycstatus: integer({ mode: 'boolean' }).notNull(),
    kycdoc: text('kyc_docs', { enum: ['AADHAR', 'PAN', 'DRIVING_LICENSE', 'VOTER_ID', 'PASSPORT'] }).notNull(),
    kycdocurl: text('kyc_doc_url').notNull(),
    referencenos: blob({ mode: 'json' }).$type<string[]>().notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull()
});

// Reference Numbers table
export const referenceNumbers = sqliteTable('reference_numbers', {
    id: text('id').primaryKey(),
    prefix: text('prefix').notNull(),
    start: text('start').notNull(),
    end: text('end').notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull()
});