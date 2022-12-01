/// <reference types="@rbxts/testez/globals" />

import { COND } from "..";

export = () => {
	describe("Conditional methods", () => {
		it("should check evaluations correctness", () => {
			expect(COND.eval(COND.AND(true, false))).to.be.equal(false);
			expect(COND.eval(COND.XOR(false, false))).to.be.equal(false);

			expect(COND.eval(() => 5 > 3)).to.be.equal(true);
			expect(COND.eval(false)).never.be.equal(true);
		});
	});
};
