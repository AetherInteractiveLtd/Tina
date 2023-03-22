[@rbxts/tina](modules.md) / lib/user/default/client/types

# lib/user/default/client/types

## Index

### Interfaces

- [ClientUserImplementation](lib_user_default_client_types.md#clientuserimplementation)

## Interfaces

### ClientUserImplementation

#### Index

##### Properties

- [player](lib_user_default_client_types.md#player)

##### Methods

- [move](lib_user_default_client_types.md#move)

#### Properties

##### player

> `Player`

Defined in: [src/lib/user/default/client/types.d.ts:2](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/client/types.d.ts#L2)

#### Methods

##### move()

Sets a character CFrame to the provided CFrame/BasePart's CFrame.

###### Client

###### Signature

```ts
move(to: CFrame | BasePart): void;
```

###### Parameters

| Name | Type                   | Description                                                    |
| :--- | :--------------------- | :------------------------------------------------------------- |
| `to` | `CFrame` \| `BasePart` | the CFrame or BasePart where the character should be moved to. |

###### Returns

`void`

Defined in: [src/lib/user/default/client/types.d.ts:11](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/user/default/client/types.d.ts#L11)
