import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Site Config (key-value) ──
export const siteConfigTable = pgTable("site_config", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Docs Sections ──
export const docsTable = pgTable("docs", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionTitle: varchar("section_title", { length: 200 }).notNull(),
  items: jsonb("items").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Changelog ──
export const changelogTable = pgTable("changelog", {
  id: uuid("id").defaultRandom().primaryKey(),
  version: varchar("version", { length: 50 }).notNull(),
  date: varchar("date", { length: 100 }).notNull(),
  items: jsonb("items").$type<string[]>().notNull().default([]),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Layanan (Reintegration Programs) ──
export const layananTable = pgTable("layanan", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  desc: text("desc").notNull(),
  color: varchar("color", { length: 100 }).notNull().default("from-teal-500 to-emerald-600"),
  glow: varchar("glow", { length: 100 }).notNull().default("shadow-teal-500/20"),
  dot: varchar("dot", { length: 50 }).notNull().default("bg-teal-400"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Tahapan (Process Steps) ──
export const tahapanTable = pgTable("tahapan", {
  id: uuid("id").defaultRandom().primaryKey(),
  num: varchar("num", { length: 10 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  sub: varchar("sub", { length: 200 }).notNull(),
  desc: text("desc").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Features (Keunggulan, How-to, Hero stats, etc.) ──
export const featuresTable = pgTable("features", {
  id: uuid("id").defaultRandom().primaryKey(),
  section: varchar("section", { length: 50 }).notNull(),
  data: jsonb("data").notNull().default({}),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Zod Schemas ──
export const insertSiteConfigSchema = z.object({
  key: z.string().min(1).max(100),
  value: z.record(z.string(), z.unknown()).or(z.string()).or(z.number()).or(z.boolean()).or(z.array(z.unknown())),
});

export const insertDocsSchema = createInsertSchema(docsTable, {
  sectionTitle: z.string().min(1),
  items: z.array(z.string()),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).omit({ id: true, updatedAt: true });

export const insertChangelogSchema = createInsertSchema(changelogTable, {
  version: z.string().min(1),
  date: z.string().min(1),
  items: z.array(z.string()),
  isPublished: z.boolean().optional(),
}).omit({ id: true, createdAt: true });

export const insertLayananSchema = createInsertSchema(layananTable, {
  code: z.string().min(1),
  label: z.string().min(1),
  desc: z.string().min(1),
  color: z.string().optional(),
  glow: z.string().optional(),
  dot: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).omit({ id: true, updatedAt: true });

export const insertTahapanSchema = createInsertSchema(tahapanTable, {
  num: z.string().min(1),
  title: z.string().min(1),
  sub: z.string().min(1),
  desc: z.string().min(1),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).omit({ id: true, updatedAt: true });

export const insertFeaturesSchema = createInsertSchema(featuresTable, {
  section: z.string().min(1),
  data: z.any(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).omit({ id: true, updatedAt: true });

// ── Types ──
export type SiteConfig = typeof siteConfigTable.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;

export type Docs = typeof docsTable.$inferSelect;
export type InsertDocs = z.infer<typeof insertDocsSchema>;

export type Changelog = typeof changelogTable.$inferSelect;
export type InsertChangelog = z.infer<typeof insertChangelogSchema>;

export type Layanan = typeof layananTable.$inferSelect;
export type InsertLayanan = z.infer<typeof insertLayananSchema>;

export type Tahapan = typeof tahapanTable.$inferSelect;
export type InsertTahapan = z.infer<typeof insertTahapanSchema>;

export type Features = typeof featuresTable.$inferSelect;
export type InsertFeatures = z.infer<typeof insertFeaturesSchema>;
