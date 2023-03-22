# Creating an Experience with Tina

## Commands

* `rbxtsc -w` - Start the TypeScript compiler.
* `rojo start` - Start the Rojo server.

## Project layout

```
default.project.json   # Rojo configuration
package.json
tsconfig.json          # rbxts configuration
tina.yml               # Tina configuration
/node_modules/
    # ...
/src/
	/client/
		index.client.ts # Initalize the Client-Side, mostly through Tina
		/lib/
			/game/
				index.ts # Start all core game loops/listeners.
				# ... Large logic/core loops
			/net/
				index.ts
				# ... Any special network handlers
			/ecs/
				/effects/
					# ... Any Effects used for entities
				/systems/
					# ... Any Systems that interact with components/effects
	/server/
		index.server.ts
		/lib/
			/game/
				index.ts # Start all core game loops/listeners.
				# ... Large logic/core loops
			/net/
				index.ts
				# ... Any special network handlers
			/ecs/
				/systems/
					# ... Any Systems that interact with components/effects
	/shared/
		index.ts
		/lib/
			/game/
			/net/
				index.ts # Exports the network definitions.
				packets.d.ts # Provides all packet types for the network.
			/ecs/
				index.ts
				/components/
					# ... All available components
				/effects/
					# ... All available effects, without implementation.
```
