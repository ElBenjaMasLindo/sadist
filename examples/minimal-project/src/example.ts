import { match } from "ts-pattern";

type Option<T> = { some: true; value: T } | { some: false };
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

function findUser(id: string): Result<{ name: string }, string> {
  if (id.length === 0) {
    return { ok: false, error: "empty id" };
  }
  return { ok: true, value: { name: "example-user" } };
}

const result = findUser("123");
const message: string = match(result)
  .with({ ok: true }, ({ value }) => value.name)
  .with({ ok: false }, ({ error }) => error)
  .exhaustive();
