import Roact from "@rbxts/roact";
import { Button, Div, Span } from "@rbxts/rowind-mini";
import { RunService, TextService, UserInputService, Workspace } from "@rbxts/services";

import { Logger } from "../logger";

export namespace ConsoleConfig {
	export function addReservedColor(scope: string, rgb: Color3): typeof ConsoleConfig {
		RESERVED_COLORS[scope] =
			`rgb(${math.floor(rgb.R * 255)}` +
			`,${math.floor(rgb.G * 255)},` +
			`${math.floor(rgb.B * 255)})`;
		return ConsoleConfig;
	}

	let tree: Roact.Tree;
	let setVisible: (visible: boolean) => void;

	export function startConsole(parent: Instance): void {
		tree = Roact.mount(
			<screengui DisplayOrder={9999}>
				<Console
					getSetVisible={(_setVisible): void => {
						setVisible = _setVisible;
					}}
				/>
			</screengui>,
			parent,
		);
	}

	export function showConsole(): void {
		setVisible(true);
	}

	export function hideConsole(): void {
		setVisible(false);
	}

	export function deconstructConsole(): void {
		Roact.unmount(tree);
	}
}

function getTimeString(): string {
	return os.date("%X.") + string.format(`%d`, os.time() % 1000);
}

const RESERVED_COLORS: { [key: string]: string } = {
	TINA: "rgb(89,181,232)",
};

const LEVEL_COLORS = {
	[0]: "rgb(255,255,255)",
	[1]: "rgb(255,150,0)",
	[2]: "rgb(255,110,140)",
	[3]: "rgb(255,30,30)",
};

const LEVEL_NAMES = {
	[0]: "INFO",
	[1]: "WARN",
	[2]: "DEBUG",
	[3]: "ERROR",
};

const FUNCTIONAL_LEVEL_COLORS = {
	[0]: [false, undefined],
	[1]: [true, "orange-500"],
	[2]: [true, "pink-500"],
	[3]: [true, "red-500"],
};

function getStackIdentifier(scopeStack: Array<string>): string {
	return (
		`<font color="rgb(180,180,180)">[</font>` +
		scopeStack
			.map(v =>
				v in RESERVED_COLORS
					? `<font color="${
							RESERVED_COLORS[v as keyof typeof RESERVED_COLORS]
					  }">${v}</font>`
					: `<font color="rgb(100,255,100)">${v}</font>`,
			)
			.join(`<font color="rgb(180,180,180)">/</font>`) +
		`<font color="rgb(180,180,180)">]</font>`
	);
}

function writeFormat(level: 0 | 1 | 2 | 3, scope: Array<string>, message: string): string {
	return (
		`<font color="rgb(170,170,170)">${getTimeString()}</font> - ` +
		getStackIdentifier(scope) +
		` <font color="${LEVEL_COLORS[level]}">${message}</font>`
	);
}

function getBounds(text: string, font: Font, size: number, width: number): Vector2 {
	const params = new Instance("GetTextBoundsParams");
	params.Text = text;
	params.Font = font;
	params.Size = size;
	params.Width = width;

	const bounds = TextService.GetTextBoundsAsync(params);

	return bounds;
}

export class Console extends Roact.Component<
	{ getSetVisible: (setVisible: (visible: boolean) => void) => void },
	{}
> {
	private isResizing = false;

	public visible = true;

	private portionOfScreen = 100;

	constructor(props: { getSetVisible: (setVisible: (visible: boolean) => void) => void }) {
		super(props);
	}

	public consoleMessages: Array<[0 | 1 | 2 | 3, string, string]> = [];

	public render(): Roact.Element {
		const flareData: Array<string> = ["B", "Beans", "Woop Woop Fuckers"];

		return this.visible ? (
			<></>
		) : (
			<Div
				className={`anchor-0-1 y-100% w-100% h-${
					this.portionOfScreen * 0.01 * (Workspace.CurrentCamera?.ViewportSize.Y ?? 0) >
					30
						? this.portionOfScreen + "%"
						: "30"
				} bg-transparent`}
			>
				<Div
					Key="ConsoleFeed"
					className="w-100% bg-slate-800 h-100% h--30px bg-0.2 y-30px flex-left-bottom padding-4 clip"
				>
					{this.consoleMessages.map(x => {
						if (typeIs(x, "table")) {
							return (
								<Div className="w-100% h-19px bg-transparent">
									<Span
										Text={LEVEL_NAMES[x[0]]}
										className={`w-60px h-100% bg-${
											FUNCTIONAL_LEVEL_COLORS[x[0]][1] ?? "white"
										} text-${
											x[0] > 0 ? "white" : "black"
										} text-18 align-center text-RobotoMono border-0`}
									></Span>
									<Span
										Text={x[1]}
										className={`w-100% w--64px x-64px h-100% text-18 text-RobotoMono text-white bg-0.8 bg-${
											FUNCTIONAL_LEVEL_COLORS[x[0]][1] ?? "transparent"
										} richtext`}
									></Span>
									<Span
										Text={x[2]}
										className={`w-100% w--60px h-100% anchor-1-0 x-100% text-18 text-Sono text-gray-300 bg-transparent richtext align-right`}
									></Span>
								</Div>
							);
						} else {
							return (
								<Span
									Text={x}
									className="w-100% h-19px text-18 text-RobotoMono text-white bg-transparent richtext"
								></Span>
							);
						}
					})}
				</Div>
				<Div
					Key="FlareStore"
					className="w-100% bg-gray-900 padding-2-0-0-0 border-0 h-30px"
					mouseDown={(): void => {
						this.isResizing = true;
					}}
					mouseUp={(): void => {
						this.isResizing = false;
					}}
				>
					<Div className="w-100% h-100% bg-transparent flex-left-center offset-4 direction-horizontal">
						{flareData.map(x => (
							<Div
								className={`w-${
									getBounds(x, Font.fromId(12187374537), 16, 2000).X + 53
								} bg-gray-800 h-24px text-10 rounded-10`}
							>
								<Div className="w-18px h-18px x-3 y-3 bg-red-200 rounded-11" />
								<Span
									Text={x}
									className={`bg-transparent text-white text-16 h-22px w-75 x-26px text-Sono`}
								/>
								<Span
									Text={"x1"}
									className="text-gray-200 anchor-1-0 w-20 h-20 y-2 x-100% text-Code bg-transparent text-14 text-right"
								/>
							</Div>
						))}
					</Div>
					<Button
						Key={"IAmYourButton"}
						className="w-20 h-20 bg-red-100 anchor-0-0 x-50% y-10 text-white text-20"
						Text="X"
					></Button>
				</Div>
			</Div>
		);
	}

	private connection?: RBXScriptConnection;
	protected didMount(): void {
		this.connection = RunService.PreRender.Connect(() => {
			if (this.isResizing) {
				this.portionOfScreen =
					100 -
					(UserInputService.GetMouseLocation().Y /
						Workspace.CurrentCamera!.ViewportSize.Y) *
						100;
				this.setState({});
			}
		});

		Logger.consumeAll((severity, message, source, scopeStack) => {
			this.consoleMessages.push([
				severity as 0 | 1 | 2 | 3,
				writeFormat(severity as 0 | 1 | 2 | 3, scopeStack, message),
				source,
			]);
			this.setState({});
		});

		this.props.getSetVisible((visible: boolean) => {
			this.visible = visible;
			this.setState({});
		});
	}

	protected willUnmount(): void {
		this.connection?.Disconnect();
	}
}
