# Tina
"Tina is not Aero" - A high-tech framework for the future of experiences on Roblox.

## Design Principles
Tina focuses on providing an abstract instance-less server-side development experience, letting clients render and compute any of their necessary data with minor server correction where necessary.

## Contributing

Public contributions are not yet authorized.

## Snippet

#### `src/server/main.index.ts`
```ts
import Tina from '@rbxts/tina';
import 'lib/user'; // Initialize custom user.
import 'lib/net'; // Initialize network handlers.
import 'lib/lifecycle'; // Initialize lifecycle handlers.

Tina.startGame("GuessTheNumber");
```

#### `src/server/lib/user/index.ts`
```ts
import Tina, { BaseUser } from '@rbxts/tina';

export class User extends BaseUser {
  
}

Tina.setUserClass(User);
```

#### `src/shared/lib/net/index.ts`
```ts
import Tina, { Network } from '@rbxts/tina';

interface PacketPlayerStats {
  level: number,
  successes: number
}

interface PacketGameStarted {
  basenum: number,
  participants: User[]
}

interface PacketGuessInput {
  basenum: number,
  guess: number
}

export const Endpoints = Network.registerEndpoints({
  "user": Network.directory({
    "stats": Network.Methods.Universal<PacketPlayerStats>(),
  }),
  "game": Network.directory({
    "start": Network.Methods.Expect<PacketGameStarted>(),
    "guess": Network.Methods.Input<PacketGuessInput>()
  }),
  "dev": Network.directory({
    
  }).developmentOnly()
});
```


#### `src/server/lib/net/index.ts`
```ts
import Tina, { Network, User } from '@rbxts/tina';
import { Endpoints } from 'shared/lib/net';
import { PlayerBanned } from 'server/lib/player';

Tina.when("player:added")
  .rejectWithCondition(PlayerBanned.is(true))
  .do((plr: User) => {
    plr.addDataContainer("stats").set({
      level: 0,
      successes: 0
    });
  });

Endpoints.path("user").get("stats")
  .setDataContainerReply("stats");
```

#### `src/server/lib/lifecycle/index.ts`
```ts
import Tina, { State, Scheduler, Util } from '@rbxts/tina';
import { Endpoints } from 'shared/lib/net';
import { User } from 'server/lib/user';

enum EGameState {
  GAMEPLAY = "GAMEPLAY",
  TIMEOUT = "TIMEOUT"
}

const GameState = new State<EGameState>(EGameState.GAMEPLAY);
const CurrentNumber = new State<number>();

const Participants = new Util.ActivePlayerList();
const GameProcess = Scheduler.declareProcess("game-runner");

const Guesses = new Util.UserMap<number>();

Endpoints.path("game").get("guess")
  .when()
  .condition(GameState.is(EGameState.GAMEPLAY))
  .do((plr: User, { guess }) => {
    Guesses.set(plr, guess);
  })

GameProcess.do(() => {
  if (Participants.size() === 0 || GameProcess.sinceBeacon("roundstart") > 1000) { // 1000 Ticks = 33.3... seconds
    Guesses.weightSort(v => math.abs(v - CurrentNumber.state()));
    
    const winner = Guesses.entry(0).key;
    if (winner.isInGame()) {
      winner.getDataContainer("stats").patch(v => {
        v.successes += 1;
      }).notifyReplies();
    }
    
    GameState.set(EGameState.TIMEOUT);
  }

  GameProcess.suspend(1); // Skip every second computational tick, we don't need to reprocess this constantly.
});

GameState.when("GAMEPLAY")
  .do(() => {
    // Generate random number for the round.
    CurrentNumber.set(math.random(0, 100));
    
    Endpoints.path("game").get("start")
      .sendToAll({ baseNum: CurrentNumber.state(), participants: Participants.list() });
    
    GameProcess.beacon("roundstart")
  });

GameState.when("TIMEOUT")
  .do(() => {
    GameProcess.suspend(60);
  })
```

#### `src/server/lib/player/index.ts`
```ts
import Tina, { Condition } from '@rbxts/tina';

export class PlayerBanned extends Condition<boolean> {
  public eval() {
    if (!this.has("player")) return true;
    
    const banned = this.get("player")/* .isBanned() */;
    return banned;
  }
}
```

#### `src/client/lib/`

TODO: Make Client Side.

#### `src/project.tina.yml`
```yml
project:
  name: "Guess The Number"
  author:
    - TalesOfLuna
    - siriuslatte
    - ffrostfall
  version: 1.0
  workspace: production
tech:
  tina-manifest: 1
  include:
    - roactstate
    - conditionsextended
config:
  game:
    tick: 30
  net:
    compression-rate: 300
    max-packets-from-client: 60
  
```
