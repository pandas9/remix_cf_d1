import { Form, useLoaderData } from "@remix-run/react";
import { newUser } from "../.server/api/users/newUser";
import { allUsers } from "../.server/api/users/allUsers";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export const loader = allUsers;
export const action = newUser;

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
        <span>which one</span>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
        <span>this one</span>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
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
