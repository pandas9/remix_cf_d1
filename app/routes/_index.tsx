import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../.server/db/schema";
import { eq } from "drizzle-orm";

export async function loader({ context }: LoaderFunctionArgs) {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);
  const result = await db.select().from(users).all();
  return json({ result });
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);

  if (request.method === "POST") {
    const formData = await request.formData();
    const user = await db.insert(users).values({
      email: "test@test.com",
      password: "test",
    });
    return null;
  }

  if (request.method === "DELETE") {
    await db.delete(users).where(eq(users.email, "test@test.com"));
    return null;
  }

  throw new Error(`Method not supported: "${request.method}"`);
}

export default function Index() {
  const { result } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Welcome to Remix</h1>
      {result.length > 0 ? (
        <>
          <p>Value: {result[0]?.email}</p>
          <Form method="DELETE">
            <button>Delete</button>
          </Form>
        </>
      ) : (
        <>
          <p>No value</p>
          <Form method="POST">
            <label htmlFor="value">Set value: </label>
            <input type="text" name="value" id="value" required />
            <br />
            <button>Save</button>
          </Form>
        </>
      )}
    </div>
  );
}
