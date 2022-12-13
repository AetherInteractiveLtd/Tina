import Roact from "@rbxts/roact";
import { withHooksPure } from "@rbxts/roact-hooked";
import { useTheme } from "../../theme/theme";
import { FlareBar } from "./flare-bar";

interface Props {}

const Header = withHooksPure((props: Props) => {
	const theme = useTheme();

	return (
		<frame
			Size={new UDim2(1, 0, 0, 72)}
			BackgroundColor3={theme.PrimaryBackgroundColor3}
			BorderColor3={theme.SecondaryBackgroundColor3}
		>
			<FlareBar Position={UDim2.fromScale(0, 1)} AnchorPoint={new Vector2(0, 1)} />
		</frame>
	);
});

export default Header;
