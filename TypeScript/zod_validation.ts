import { z } from "zod";

const AddressSchema = z.object({
  street: z.string().min(5),
  city: z.string(),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code"),
});

const UserSchema = z.object({
  id: z.number().positive(),
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).max(120).optional(),
  role: z.enum(["admin", "user", "moderator"]),
  address: AddressSchema.optional(),
});

type User = z.infer<typeof UserSchema>;

function validateUser(data: unknown): User {
  return UserSchema.parse(data);
}

try {
  const u = validateUser({
    id: 1, name: "Alice", email: "alice@test.com", role: "admin"
  });
  console.log("Valid user:", u);

  // This should throw
  validateUser({ id: -1, name: "X", email: "bad-email", role: "unknown" });
} catch (e) {
  console.error("Validation failed:", e);
}
