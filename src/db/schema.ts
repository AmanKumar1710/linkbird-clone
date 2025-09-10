import { pgTable, varchar, text, integer, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import type { AdapterAccount } from "next-auth/adapters";

// Extended users table for NextAuth + custom password auth
export const users = pgTable("user", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  // Additional fields for custom password authentication
  passwordHash: text("passwordHash"), // for custom password auth
  firstName: text("firstName"),
  lastName: text("lastName"),
});

export const accounts = pgTable(
  "account",
  {
    userId: varchar("userId", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// Your application tables
export const campaigns = pgTable("campaigns", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("Active"),
  totalLeads: integer("total_leads").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const leads = pgTable("leads", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }),
  company: text("company"),
  campaignId: varchar("campaign_id", { length: 128 }),
  status: varchar("status", { length: 50 }).default("Pending Approval"),
  lastContactDate: timestamp("last_contact_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id", { length: 128 }).primaryKey().$defaultFn(() => createId()),
  leadId: varchar("lead_id", { length: 128 }).references(() => leads.id),
  leadName: text("lead_name"),
  campaignName: text("campaign_name"),
  status: varchar("status", { length: 50 }),
  activityType: varchar("activity_type", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});
