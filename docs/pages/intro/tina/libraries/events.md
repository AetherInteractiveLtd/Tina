# Events

!!! info "Guide Page"

    Information on this page might be outdated, and is **not** an up-to-date API reference. This is a guide on how to use Events.
    For documentation, please go to [:material-cube: EventEmitter](/docs/api/event_emitter) and [:material-cube: EventListener]().

Events are a core library that is used all over Tina, incluiding Networking. Events are useful when it comes to binding callbacks to a unique identifier and emitting data to it.

```ts
EventEmitter<EventsInterface>.when(x: keyof EventsInterface); // Returns an Event listener
```

Using the `.when(...)` method is necessary, since it returns an Event listener where the functions are binded and invoked from. Something you might find interesting is creating multiple chains of actions to be performed asynchronously. 

### Conditions

Conditions are available to be done within events, that way you *condition* (pun intended) the next-in-queue callback. This is done using the `.condition()` method. You can see an implementation on Conditions with this method.

The main idea behind the Conditions implementation within Events is that, the data sent to the Event is also used in the condition as well.

### Do

The "do's" are the way to bind functions as actions to be performed. The dos are the ones who are actually ran when the event is emitted.

```ts
interface Events {
    onEvent: (message: string) => string;
}

const Event = new EventEmitter<Events>
    .when("onEvent")
    .do((message: string) => {
        return `${message}, world!`
    })
    .do((concatenated: string) => print(concatenated));

Event.emit("onEvent", "Hello");
```

### Await

Events are asynchronous to their thread, this means that will run at the same time as your other code. Sometimes we want to await on some events until they are finished to proceed, even though, this isn't intended (as the do's chain solves that problem). We give you the opportunity to await on events until the final result is given.

```ts
// File 2
interface Events {
    onThis: (message: string) => string;
}

export const Event = new EventEmitter<Events>;
    
Event
    .when("onThis")
    .do((message: string) => {
        return `${message}, world!`
    })
    .do((message: string) => {
        return `${message} Wow, this is amazing, a new world!`
    })
    .do((message: string) => {
        return `${message} I don't feel like there's much to explore.`
    })
    .do((message: string) => {
        return `${message} Well, I guess this is it.`
    })
    .await();

print("Hello, world");

// File 2
import { Event } from "...";

Event.emit("Hello");

/**
 * Hello, world!
 * Hello, world! Wow this is amazing, a new world!
 * Hello, world! Wow this is amazing, a new world! I don't feel like there's much to explore.
 * Hello, world! Wow this is amazing, a new world! I don't feel like there's much to explore. Well, I guess this is it.
 * 
 * Hello, world!
 */
```