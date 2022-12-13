export type IFlare = { eventName: string; amount: number; message?: string };
export type EnumOrName<T extends EnumItem> = T | T["Name"];
