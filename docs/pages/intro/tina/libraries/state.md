# State
Tina state allows for a structure of values to be created on the Server and then observed on the Client.


## GlobalState
GlobalState are values which are shared between all players. An example of this may be an event timer or a game's weather.
When this value is updated on the server it will be replicated to **ALL** clients.

## PlayerState
PlayerState is used for values which are unique for each player. An example of this may be a respawn timer or a player's inventory.
Updating this value will **ONLY** update it for the specified player.

## Use
Creating state is simple. You simply import States from Tina and then create a State Schema using Tina.createState().

As an example let's say we have a game with `weather` and each player has their own `inventory` for items. We could create
the state with the following schema.
```typescript
// shared.ts

export const sharedState = Tina.createState({
    weather: States.GlobalState<Weather>("raining"),
    inventory: States.PlayerState<Inventory>([]),
    event: {
      duration: States.GlobalState(3600),
    },
});
```

We could then use some kind of trigger to wait for a new day to begin and update the `weather` state.
```typescript
// server.ts

/** Update the weather when a new days starts */
function onNewDay(): void {
    const weather = getRandomWeather()
    sharedState.weather.set(weather) // Update the weather state
}

/** Add an item to the player's inventory */
function addItem(player: Player, item: Item): void {
    /* State also accept a setter function which will be called with the current value */
    sharedState.inventory.set(player, (items) => {
        return [...items, item]
    })
}
```

Once the `weather` has been updated on the server, it will be automatically replicated to all players. We could then
pass it through to a WeatherManager to play some weather effects.
```typescript
// client.ts

sharedState.weather.when((weather) => {
    WeatherManager.setWeather(weather)
})

sharedState.inventory.when(LocalPlayer, (items) => {
    Inventory.setItems(items)
})
```
