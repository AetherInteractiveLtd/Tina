# Conditions

Conditions are the way to perform and evaluate boolean operations whether they are wrapped around a `.condition()` or in an if-statement.

### Creating conditions

Conditions can be created as in `COND.create(f: (...args) => boolean)`. The function can take optional arguments when being evaluated.

```ts
COND.create((n: number) => (n < 5))
```

### Evaluating conditions

Conditions by themselves aren't a big thing, they need some way to be evaluated. To evaluate conditions we use `.eval(condition: (boolean | (...args) => boolean))`.

```ts
/**
 * These are all valid ways to evaluate boolean operations.
 */

COND.eval(true);
COND.eval(COND.AND(false, true));

COND.eval(COND.create(() => true));
COND.eval(COND.create((s) => (s === "Hello, world!")), "Hello, world!");

COND.eval((n: number) => (n > 0), 0);

COND.eval(GameState.isOn(...));
COND.eval(CharacterController.isReplicable(), new CharacterDescription(...));
```

### Conditions & Events

Conditions true power starts to reveal for themselves when we use Events and their `.condition()` method, it's easier to wrap it around this statement to ensure that next-in-queue callback runs. This lets us have conditioning done in one place without polluting core functionality with unnecessary if-statements.

```ts
interface RoundEvents {
    startRound: (timer: number) => void;
}

class RoundService extends EventEmitter<RoundEvents> {
    private readonly duration = 180;

    constructor() {
        super();

        this.when("startRound")
            .condition(
                COND.create((currentTime: number) => {
                    return currentTime >= this.duration;
                })
            )
            .do(() => {
                // If this code is executed, that means that the last condition check has passed,
                // that way, this code ensures that the timer is correct.

                ...; // Finish round, initialize next
            });
    }
}
```

Though this can be used with outer state or boolean checkers made by the user.

```ts
import { GameState, EGameState } from "../state";

interface Events {
 approve: () => void;
}

class Meal extends EventEmitter<Events> implements MealDeclaration {
    private readonly 

    constructor() {
        super()

        this.when("approve")
            .condition(GameState.isOn(EGameState.ROUND_ON_GOING))
            .do(() => {
                ...; // Approve it if the round is still going
            });
    }

    public prepare() { ... }
}
```

### Methods available

Conditions are not only helpful in evaluating boolean operations, but it provides you an API for those common boolean operations that you may find yourself doing over and over again, such as `AND`, `OR`, and `NOT`, but others like `NAND`, `NOR`, `XNOR` are included as well.

#### create

Takes a function that returns a boolean.

```ts
COND.create(() => true);
```

#### eval

Evaluates a condition. Data can be passed optionally if it's a function.

```ts
COND.eval((s: string) => (s === "condition_met"), "condition_met");
```

#### AND

AND logic-gate.

```ts
COND.eval(COND.AND(true, false)); // false
```

#### OR

OR logic-gate.

```ts
COND.eval(COND.OR(true, false)); // true
```

#### NOT

NOT logic-gate.

```ts
COND.eval(COND.NOT(false)); // true
```

#### NOR

NOR logic-gate.

```ts
COND.eval(COND.NOR(true, false)); // false
```

#### NAND

NAND logic-gate.

```ts
COND.eval(COND.NAND(false, false)); // true
```

#### XNOR

XNOR logic-gate.

```ts
COND.eval(COND.XNOR(true, true)); // true
```