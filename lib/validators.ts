import { z } from "zod";

export const rsvpSchema = z.object({
  name: z.string().min(3).max(120),
  status: z.enum(["YES", "NO"]),
  companions: z.number().int().min(0).max(10).default(0),
  message: z.string().max(300).optional(),
  passcode: z.string().max(20).optional(),
  hp: z.string().max(1).optional(),
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

