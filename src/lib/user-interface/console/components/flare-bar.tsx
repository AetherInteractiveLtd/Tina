import Roact, { JsxInstanceProperties } from "@rbxts/roact";
import { useCallback, useState, withHooks } from "@rbxts/roact-hooked";
import { useSelector } from "@rbxts/roact-rodux-hooked";

import { IFlare } from "../../../types/common";
import Padding from "../../common/padding";
import { StoreState } from "../../store";
import Flare from "./flare";

type FlareBarProps = Partial<Pick<JsxInstanceProperties<Frame>, "Position" | "AnchorPoint" | "Size">>;

export const FlareBar = withHooks((props: FlareBarProps) => {
	const { Size = new UDim2(1, 0, 0, 36) } = props;
	const flares = useSelector((state: StoreState) => state.flares);
	const [selected, setSelected] = useState<IFlare | undefined>();

	const handleClick = useCallback((flare: IFlare) => {
		setSelected(selected => {
			if (flare.amount === 0) return;
			return flare === selected ? undefined : flare;
		});
	}, []);

	return (
		<scrollingframe
			Size={Size}
			Position={props.Position}
			AnchorPoint={props.AnchorPoint}
			BackgroundTransparency={1}
			CanvasSize={new UDim2(1, 0, 0, 36)}
			AutomaticCanvasSize={"X"}
			ScrollingDirection={"X"}
			ScrollBarThickness={0}
		>
			<uilistlayout
				FillDirection={"Horizontal"}
				HorizontalAlignment={"Left"}
				VerticalAlignment={"Center"}
				Padding={new UDim(0, 4)}
			/>
			<Padding Horizontal={3} />
			{flares.map((flare, i) => (
				<Flare Key={i} Info={flare} Selected={flare === selected} OnClick={handleClick} />
			))}
		</scrollingframe>
	);
});
