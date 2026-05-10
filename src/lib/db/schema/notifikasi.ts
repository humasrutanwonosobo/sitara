import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { wbpTable } from "@/lib/db/schema/wbp";

export const logNotifikasiTable = pgTable("log_notifikasi", {
  id: uuid("id").defaultRandom().primaryKey(),
  wbpId: uuid("wbp_id")
    .notNull()
    .references(() => wbpTable.id, { onDelete: "cascade" }),
  nomorHp: varchar("nomor_hp", { length: 20 }).notNull(),
  pesan: text("pesan").notNull(),
  statusKirim: varchar("status_kirim", { length: 20 }).default("pending").notNull(),
  responseApi: jsonb("response_api"),
  sentAt: timestamp("sent_at", { withTimezone: true }).defaultNow().notNull(),
});

export type LogNotifikasi = typeof logNotifikasiTable.$inferSelect;
