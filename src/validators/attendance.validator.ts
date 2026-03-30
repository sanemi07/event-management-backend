import { z } from "zod";

export const attendanceSchema = z.object({
  booking_code: z.string(),
});