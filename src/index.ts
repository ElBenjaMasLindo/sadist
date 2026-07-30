export type Option<T> = { some: true; value: T } | { some: false };

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
