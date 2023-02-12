import { Store } from "@rbxts/rodux";

import { ConsoleActions } from "./console/console-actions";
import { ConsoleReducer, consoleReducer } from "./console/console-reducer";

export type StoreState = ConsoleReducer;
type StoreActions = ConsoleActions;

export const ClientStore = new Store<StoreState, StoreActions>(consoleReducer);
export type ClientStore = typeof ClientStore;
