import Roact from "@rbxts/roact";

interface Props {
	All?: number;
	Horizontal?: number;
	Vertical?: number;
	Top?: number;
	Bottom?: number;
	Left?: number;
	Right?: number;
}

const Padding: Roact.FunctionComponent<Props> = ({
	All = 0,
	Horizontal = 0,
	Vertical = 0,
	Top = 0,
	Bottom = 0,
	Right = 0,
	Left = 0,
}: Props) => {
	return (
		<uipadding
			PaddingBottom={new UDim(0, Bottom + Vertical + All)}
			PaddingTop={new UDim(0, Top + Vertical + All)}
			PaddingLeft={new UDim(0, Left + Horizontal + All)}
			PaddingRight={new UDim(0, Right + Horizontal + All)}
		/>
	);
};

export default Padding;
