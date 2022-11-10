/// <reference types="@rbxts/testez/globals" />

import { X } from "@rbxts/tina";

export = () => {
	describe("Conditional methods", () => {
		it("should check evaluations correctness", () => {
			expect(X.eval(X.and(true, false))).to.be.equal(false);
			expect(X.eval(X.xor(false, false))).to.be.equal(false);

			expect(X.eval(() => 5 > 3)).to.be.equal(true);
			expect(X.eval(false)).never.be.equal(true);
		});
	});
};
