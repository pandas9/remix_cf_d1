import { Form, useLoaderData } from "@remix-run/react";
import { newUser } from "../.server/api/users/newUser";
import { allUsers } from "../.server/api/users/allUsers";

export const loader = allUsers;
export const action = newUser;

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
