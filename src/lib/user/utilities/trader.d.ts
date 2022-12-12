export namespace Trader {
	export function getShop(
		shopKey: string,
		template: {},
	): {
		subscribeCustomer(key: string): { data: { [x: string]: unknown } };
	};
}
