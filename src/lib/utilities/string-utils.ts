export function removeTrailingNewLine(str: string) {
	if (str.sub(-1, -1) === "\n") {
		str = str.sub(0, -2);
	}
	return str;
}

/**
 * Formats a traceback string to be displayed by a Flare tooltip
 * @param str The traceback
 * @returns Formatted string
 */
export function formatFlareTraceback(str: string) {
	str = str.gsub("^.*function oops\n", "")[0]; // Remove Tina.oops from the traceback
	str = str.gsub('%[string "', "[")[0]; // Remove 'string "' from the beginning of the file name
	str = str.gsub('"%]', "]")[0]; // Remove the " at the end of the file name
	str = removeTrailingNewLine(str);
	return str;
}
