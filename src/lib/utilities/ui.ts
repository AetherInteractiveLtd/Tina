export function UDim2ToAbsolute(udim2: UDim2, size: Vector2): Vector2 {
	const x = udim2.X.Scale * size.X + udim2.X.Offset;
	const y = udim2.Y.Scale * size.X + udim2.Y.Offset;
	return new Vector2(x, y);
}
