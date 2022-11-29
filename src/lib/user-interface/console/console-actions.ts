import { Action } from "@rbxts/rodux";

export enum ConsoleActionName {
	SetConsoleVisible = "SetConsoleVisible",
	AddFlare = "AddFlare",
	FireFlare = "FireFlare",
}

export interface ActionSetConsoleVisible extends Action<ConsoleActionName.SetConsoleVisible> {
	visible: boolean;
}

export interface ActionAddFlare extends Action<ConsoleActionName.AddFlare> {
	eventName: string;
}

export interface ActionFireFlare extends Action<ConsoleActionName.FireFlare> {
	eventName: string;
}

export type ConsoleActions = ActionSetConsoleVisible | ActionAddFlare | ActionFireFlare;
