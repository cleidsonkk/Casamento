import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().min(3).max(120),
  status: z.enum(["YES", "NO"]),
  companions: z.coerce.number().int().min(0).max(10).default(0),
  message: z.string().max(300).optional(),
  passcode: z.string().max(64).optional(),
  hp: z.string().max(200).optional(),
});

export const orderSchema = z.object({
  weddingGiftId: z.string().min(8),
  giverName: z.string().min(3).max(120),
  message: z.string().max(300).optional(),
  hp: z.string().max(1).optional(),
});

export const paySchema = z.object({
  note: z.string().max(200).optional(),
});

export const csvGuestSchema = z.object({
  fullName: z.string().min(3),
  maxCompanions: z.coerce.number().int().min(0).max(10).default(0),
  passcode: z.string().optional(),
});

export const registerSchema = z.object({
  yourName: z.string().min(3).max(120),
  partnerName: z.string().min(3).max(120),
  email: z.string().email().max(180),
  password: z.string().min(6).max(80),
});

export const dashboardGuestSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  maxCompanions: z.coerce.number().int().min(0).max(10).default(0),
  passcode: z.string().trim().max(64).optional().nullable(),
});

export const dashboardPixSchema = z.object({
  pixKey: z.string().trim().min(3).max(180),
  receiverName: z.string().trim().min(3).max(80),
  city: z.string().trim().min(2).max(40),
  txidPrefix: z.string().trim().min(2).max(10),
  enabled: z.boolean().default(true),
});

export const dashboardGiftItemSchema = z.object({
  catalogItemId: z.string().min(8),
  active: z.boolean(),
  priceCents: z.coerce.number().int().min(100).max(50_000_000),
  giftMode: z.enum(["UNIQUE", "REPEATABLE"]),
});

export const dashboardGiftsSchema = z.object({
  items: z.array(dashboardGiftItemSchema).max(500),
});

export const dashboardOrderConfirmSchema = z.object({
  status: z.enum(["PAID", "CANCELED"]),
});
