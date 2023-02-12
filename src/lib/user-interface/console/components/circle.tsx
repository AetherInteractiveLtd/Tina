import Roact, { JsxInstanceProperties } from "@rbxts/roact";
import { withHooks } from "@rbxts/roact-hooked";

type CircleProps = JsxInstanceProperties<Frame>;

const Circle = withHooks((props: CircleProps) => {
	return (
		<frame {...props}>
			<uicorner CornerRadius={new UDim(1, 0)} />
			<uiaspectratioconstraint AspectRatio={1} />
		</frame>
	);
});

export default Circle;
