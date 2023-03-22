# Tina's Purpose

## Ideology

Our ideology in creating Tina ("**T**ina **i**s **n**ot **A**ero") was to create an optimized server-side solution for the problems many of our game ideas would've been faced with had we kept Roblox's backend philosophy.

Tina aims to replace many of the traditional frameworks like AeroGameFramework, Knit, and Flamework; all of these rely heavily on Services/Controllers. Instead, Tina relies on various patterns such as heavily Event/Process-Driven Systems, where everything happens either because we're at the correct point in a "Process" or because a certain "Event" has flared. 

The primary method of interacting with the game world is with a flavoured Entity Component System; the Server only runs processing on any "Components" using "Systems", whilst the Client uses those Components along with "Effects" to run pre-rendering tasks or display any relevant information to the end-user.

## Aether's Investment

We at Aether have always wanted to build ideas beyond the typical technical scope of Roblox projects, here we found ourselves at an impasse where the engine simply wasn't powerful enough to support everything we needed it to on a client-server basis.

Thus, we're spending a while working on Tina to facilitate our in-house projects and any other dreams people might have.
