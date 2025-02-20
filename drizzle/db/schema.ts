import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const userRoleEnum = pgEnum('user_role', ['SUPERADMIN', 'HUBADMIN', 'HUBMANAGER', 'USER']);
export const kycDocumentsEnum = pgEnum('kyc_documents', ['AADHAR', 'PAN', 'DRIVING_LICENSE', 'VOTER_ID', 'PASSPORT']);

// Users table
export const users = pgTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    password: text('password').notNull(),
    role: userRoleEnum('role').default('USER').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Hubs table
export const hubs = pgTable('hubs', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    pincode: text('pincode').notNull(),
    hubAdminId: text('hub_admin_id')
        .references(() => users.id)
        .notNull(),
    kycstatus: boolean('kyc_status').default(false).notNull(),
    kycdoc: kycDocumentsEnum('kyc_doc').notNull(),
    kycdocurl: text('kyc_doc_url').notNull(),
    referencenos: text('reference_nos').array().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Reference Numbers table
export const referenceNumbers = pgTable('reference_numbers', {
    id: text('id').primaryKey(),
    prefix: text('prefix').notNull(),
    start: text('start').notNull(),
    end: text('end').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
});