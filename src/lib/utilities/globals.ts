import { RunService } from "@rbxts/services";

export const IS_CLIENT = RunService.IsClient() && RunService.IsRunning();
export const IS_SERVER = RunService.IsServer() || !RunService.IsRunning();
