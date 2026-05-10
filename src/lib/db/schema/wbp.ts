import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const jenisLayananEnum = pgEnum("jenis_layanan", ["PB", "CB", "CMB", "ASIMILASI"]);

export const tahapProsesEnum = pgEnum("tahap_proses", [
  "verifikasi_rutan",
  "pengusulan_litmas",
  "sidang_tpp_upt",
  "upload_sdp",
  "verifikasi_kanwil",
  "proses_ditjen_pas",
  "sk_terbit",
  "turun_sk",
]);

export const statusWbpEnum = pgEnum("status_wbp", [
  "aktif",
  "selesai",
  "ditolak",
]);

export const wbpTable = pgTable("wbp", {
  id: uuid("id").defaultRandom().primaryKey(),
  nama: varchar("nama", { length: 255 }).notNull(),
  nomorRegistrasi: varchar("nomor_registrasi", { length: 50 }).unique().notNull(),
  kodeTracking: varchar("kode_tracking", { length: 30 }).unique(),
  jenisKelamin: varchar("jenis_kelamin", { length: 10 }),
  tempatLahir: varchar("tempat_lahir", { length: 100 }),
  tanggalLahir: date("tanggal_lahir"),
  nomorHpKeluarga: varchar("nomor_hp_keluarga", { length: 20 }),
  namaKontakKeluarga: varchar("nama_kontak_keluarga", { length: 100 }),
  perkara: varchar("perkara", { length: 255 }),
  alamat: text("alamat"),
  tanggalPelaksanaan: date("tanggal_pelaksanaan"),
  jenisLayanan: jenisLayananEnum("jenis_layanan").notNull(),
  tahapSaatIni: tahapProsesEnum("tahap_saat_ini")
    .notNull()
    .default("verifikasi_rutan"),
  status: statusWbpEnum("status").notNull().default("aktif"),
  catatan: text("catatan"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertWbpSchema = createInsertSchema(wbpTable, {
  nama: z.string().min(1),
  nomorRegistrasi: z.string().min(1),
  jenisLayanan: z.enum(["PB", "CB", "CMB", "ASIMILASI"]),
  tahapSaatIni: z
    .enum([
      "verifikasi_rutan",
      "pengusulan_litmas",
      "sidang_tpp_upt",
      "upload_sdp",
      "verifikasi_kanwil",
      "proses_ditjen_pas",
      "sk_terbit",
      "turun_sk",
    ])
    .optional(),
  status: z.enum(["aktif", "selesai", "ditolak"]).optional(),
}).omit({ id: true, createdAt: true, updatedAt: true });

export const selectWbpSchema = createSelectSchema(wbpTable);

export type InsertWbp = z.infer<typeof insertWbpSchema>;
export type Wbp = typeof wbpTable.$inferSelect;
