import Sift from "@rbxts/sift";
import Tina from "@rbxts/tina";
import { ComponentInternal, ComponentTypes, GetComponentSchema } from "@rbxts/tina/out/lib/ecs/component";
import { getNextComponentId, internal_resetGlobalState } from "@rbxts/tina/out/lib/ecs/entity-manager";
import { EntityId } from "@rbxts/tina/out/lib/types/ecs";

interface Profiler {
	Begin: (arg: string) => void;
	End: () => void;
}

const N = 9999;

type TempComp<T extends object> = Map<EntityId, T> & {
	readonly componentId: number;
	setter<U extends Partial<T>>(entityId: EntityId, data: U): void;
	setter1<U extends Partial<T>>(entityId: EntityId, data: U): void;
};

function createNewComponent<T extends object>(schema: T): TempComp<T> {
	const componentData: Map<EntityId, T> = new Map();

	for (const i of $range(0, N)) {
		// if (i % 5 === 0) {
		componentData.set(i, schema);
		// } else {
		// 	componentData.set(i, {} as T);
		// }
	}

	return Sift.Dictionary.merge(componentData, {
		componentId: getNextComponentId(),

		setter<U extends Partial<T>>(entityId: EntityId, data: U): void {
			const entityData = componentData[entityId as never];
			// eslint-disable-next-line roblox-ts/no-array-pairs
			for (const [key, value] of pairs(data)) {
				entityData[key as never] = value as never;
			}
		},

		setter1<U extends Partial<T>>(entityId: EntityId, data: U): void {
			Sift.Dictionary.merge(componentData.get(entityId)!, data);
		},
	});
}

// const updateProperty = (index: "x" | "y" | "z", entityId: number, value: number): void => {
// 	_Position[index][entityId] = value;
// };

let _Position = Tina.createComponent({
	x: ComponentTypes.Number,
	y: ComponentTypes.Number,
	z: ComponentTypes.Number,

	notUsed: ComponentTypes.Boolean,
	notUsed2: ComponentTypes.String,
});

let Position = _Position as ComponentInternal<GetComponentSchema<typeof _Position>>;

let _Velocity = Tina.createComponent({
	x: ComponentTypes.Number,
	y: ComponentTypes.Number,
	z: ComponentTypes.Number,

	notUsed: ComponentTypes.Boolean,
	notUsed2: ComponentTypes.String,
});

let Velocity = _Position as ComponentInternal<GetComponentSchema<typeof _Position>>;

let PositionComponentForEntity: TempComp<{ x: number; y: number; z: number }>;
let VelocityComponentForEntity: TempComp<{ x: number; y: number; z: number }>;

let world = Tina.createWorld({});

