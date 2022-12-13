import Roact from "@rbxts/roact";
import { useBinding, useEffect, useRef, withHooks } from "@rbxts/roact-hooked";
import { UDim2ToAbsolute } from "../../../utilities/ui";
import Padding from "../../common/padding";
import { useTheme } from "../../theme/theme";
import Modal from "./modal";

interface TooltipProps {
	Message?: string;
	Position?: UDim2;
}

const Tooltip = withHooks(({ Message, Position = new UDim2() }: TooltipProps) => {
	const theme = useTheme();
	const labelRef = useRef<TextLabel>();
	const [labelPosition, setLabelPosition] = useBinding(Position);

	// Reposition the tooltip within the bounds of the Modal (screen)
	useEffect(() => {
		const label = labelRef.getValue()!;
		const parent = label.Parent as GuiBase2d;

		const constrainToWindow = () => {
			const maxSize = parent.AbsoluteSize;
			const size = label.AbsoluteSize;
			const targetPosition = UDim2ToAbsolute(Position, maxSize);

			const constrainX = () => {
				const max = maxSize.X;
				const min = 0;
				return math.clamp(targetPosition.X, min, math.max(max - size.X, min));
			};

			setLabelPosition(UDim2.fromOffset(constrainX(), targetPosition.Y));
		};

		const connection = parent.GetPropertyChangedSignal("AbsoluteSize").Connect(constrainToWindow);
		constrainToWindow();

		return () => {
			connection.Disconnect();
		};
	}, []);

	return (
		<Modal>
			<textlabel
				Ref={labelRef}
				Text={Message}
				TextSize={theme.FontSize}
				Font={theme.Font}
				TextColor3={theme.PrimaryTextColor3}
				BackgroundColor3={theme.PrimaryBackgroundColor3}
				BorderColor3={theme.SecondaryBackgroundColor3}
				AutomaticSize={"XY"}
				Position={labelPosition}
				TextXAlignment={"Left"}
			>
				<Padding All={3} />
			</textlabel>
		</Modal>
	);
});

export default Tooltip;
