import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import { validationError } from "remix-validated-form";
import { newUserValidator } from "~/validators/users/validator";

export async function newUser({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare as any;
  const db = drizzle(env.DB);

  if (request.method === "POST") {
    const result = await newUserValidator.validate(await request.formData());

    if (result.error) {
      // validationError comes from `remix-validated-form`
      return validationError(result.error);
    }
    const user = await db.insert(users).values({
      email: "test@test.com",
      password: "test",
    });
    return null;
  }

  /*
  if (request.method === "DELETE") {
    await db.delete(users).where(eq(users.email, "test@test.com"));
    return null;
  }
  */

  throw new Error(`Method not supported: "${request.method}"`);
}
