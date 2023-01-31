import { ComponentTypes, createComponent, GetComponentSchema, OptionalKeys } from "@rbxts/tina/out/lib/ecs/component";

export const Velocity = createComponent({
	x: ComponentTypes.number,
	y: ComponentTypes.number,
	z: ComponentTypes.number,
});

export class Vector3Proxy {
	public entityId: number;

	private store: GetComponentSchema<typeof Velocity>;

	private _x: number;
	private _y: number;
	private _z: number;

	private x: number;
	private y: number;
	private z: number;

	constructor(store: GetComponentSchema<typeof Velocity>, entityId: number) {
		this.store = store;
		this.entityId = entityId;

		this._x = 0;
		this._y = 0;
		this._z = 0;

		this.x = 0;
		this.y = 0;
		this.z = 0;
	}

	public getX(): number {
		return this.store.x[this.entityId];
	}

	public setX(value: number): void {
		this.store.x[this.entityId] = value;
		this._x = value;
	}

	public getY(): number {
		return this.store.y[this.entityId];
	}

	public setY(value: number): void {
		this.store.y[this.entityId] = value;
		this._y = value;
	}

	public getZ(): number {
		return this.store.z[this.entityId];
	}

	public setZ(value: number): void {
		this.store.z[this.entityId] = value;
		this._z = value;
	}

	public getX1(): number {
		return this.x;
	}

	public setX1(value: number): void {
		this.store.x[this.entityId] = value;
		this.x = value;
	}

	public getY1(): number {
		return this.y;
	}

	public setY1(value: number): void {
		this.store.y[this.entityId] = value;
		this.y = value;
	}

	public getZ1(): number {
		return this.z;
	}

	public setZ1(value: number): void {
		this.store.z[this.entityId] = value;
		this.z = value;
	}

	public set<U extends Partial<OptionalKeys<GetComponentSchema<typeof Velocity>>>>(data: U): void {
		for (const [key, value] of pairs(data)) {
			this.store[key as never][this.entityId as never] = value as never;
			this[key as never] = value as never;
		}
	}
}

export class VelocityProxy extends Vector3Proxy {
	constructor() {
		super(Velocity as unknown as GetComponentSchema<typeof Velocity>, -1);
	}
}
