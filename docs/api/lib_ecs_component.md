[@rbxts/tina](modules.md) / lib/ecs/component

# lib/ecs/component

## Index

### Type Aliases

- [AnyComponent](lib_ecs_component.md#anycomponent)
- [AnyFlyweight](lib_ecs_component.md#anyflyweight)
- [Component](lib_ecs_component.md#component)
- [ComponentData](lib_ecs_component.md#componentdata)
- [Flyweight](lib_ecs_component.md#flyweight)
- [GetComponentSchema](lib_ecs_component.md#getcomponentschema)
- [OptionalKeys](lib_ecs_component.md#optionalkeys)
- [TagComponent](lib_ecs_component.md#tagcomponent)

### Variables

- [ComponentTypes](lib_ecs_component.md#componenttypes)

## Type Aliases

### AnyComponent

> [`Component`](lib_ecs_component.md#component)\<`Tree`\<`Type`\>\>

Defined in: [src/lib/ecs/component.ts:15](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L15)

---

### AnyFlyweight

> [`Flyweight`](lib_ecs_component.md#flyweight)\<`object`\>

Defined in: [src/lib/ecs/component.ts:20](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L20)

---

### Component

> \<`T`\> `Mutable`\<[`ComponentData`](lib_ecs_component.md#componentdata)\<`T`\>\> & \{

    `set`: `Method set`;

}

To create a component, use the Tina.createComponent function.

#### Type parameters

- `T` _extends_ `Tree`\<`Type`\>

Defined in: [src/lib/ecs/component.ts:31](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L31)

---

### ComponentData

> \<`T`\> `T` _extends_ infer U[] ? `U`[] : `T`

#### Type parameters

- `T` _extends_ `Tree`\<`Type`\>

Defined in: [src/lib/ecs/component.ts:24](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L24)

---

### Flyweight

> \<`T`\> [`Immutable`](lib_types_readonly.md#immutable)\<`T`\> & \{

    `set`: `Method set`;

}

#### Type parameters

- `T` _extends_ `object`

Defined in: [src/lib/ecs/component.ts:50](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L50)

---

### GetComponentSchema

> \<`C`\> `C` _extends_ [`Component`](lib_ecs_component.md#component)\<infer T\> ? `T` : `never`

#### Type parameters

- `C`

Defined in: [src/lib/ecs/component.ts:22](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L22)

---

### OptionalKeys

> \<`T`\> `{ [K in keyof T]: (T[K] extends (infer U)[] ? U : never) | None }`

#### Type parameters

- `T`

Defined in: [src/lib/ecs/component.ts:26](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L26)

---

### TagComponent

> `object`

#### Index signature

\[`index`: `string`\]: `never`

#### Type declaration

Defined in: [src/lib/ecs/component.ts:41](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L41)

## Variables

### ComponentTypes

> **`Const`** `object`

```ts
{
    Boolean: boolean[];
    CFrame: CFrame[];
    Color3: Color3[];
    Custom: <T>(init: () => T) => [() => T]<T>() => T[];
    Number: number[];
    String: string[];
    Vector2: Vector2[];
    Vector2int16: Vector2int16[];
    Vector3: Vector3[];
    Vector3int16: Vector3int16[];
}
```

Types that can be used as component properties. These are the types that can
will support built-in serialization.

If you want to use a custom type, you can use the `Custom` function to create
a component that uses a custom type, and then provide a custom serializer.

#### Type declaration

| Member         | Type                                                    |
| :------------- | :------------------------------------------------------ |
| `Boolean`      | `boolean`[]                                             |
| `CFrame`       | `CFrame`[]                                              |
| `Color3`       | `Color3`[]                                              |
| `Custom`       | \<T\>(`init`: () => `T`) => [() => `T`]\<T\>() => `T`[] |
| `Number`       | `number`[]                                              |
| `String`       | `string`[]                                              |
| `Vector2`      | `Vector2`[]                                             |
| `Vector2int16` | `Vector2int16`[]                                        |
| `Vector3`      | `Vector3`[]                                             |
| `Vector3int16` | `Vector3int16`[]                                        |

Defined in: [src/lib/ecs/component.ts:89](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/ecs/component.ts#L89)
