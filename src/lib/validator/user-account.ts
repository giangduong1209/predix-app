import { z } from "zod";

/**
 * * Define validator for object
 */

export const createUserAccountValidator = z.object({
  address: z.string(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string(),
  phone: z.string(),
  ref: z.string(),
});

export type UserAccount = z.infer<typeof createUserAccountValidator>;
