# Processes
Processes are used to define logic which runs on every tick.

## Creation

Processes should only be created by calling Tina.process() to guarantee there will only ever be one Process assigned to each unique string.

```typescript
const GameProcess = Tina.process("main")
```

## Use

After a Process has been created, callbacks can be added to the Process using .do().
You can add as many callbacks as you want to each Process, and they will be executed in the order that they're added.

```typescript
GameProcess.do(() => {
    doSomething()
})

GameProcess.do(() => {
    doSomethingElse()
})
```

At this point all that's left is to start your Process by calling .resume().
Resuming a Process adds it to the Scheduler to be updated every tick and also un-suspends the Process if it was previously suspended with .suspend().

```typescript
// doSomething() and doSomethingElse() will now be called on every tick
GameProcess.resume()
```

## Suspension
Suspending Processes is a way to temporarily disable them for a set amount of time in ticks.
After the duration passes, the suspension is removed and the Process will automatically resume running callbacks on each tick.

```typescript
GameProcess.suspend(60) // Suspends the Process for 60 ticks
```


## Example
```typescript
/* Create new process */
const GameProcess = Tina.process("main")

/* Add a callback to run on each tick */
GameProcess.do(() => {
    // Do something
    doSomething()
    
    // Suspend the Process for 1 tick after this callback runs
    // This is effectively calling this function every other tick
    GameProcess.suspend(1)
})

/* Adds the Process to the Scheduler to update on each tick */
GameProcess.resume()
```