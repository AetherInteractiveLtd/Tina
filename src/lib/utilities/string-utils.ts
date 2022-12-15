export function removeTrailingNewLine(str: string): string {
	if (str.sub(-1, -1) === "\n") {
		return str.sub(0, -2);
	}
	return str;
}

/**
 * Formats a traceback string to be displayed by a Flare tooltip
 * @param str The traceback
 * @returns Formatted string
 */
export function formatFlareTraceback(str: string): string {
	let output = str.gsub("^.*function oops\n", "")[0]; // Remove Tina.oops from the traceback
	output = str.gsub('%[string "', "[")[0]; // Remove 'string "' from the beginning of the file name
	output = str.gsub('"%]', "]")[0]; // Remove the " at the end of the file name
	output = removeTrailingNewLine(str);
	return output;
}
