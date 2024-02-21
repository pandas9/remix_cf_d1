import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../db/schema";

export async function allUsers({ context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare as any;
  const db = drizzle(env.DB);
  const result = await db.select().from(users).all();
  return json({ result });
}
