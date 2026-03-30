import { z } from "zod";

export const bookingSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
});