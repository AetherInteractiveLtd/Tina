import { Store } from "@rbxts/rodux";
import { consoleReducer } from "./console/console-reducer";

export const ClientStore = new Store(consoleReducer);
