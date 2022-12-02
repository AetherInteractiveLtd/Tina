<div align=center>
    <h3>yaml-to-dts</h3>
    Yaml format to Luau with .d.ts (for roblox-ts workflows)
    <br>
    <br>
</div>

<br>

Configuration files (`.yml`) comes very handy at the moment of building applications, in and out of ROBLOX. They are being the next candidate for replacing JSON files, and this is a great moment to start being able to write understandable and easy configuration files without having them to being strictly a `.ts` or `.lua` file!

This transformer can build both the `.lua` and the `.d.ts` file for you! Without any hesitation at all.

You can give several option feedback to the transformer, whether you want the Luau file or the source folder where to look for your configuration files, by default it's `src/config`.

### How to use it?

```
npm i yaml-to-dts
```

And from there add it to your `compilerOptions.plugins` on your `tsconfig.json` file.
```json
{
    "compilerOptions": {
        ...,

        "plugins": [
            {
                "transform": "yaml-to-dts"
            }
        ]
    }
}
