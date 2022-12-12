import Roact, { Children } from "@rbxts/roact";
import { useContext } from "@rbxts/roact-hooked";
import { defaultTheme, Theme } from "./theme-config";

export const ThemeContext = Roact.createContext<Theme>(defaultTheme);

export const ThemeProvider: Roact.FunctionComponent = ({ [Children]: children }) => {
	return <ThemeContext.Provider value={defaultTheme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
