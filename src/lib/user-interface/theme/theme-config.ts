type EnumOrString<T extends EnumItem> = T | T["Name"];

export interface Theme {
	Font: EnumOrString<Enum.Font>;
	FontSize: number;
	PrimaryBackgroundColor3: Color3;
	SecondaryBackgroundColor3: Color3;
	PrimaryTextColor3: Color3;
}

export const defaultTheme: Theme = {
	Font: Enum.Font.Ubuntu,
	FontSize: 14,
	PrimaryBackgroundColor3: Color3.fromRGB(33, 37, 43),
	SecondaryBackgroundColor3: Color3.fromRGB(24, 26, 31),
	PrimaryTextColor3: Color3.fromRGB(230, 230, 230),
};
