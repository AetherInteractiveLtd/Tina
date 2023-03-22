Lorem ipsum dolor sit amet, (1) consectetur adipiscing elit.
{ .annotate }

1.  :man_raising_hand: I'm an annotation! I can contain `code`, __formatted
    text__, images, ... basically anything that can be expressed in Markdown.

# Main Usage

## Game

Tina requires certain initialization on the Server and the Client.

```typescript title="index.server.ts" linenums="1"
import Tina from '@rbxts/tina';

import 'lib/game'; // Initialize Game.
import 'lib/net'; // Initalize Networking.
import 'lib/ecs'; // Initalize Entity Component System.

import { User } from 'shared/lib/game/user';

/* Starts the Game Processes */
Tina.setUserClass(User); // Sets the custom user class.
Tina.startGame("GuessTheNumber"); // (1)!
```

1. This initializes the game and starts all processes. [Tina.startGame](/docs/api/Tina/#startGame)

`index.client.ts`

```typescript title="index.client.ts" linenums="1"
import Tina from '@rbxts/tina';

import 'lib/game'; // Initialize Game.
import 'lib/net'; // Initialize Networking.
import 'lib/ecs'; // Initialize Entity Component System.

import { User } from 'shared/lib/game/user';

// TODO: Decide what client-side initialization needs to look like.
```

## Events

```typescript

```
