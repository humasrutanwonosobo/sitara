import {
  pgTable,
  uuid,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { wbpTable, tahapProsesEnum } from "@/lib/db/schema/wbp";

export const riwayatStatusTable = pgTable("riwayat_status", {
  id: uuid("id").defaultRandom().primaryKey(),
  wbpId: uuid("wbp_id")
    .notNull()
    .references(() => wbpTable.id, { onDelete: "cascade" }),
  tahap: tahapProsesEnum("tahap").notNull(),
  keterangan: text("keterangan"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertRiwayatSchema = createInsertSchema(riwayatStatusTable).omit({
  id: true,
  createdAt: true,
});

export type InsertRiwayat = z.infer<typeof insertRiwayatSchema>;
export type RiwayatStatus = typeof riwayatStatusTable.$inferSelect;
