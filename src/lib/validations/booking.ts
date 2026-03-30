import { z } from "zod";

export const createBookingSchema = z.object({
  characterId: z.string().min(1),
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Please provide at least 20 characters of description").max(2000),
  requirements: z.string().max(1000).optional(),
  timeline: z.string().min(1, "Please select a timeline"),
  budgetAmount: z.number().positive("Budget must be a positive number").min(1),
  pricingTierId: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
