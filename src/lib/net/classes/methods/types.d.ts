/**
 * Endpoint insertion for the event types, so we do it and users don't be mad at us for not doing it automatically.
 */
export type ServerEvent<T> = [user: never, ...args: [...[value: T]]];
