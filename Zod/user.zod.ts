import { z } from "zod";

export const UserObject = z.object({
  username: z.string().min(1, "Please provide the username"),
  password: z.string().min(8, "Password must be 8 charaters long"),
});
