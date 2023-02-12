import { createReducer } from "@rbxts/rodux";

import { IFlare } from "../../types/common";
import { updateAtIndex } from "../../utilities/rodux-utils";
import { ConsoleActions } from "./console-actions";

export interface ConsoleReducer {
	visible: boolean;
	flares: Array<IFlare>;
}

const initialState: ConsoleReducer = {
	visible: false,
	flares: [],
};

export const consoleReducer = createReducer<ConsoleReducer, ConsoleActions>(initialState, {
	SetConsoleVisible: (state, action) => ({ ...state, visible: action.visible }),

	AddFlare: (state, action) => {
		const { eventName } = action;
		const { flares } = state;

		// Check for duplicate flares
		const flareExists = flares.find(f => f.eventName === eventName);
		if (flareExists !== undefined) return state;

		// Create new flare and add to state
		return {
			...state,
			flares: [...flares, { eventName, amount: 0 }],
		};
	},

	FireFlare: (state, action) => {
		// Get the index of the flare
		const flareIndex = state.flares.findIndex(f => f.eventName === action.eventName);

		// Increment the amount of times the flare has been called
		return {
			...state,
			flares: updateAtIndex(state.flares, flareIndex, flare => ({
				...flare,
				amount: flare.amount + 1,
				message: action.message,
			})),
		};
	},
});
