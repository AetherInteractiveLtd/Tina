[@rbxts/tina](modules.md) / lib/types/manifest

# lib/types/manifest

## Index

### Interfaces

- [Manifest](lib_types_manifest.md#manifest)

## Interfaces

### Manifest

#### Index

##### Properties

- [config](lib_types_manifest.md#config)
- [description](lib_types_manifest.md#description)
- [name](lib_types_manifest.md#name)
- [tina](lib_types_manifest.md#tina)
- [version](lib_types_manifest.md#version)

#### Properties

##### config

> `object`

```ts
{
    ecs: {
        max_entities: number;
    };
    max_fps: number;
    max_players: number;
    net: {
        compression: boolean;
    };
    supported_languages: string[];
}
```

###### Type declaration

| Member                | Type       |
| :-------------------- | :--------- |
| `ecs`                 | `object`   |
| `ecs.max_entities`    | `number`   |
| `max_fps`             | `number`   |
| `max_players`         | `number`   |
| `net`                 | `object`   |
| `net.compression`     | `boolean`  |
| `supported_languages` | `string`[] |

Defined in: [src/lib/types/manifest.d.ts:5](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/manifest.d.ts#L5)

##### description

> `string`

Defined in: [src/lib/types/manifest.d.ts:4](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/manifest.d.ts#L4)

##### name

> `string`

Defined in: [src/lib/types/manifest.d.ts:2](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/manifest.d.ts#L2)

##### tina

> `string`

Defined in: [src/lib/types/manifest.d.ts:17](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/manifest.d.ts#L17)

##### version

> `string`

Defined in: [src/lib/types/manifest.d.ts:3](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/lib/types/manifest.d.ts#L3)
