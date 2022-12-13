import Roact, { Element } from "@rbxts/roact";
import { useRef, withHooksPure } from "@rbxts/roact-hooked";
import { TextService } from "@rbxts/services";
import { IFlare } from "../../../types/common";
import { getAbsolutePosition } from "../../../utilities/hoarcekat";
import Padding from "../../common/padding";
import { useTheme } from "../../theme/theme";
import Circle from "./circle";
import Tooltip from "./tooltip";

interface Props {
	Info: IFlare;
	Selected: boolean;
	OnClick: (flare: IFlare) => void;
}

const Flare = withHooksPure(({ Info, Selected, OnClick }: Props) => {
	const { eventName, amount, message } = Info;
	const theme = useTheme();
	const buttonRef = useRef<TextButton>();

	const text = `${eventName} ${amount}x`;
	const textSize = TextService.GetTextSize(text, theme.FontSize, theme.Font, new Vector2(math.huge, math.huge));
	const circleColour = amount > 0 ? Color3.fromRGB(255, 18, 18) : Color3.fromRGB(18, 18, 255);

	let tooltip: Element | undefined = undefined;
	if (Selected) {
		const button = buttonRef.getValue()!;
		const { X: positionX, Y: positionY } = getAbsolutePosition(button);
		const { Y: sizeY } = button.AbsoluteSize;
		const tooltipPosition = UDim2.fromOffset(positionX - 3, positionY + sizeY + 8);
		tooltip = <Tooltip Message={message} Position={tooltipPosition} />;
	}

	return (
		<textbutton
			Ref={buttonRef}
			Size={UDim2.fromOffset(textSize.X, 30)}
			AutomaticSize={"X"}
			Text=""
			BackgroundColor3={theme.SecondaryBackgroundColor3}
			Event={{
				Activated: () => OnClick(Info),
			}}
		>
			<Padding Horizontal={7} />
			<uicorner CornerRadius={new UDim(0.4, 0)} />
			<uilistlayout FillDirection={"Horizontal"} VerticalAlignment={"Center"} Padding={new UDim(0, 4)} />
			<Circle Size={UDim2.fromOffset(10, 10)} BackgroundColor3={circleColour} />
			<textlabel
				TextColor3={new Color3(0.9, 0.9, 0.9)}
				Text={text}
				Font={theme.Font}
				TextSize={theme.FontSize}
				Size={UDim2.fromOffset(textSize.X, 32)}
				BackgroundTransparency={1}
			/>
			<uistroke Color={theme.PrimaryTextColor3} Thickness={Selected ? 1 : 0} ApplyStrokeMode={"Border"} />
			{tooltip}
		</textbutton>
	);
});

export default Flare;
