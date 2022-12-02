import { User } from "../../../user/user";

/**
 * Endpoint insertion for the event types, so we do it and users don't be mad at us for not doing it automatically.
 */
export type ServerEvent<T> = [user: (User & unknown)[], ...args: [...[value: T]]];