export = {
	ParameterGenerator: (): void => {
		internal_resetGlobalState();

		world.flush();

		world = Tina.createWorld({});

		_Position = Tina.createComponent({
			x: ComponentTypes.Number,
			y: ComponentTypes.Number,
			z: ComponentTypes.Number,

			notUsed: ComponentTypes.Boolean,
			notUsed2: ComponentTypes.String,
		});

		Position = _Position as ComponentInternal<GetComponentSchema<typeof _Position>>;

		_Velocity = Tina.createComponent({
			x: ComponentTypes.Number,
			y: ComponentTypes.Number,
			z: ComponentTypes.Number,

			notUsed: ComponentTypes.Boolean,
			notUsed2: ComponentTypes.String,
		});

		Velocity = _Velocity as ComponentInternal<GetComponentSchema<typeof _Velocity>>;

		PositionComponentForEntity = createNewComponent({
			x: math.random(0, 100),
			y: math.random(0, 100),
			z: math.random(0, 100),
		});

		VelocityComponentForEntity = createNewComponent({
			x: math.random(0, 100),
			y: math.random(0, 100),
			z: math.random(0, 100),
		});

		void world.start();

		for (const i of $range(0, N)) {
			const id = world.add();

			// if (i % 5 === 0) {
			world
				.addComponent(id, Position, {
					x: 5, // math.random(0, 100),
					y: math.random(0, 100),
					z: math.random(0, 100),
				})
				.addComponent(id, Velocity, { x: 1, y: 2, z: 3 });
			// }

			PositionComponentForEntity[i as never] = {
				x: math.random(0, 100),
				y: math.random(0, 100),
				z: math.random(0, 100),
			} as never;

			VelocityComponentForEntity[i as never] = {
				x: math.random(0, 100),
				y: math.random(0, 100),
				z: math.random(0, 100),
			} as never;
		}

		world.flush();

		// const positionProxy = new PositionProxy();
		// const velocityProxy = new VelocityProxy();
	},

	Functions: {
		// Direct: (Profiler: Profiler): void => {
		// 	for (const i of $range(0, N, 5)) {
		// 		_Position.x[i] += _Velocity.x[i];
		// 		_Position.y[i] += _Velocity.y[i];
		// 		_Position.z[i] += _Velocity.z[i];
		// 	}
		// },

		ComponentAccessVariable: (Profiler: Profiler): void => {
			const xPos = Position.x;
			const yPos = Position.y;
			const zPos = Position.z;

			const xVel = Velocity.x;
			const yVel = Velocity.y;
			const zVel = Velocity.z;

			for (const i of $range(0, N)) {
				xPos[i] += xVel[i];
				yPos[i] += yVel[i];
				zPos[i] += zVel[i];
			}
		},

		ComponentAccessEntity: (Profiler: Profiler): void => {
			for (const i of $range(0, N)) {
				const position = PositionComponentForEntity.get(i)!;
				const velocity = VelocityComponentForEntity.get(i)!;

				position.x += velocity.x;
				position.y += velocity.y;
				position.z += velocity.z;
			}
		},

		// ComponentAccessVariableSetter: (Profiler: Profiler): void => {
		// 	const xPos = Position.x;
		// 	const yPos = Position.y;
		// 	const zPos = Position.z;

		// 	const xVel = Velocity.x;
		// 	const yVel = Velocity.y;
		// 	const zVel = Velocity.z;

		// 	for (const i of $range(0, N, 5)) {
		// 		Position.set(i, {
		// 			x: xPos[i] + xVel[i],
		// 			y: yPos[i] + yVel[i],
		// 			z: zPos[i] + zVel[i],
		// 		});
		// 	}
		// },

		// ComponentAccessEntitySetter: (Profiler: Profiler): void => {
		// 	for (const i of $range(0, N, 5)) {
		// 		const position = PositionComponentForEntity.get(i)!;
		// 		const velocity = VelocityComponentForEntity.get(i)!;

		// 		PositionComponentForEntity.setter(i, {
		// 			x: position.x + velocity.x,
		// 			y: position.y + velocity.y,
		// 			z: position.z + velocity.z,
		// 		});
		// 	}
	},

	// ComponentAccessEntitySetter: (Profiler: Profiler): void => {
	// 	for (const i of $range(0, N, 5)) {
	// 		const position = PositionComponentForEntity.get(i)!;
	// 		const velocity = VelocityComponentForEntity.get(i)!;

	// 		PositionComponentForEntity.set(i, {
	// 			x: position.x + velocity.x,
	// 			y: position.y + velocity.y,
	// 			z: position.z + velocity.z,
	// 		});
	// 	}
	// },

	// DirectOtherApproachWithSetter: (Profiler: Profiler): void => {
	// 	for (const i of $range(0, N, 5)) {
	// 		const position = PositionComponentForEntity.get(i)!;
	// 		const velocity = VelocityComponentForEntity.get(i)!;

	// 		PositionComponentForEntity.setter(i, {
	// 			x: position.x + velocity.x,
	// 			y: position.y + velocity.y,
	// 		});
	// 	}
	// },

	// DirectWithSetter: (Profiler: Profiler): void => {
	// 	for (const i of $range(0, N, 5)) {
	// 		Position.set(i, {
	// 			x: _Position.x[i] + _Velocity.x[i],
	// 			y: _Position.y[i] + _Velocity.y[i],
	// 			z: _Position.z[i] + _Velocity.z[i],
	// 		});
	// 	}
	// },

	// DirectWithSetterNoFunctionCall: (Profiler: Profiler): void => {
	// 	for (const i of $range(0, N, 5)) {
	// 		updateProperty("x", i, _Position.x[i] + _Velocity.x[i]);
	// 		updateProperty("y", i, _Position.y[i] + _Velocity.y[i]);
	// 		updateProperty("z", i, _Position.z[i] + _Velocity.z[i]);
	// 	}
	// },

	// // ProxyComponent: (Profiler: Profiler, position: PositionProxy, velocity: VelocityProxy): void => {
	// // 	for (const i of $range(0, N)) {
	// // 		position.entityId = i;
	// // 		velocity.entityId = i;

	// // 		Position.set(i, {
	// // 			x: position.getX() + velocity.getX(),
	// // 			y: position.getY() + velocity.getY(),
	// // 			z: position.getZ() + velocity.getZ(),
	// // 		});
	// // 	}
	// // },

	// ProxyWithCache: (Profiler: Profiler, position: PositionProxy, velocity: VelocityProxy): void => {
	// 	for (const i of $range(0, N, 5)) {
	// 		position.entityId = i;
	// 		velocity.entityId = i;

	// 		position.setX1(position.getX1() + velocity.getX1());
	// 		position.setY1(position.getY1() + velocity.getY1());
	// 		position.setZ1(position.getZ1() + velocity.getZ1());
	// 	}
	// },

	// ProxyWithCacheSlow: (Profiler: Profiler, position: PositionProxy, velocity: VelocityProxy): void => {
	// 	for (const i of $range(0, N)) {
	// 		position.entityId = i;
	// 		velocity.entityId = i;

	// 		position.set({
	// 			x: position.getX1() + velocity.getX1(),
	// 			y: position.getY1() + velocity.getY1(),
	// 			z: position.getZ1() + velocity.getZ1(),
	// 		});
	// 	}
	// },
};
