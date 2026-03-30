import { z } from "zod";

export const eventSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  event_date: z.string().datetime(),
  total_capacity: z.number().min(1),
});