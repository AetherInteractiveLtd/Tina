import { ALL } from "./query";
import { World } from "./world";

export type System = () => void;

export const defineSystem = (update: (world: World, args: Array<unknown>) => void) => (): void => {};

export class SystemManager {
	private systems: Array<System> = [];

	public start(): void {}

	public scheduleSystem(system: System): void {
		this.systems.push(system);
	}

	public endSystem(): void {}
}

const Position = {};

export default function createMovementSystem(world: World): () => void {
	const position = world.defineComponent(Position);
	const query = world.createQuery(ALL(position));

	return defineSystem(() => {
		query.forEach(entityId => {
			print(entityId);
		});
	});
}
