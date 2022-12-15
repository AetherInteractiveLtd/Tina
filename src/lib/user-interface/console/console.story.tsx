import Roact, { Children } from "@rbxts/roact";
import { StoreProvider } from "@rbxts/roact-rodux-hooked";

import Tina from "../../..";
import { ClientStore } from "../store";
import { ThemeProvider } from "../theme/theme";
import Console from "./components/console";

const Wrapper: Roact.FunctionComponent = ({ [Children]: children }) => {
	return (
		<ThemeProvider>
			<StoreProvider store={ClientStore}>{children}</StoreProvider>
		</ThemeProvider>
	);
};

export = (parent: GuiBase2d) => {
	const handle = Roact.mount(
		<Wrapper>
			{/* Pretty picture so I can see how transparent the console is */}
			<imagelabel Size={UDim2.fromScale(1, 1)} Image={"rbxassetid://6284062273"} ScaleType={"Crop"} />
			<Console />
		</Wrapper>,
		parent,
	);

	// Create flares
	Tina.flare("Hello World");
	Tina.flare("Death");
	Tina.flare("Respawn");
	Tina.flare("Eggs and Rice");
	Tina.flare("Remote");
	Tina.flare("Stanky Leg");
	Tina.flare("Lots and lots");
	Tina.flare("Onlytwentycharacters");

	// Fire some flares
	Tina.oops("Hello World");
	Tina.oops("Hello World");
	Tina.oops("Death");
	Tina.oops("Remote");

	return () => {
		Roact.unmount(handle);
	};
};
