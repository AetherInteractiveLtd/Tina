/// <reference types="@rbxts/testez/globals" />

import { X } from "..";

export = () => {
	describe("Conditional methods", () => {
		it("should check evaluations correctness", () => {
			expect(X.EVAL(X.AND(true, false))).to.be.equal(false);
			expect(X.EVAL(X.XOR(false, false))).to.be.equal(false);

			expect(X.EVAL(() => 5 > 3)).to.be.equal(true);
			expect(X.EVAL(false)).never.be.equal(true);
		});
	});
};
