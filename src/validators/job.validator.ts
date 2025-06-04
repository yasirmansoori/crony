import { z } from "zod";

export const createJobSchema = z.object({
  name: z.string().min(1, "Name is required"),
  schedule: z
    .string()
    .regex(
      /^(\*|([0-5]?\d)) (\*|([0-5]?\d)) (\*|1?\d|2[0-3]) (\*|[1-9]|[12]\d|3[01]) (\*|[1-9]|1[0-2])$/,
      "Invalid cron expression"
    )
    .or(
      z
        .string()
        .regex(
          /^(\*|\d+|\*\/\d+|\d+(,\d+)*) (\*|\d+|\*\/\d+|\d+(,\d+)*) (\*|\d+|\*\/\d+|\d+(,\d+)*) (\*|\d+|\*\/\d+|\d+(,\d+)*) (\*|\d+|\*\/\d+|\d+(,\d+)*)$/,
          "Invalid cron"
        )
    ),
  message: z.string().min(1, "Message is required"),
});

/**
 * Job validation schemas.
 */
