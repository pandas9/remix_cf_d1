import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from "@remix-run/cloudflare";
import { Form, useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../.server/db/schema";
import { eq } from "drizzle-orm";
import { Link } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { MyInput } from "~/components/input";
import { MySubmitButton } from "~/components/submitButton";
import { newUserValidator } from "~/validators/users/validator";

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
    const data = await newUserValidator.validate(await request.formData());
    if (data.error) return validationError(data.error);
    const user = await db.insert(users).values(data.data);
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
      <div className="flex items-center gap-2">
        <Link to="/" prefetch="intent" className="text-blue-600">
          index
        </Link>
        <Link to="/test" prefetch="intent" className="text-blue-600">
          test
        </Link>
      </div>
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
          <ValidatedForm validator={newUserValidator} method="POST">
            <label>Set email</label>
            <MyInput label="email" name="email" />
            <br />
            <label>Set password</label>
            <MyInput label="password" name="password" />
            <br />
            <MySubmitButton>Save</MySubmitButton>
          </ValidatedForm>
        </>
      )}
    </div>
  );
}
