[@rbxts/tina](modules.md) / services

# services

## Index

### Interfaces

- [ServerScriptService](services.md#serverscriptservice)

## Interfaces

### ServerScriptService

\*ServerScriptService\*\* is a container service for [Script](https://developer.roblox.com/en-us/api-reference/class/Script), [ModuleScript](https://developer.roblox.com/en-us/api-reference/class/ModuleScript) and other scripting-related assets that are only meant for server use. The contents are never replicated to player clients at all, which allows for a secure storage of important game logic. Script objects will run if they are within this service and not [Disabled](https://developer.roblox.com/en-us/api-reference/property/BaseScript/Disabled).

This service houses just one property, [LoadStringEnabled](https://developer.roblox.com/en-us/api-reference/property/ServerScriptService/LoadStringEnabled), which determines whether the `loadstring` function in Lua is enabled. It's recommended to keep this disabled for security reasons, as misusing this function can lead to remote code execution vulnerabilities.

Scripts running in ServerScriptService may need access to various other assets which are not scripting-related, such as prefabricated models to be [cloned](https://developer.roblox.com/en-us/api-reference/function/Instance/Clone). Such assets should go in [ServerStorage](https://developer.roblox.com/en-us/api-reference/class/ServerStorage), which behaves similarly to this service except that [Script](https://developer.roblox.com/en-us/api-reference/class/Script) objects will not run even if they are not [Disabled](https://developer.roblox.com/en-us/api-reference/property/BaseScript/Disabled). Assets and [ModuleScript](https://developer.roblox.com/en-us/api-reference/class/ModuleScript) that are useful to both the server and clients should go in [ReplicatedStorage](https://developer.roblox.com/en-us/api-reference/class/ReplicatedStorage) instead. Finally, you can further organize objects within this service through the use of [Folder](https://developer.roblox.com/en-us/api-reference/class/Folder)s without affecting the way it behaves.

#### Hierarchy

- `Instance`.**ServerScriptService**

#### Index

##### Properties

- [AncestryChanged](services.md#ancestrychanged)
- [Archivable](services.md#archivable)
- [AttributeChanged](services.md#attributechanged)
- [Changed](services.md#changed)
- [ChildAdded](services.md#childadded)
- [ChildRemoved](services.md#childremoved)
- [ClassName](services.md#classname)
- [DescendantAdded](services.md#descendantadded)
- [DescendantRemoving](services.md#descendantremoving)
- [Destroying](services.md#destroying)
- [Name](services.md#name)
- [Package](services.md#package)
- [Parent](services.md#parent)

##### Methods

- [ClearAllChildren](services.md#clearallchildren)
- [Clone](services.md#clone)
- [Destroy](services.md#destroy)
- [FindFirstAncestor](services.md#findfirstancestor)
- [FindFirstAncestorOfClass](services.md#findfirstancestorofclass)
- [FindFirstAncestorWhichIsA](services.md#findfirstancestorwhichisa)
- [FindFirstChild](services.md#findfirstchild)
- [FindFirstChildOfClass](services.md#findfirstchildofclass)
- [FindFirstChildWhichIsA](services.md#findfirstchildwhichisa)
- [FindFirstDescendant](services.md#findfirstdescendant)
- [GetActor](services.md#getactor)
- [GetAttribute](services.md#getattribute)
- [GetAttributeChangedSignal](services.md#getattributechangedsignal)
- [GetAttributes](services.md#getattributes)
- [GetChildren](services.md#getchildren)
- [GetDescendants](services.md#getdescendants)
- [GetFullName](services.md#getfullname)
- [GetPropertyChangedSignal](services.md#getpropertychangedsignal)
- [IsA](services.md#isa)
- [IsAncestorOf](services.md#isancestorof)
- [IsDescendantOf](services.md#isdescendantof)
- [SetAttribute](services.md#setattribute)
- [WaitForChild](services.md#waitforchild)

#### Properties

##### AncestryChanged

> **`Readonly`** `RBXScriptSignal`\<(`child`: `Instance`, `parent`: `undefined` \| `Instance`) => `void`\>

Fires when the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property of the object or one of its ancestors is changed.

This event includes two parameters, _child_ and _parent_. _Child_ refers to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) was actually changed. _Parent_ refers to this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s new [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent).

If you need to detect when an instance is destroyed via [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy), consider the [Instance.Destroying](https://developer.roblox.com/en-us/api-reference/event/Instance/Destroying) event instead.

Inherited from: Instance.AncestryChanged

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1019

##### Archivable

> `boolean`

This property determines whether an [object](https://developer.roblox.com/en-us/api-reference/class/Instance) should be included when the game is published or saved, or when [Instance:Clone](https://developer.roblox.com/en-us/api-reference/function/Instance/Clone) is called on one of the object's ancestors. Calling Clone directly on an object will return nil if the cloned object is not archivable. Copying an object in Studio (using the 'Duplicate' or 'Copy' options) will ignore the Archivable property and set Archivable to true for the copy.

local part = Instance.new("Part")
print(part:Clone()) --&gt; Part
part.Archivable = false
print(part:Clone()) --&gt; nil

Inherited from: Instance.Archivable

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:530

##### AttributeChanged

> **`Readonly`** `RBXScriptSignal`\<(`attribute`: `string`) => `void`\>

This event fires whenever an attribute is changed on the instance. This includes when an attribute is set to nil. The name of the attribute that has been changed is passed to the connected function.

For example, the following code snippet will connect the `AttributeChanged` function to fire whenever one of `Instance's` attributes changes. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local function attributeChanged(attributeName)
print(attributeName, “changed”)
end

instance.AttributeChanged:Connect(attributeChanged)

## See also

- [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
- [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
- [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
- [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

Inherited from: Instance.AttributeChanged

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1039

##### Changed

> **`Readonly`** `unknown`

The Changed event fires right after most properties change on objects. It is possible to find the present value of a changed property by using `object[property]`. To get the value of a property before it changes, you must have stored the value of the property before it changed.

If you are only interested in listening to the change of a specific property, consider using the `GetPropertyChangedSignal` method instead to get an event that only fires when a given property changes.

This event does not fire for physics-related changes, like when the `CFrame`, `Velocity`, `RotVelocity`, `Position`, `Orientation` and `CFrame` properties of a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) change due to gravity. To detect changes in these properties, consider using a physics-based event like `RunService.Stepped` or `BasePart.Touched`. A while-true-do loop can also work.

For “-Value” objects, this event behaves differently: it only fires when the `Value` property changes. See individual pages for [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue), [StringValue](https://developer.roblox.com/en-us/api-reference/class/StringValue), etc for more information. To detect other changes in these objects, you must use `GetPropertyChangedSignal` instead.

Inherited from: Instance.Changed

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1049

##### ChildAdded

> **`Readonly`** `RBXScriptSignal`\<(`child`: `Instance`) => `void`\>

Fires after an object is parented to this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Note, when using this function on a client to detect objects created by the server it is necessary to use [Instance:WaitForChild](https://developer.roblox.com/en-us/api-reference/function/Instance/WaitForChild) when indexing these object's descendants. This is because the object and its descendants are not guaranteed to replicate from the server to the client simultaneously. For example:

workspace.ChildAdded:Connect(function(child)
-- need to use WaitForChild as descendants may not have replicated yet
local head = child:WaitForChild("Head")
end)

Note, this function only works for immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). For a function that captures all descendants, use [Instance.DescendantAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantAdded).

See also, [Instance.ChildRemoved](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildRemoved).

Inherited from: Instance.ChildAdded

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1064

##### ChildRemoved

> **`Readonly`** `RBXScriptSignal`\<(`child`: `Instance`) => `void`\>

Fires after a child is removed from this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Removed refers to when an object's parent is changed from this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) to something other than this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). Note, this event will also fire when a child is destroyed (using [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy)) as the destroy function sets an object's parent to nil.

This function only works for immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). For a function that captures all descendants, use `Instance/DescendantRemoved`.

See also [Instance.ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded).

Inherited from: Instance.ChildRemoved

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1074

##### ClassName

> **`Readonly`** `string`

A read-only string representing the class this [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) belongs to.

This property can be used with various other functions of Instance that are used to identify objects by type, such as [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) or [Instance:FindFirstChildOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildOfClass).

Note this property is read only and cannot be altered by scripts. Developers wishing to change an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s class will instead have to create a new [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Unlike [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA), ClassName can be used to check if an object belongs to a specific class ignoring class inheritance. For example:

for \_, child in ipairs(game.Workspace:GetChildren()) do
if child.ClassName == "Part" then
print("Found a Part")
-- will find Parts in model, but NOT TrussParts, WedgeParts, etc
end
end
Tags: ReadOnly, NotReplicated

Inherited from: Instance.ClassName

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:548

##### DescendantAdded

> **`Readonly`** `RBXScriptSignal`\<(`descendant`: `Instance`) => `void`\>

The DescendantAdded event fires after a descendant is added to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

As DescendantAdded fires for every descendant, parenting an object to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) will fire the event for this object and all of its descendants individually.

Developers only concerned with the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) should use [Instance.ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded) instead.

See also [Instance.DescendantRemoving](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantRemoving).

Inherited from: Instance.DescendantAdded

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1084

##### DescendantRemoving

> **`Readonly`** `RBXScriptSignal`\<(`descendant`: `Instance`) => `void`\>

DescendantRemoving fires **immediately before** the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of a descendant of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) changes such that the object is no longer a descendant of the Instance. [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) and [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) change an object's Parent to nil, so calling these on a descendant of an object will therefore cause this event to fire.

Since this event fires before the the descendant's removal, the Parent of the descendant will be unchanged, i.e., it will still be a descendant at the time of this event firing. If the descendant is also a child of the object, It will also fire before ChildRemoved. There is no similar event called “DescendantRemoved”.

If a descendant has children, this event fires with the descendant first followed by its descendants.

## Example

The example below should help clarify how DescendantRemoving fires when there are several objects involved.

![A cropped screenshot of the Explorer window. A Model contains ModelA and ModelB, which each contain a Part, PartA and PartB respectively. PartA contains a Fire object named FireA.](https://developer.roblox.com/assets/blte4c2d8d1b0fe590c/DescendantRemoving2.png)

- Calling [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) on **PartA** would cause DescendantRemoving to fire on both **ModelA** and **Model**, in that order.
- Setting the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of **PartA** to **ModelB** would cause DescendantRemoving to fire on **ModelA** but not **Model** (as Model would still be an ancestor of PartA).
- Calling [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) on **ModelA** would cause DescendantRemoving to fire multiple times on several objects:
  1.  On **Model** with **ModelA**, **PartA** then **FireA**.
  2.  On **ModelA**, with **PartA** then **FireA**.
  3.  On **PartA** with **FireA**.

## Warning

This event fires with the descendant object that is being removed. Attempting to set the [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) of the descendant being removed to something else **will fail** with the following warning: “Something unexpectedly tried to set the parent of X to Y while trying to set the parent of X. Current parent is Z”, where X is the removing descendant, Y is the ignored parent setting, and Z is the original parent of X. Below is an example that demonstrates this:

workspace.DescendantRemoving:Connect(function(descendant)
-- Don't manipulate the parent of descendant in this function!
-- This event fires BECAUSE the parent of descendant was manipulated,
-- and the change hasn't happened yet, i.e. this function fires before that happens.
-- Therefore, it is problematic to change the parent like this:
descendant.Parent = game
end)
local part = Instance.new("Part")
part.Parent = workspace
part.Parent = nil -- This triggers DescendantRemoving on Workspace:
--&gt; Something unexpectedly tried to set the parent of Part to NULL while trying to set the parent of Part. Current parent is Workspace.

See also [DescendantAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/DescendantAdded).

Inherited from: Instance.DescendantRemoving

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1125

##### Destroying

> **`Readonly`** `RBXScriptSignal`\<() => `void`\>

The Destroying event fires immediately before the Instance or one of its ancestors is destroyed.

The Instance will never be deleted from memory while a connected function is still using it. However, if the function yields at any point, the Instance and its descendants will be parented to `nil`.

Inherited from: Instance.Destroying

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1131

##### Name

> `string`

A non-unique identifier of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

This property is an identifier that describes an object. Names are not necessarily unique identifiers however; multiple children of an object may share the same name. Names are used to keep the object hierarchy organized, along with allowing scripts to access specific objects.

The name of an object is often used to access the object through the data model hierarchy using the following methods:

local baseplate = workspace.Baseplate
local baseplate = workspace\["Baseplate"\]
local baseplate = workspace:FindFirstChild("BasePlate")

In order to make an object accessible using the dot operator, an object's Name must follow a certain syntax. The objects name must start with an underscore or letter. The rest of the name can only contain letters, numbers, or underscores (no other special characters). If an objects name does not follow this syntax it will not be accessible using the dot operator and Lua will not interpret its name as an identifier.

If more than one object with the same name are siblings then any attempt to index an object by that name will return the only one of the objects found similar to [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild), but not always the desired object. If a specific object needs to be accessed through code, it is recommended to give it a unique name, or guarantee that none of its siblings share the same name as it.

Note, a full name showing the instance's hierarchy can be obtained using [Instance:GetFullName](https://developer.roblox.com/en-us/api-reference/function/Instance/GetFullName).

Inherited from: Instance.Name

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:566

##### Package

> `Folder`

Defined in: [src/services.d.ts:2](https://github.com/AetherInteractiveLtd/Tina/blob/7f2c41e/src/services.d.ts#L2)

##### Parent

> `undefined` \| `Instance`

The Parent property determines the hierarchical parent of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). The following terminology is commonly used when talking about how this property is set:

- An object is a **child** (**parented to**) another object when its Parent is set to that object.
- The **descendants** of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) are the children of that object, plus the descendants of the children as well.
- The **ancestors** of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) are all the objects that the Instance is a descendant of.

It is from this property that many other API members get their name, such as [GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) and [FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild).

The [Remove](https://developer.roblox.com/en-us/api-reference/function/Instance/Remove) function sets this property to nil. Calling [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) will set the Parent of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) and all of its descendants to `nil`, and also **lock** the Parent property. An error is raised when setting the Parent of a destroyed object.

This property is also used to manage whether an object exists in the game or needs be be removed. As long as an objects parent is in the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel), is stored in a variable, or is referenced by another objects property, then the object remains in the game. Otherwise, the object will automatically be removed. The top level [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) object (the one referred to as the `game` by scripts) has no parent, but always has a reference held to it by the game engine, and exists for the duration of a session.

Newly created objects using `Instance.new` will not have a parent, and usually will not be visible or function until one is set. The most elementary creation of an object has two steps: creating the object, then setting its parent.

\-- Create a part and parent it to the workspace
local part = Instance.new("Part")
part.Parent = workspace
-- Instance new can also take Parent as a second parameter
Instance.new("NumberValue", workspace)

# Object Replication

An object created by server will not replicate to clients until it is parented to some object that is replicated. When creating an object then setting many properties, it's recommended to **set Parent last**. This ensures the object replicates once, instead of replicating many property changes.

local part = Instance.new("Part") -- Avoid using the second parameter here
part.Anchored = true
part.BrickColor = BrickColor.new("Really red")
-- Potentially many other property changes could go here here...
-- Always set parent last!
part.Parent = workspace

However, if you were parenting your parts to a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) whose parent hasn't been set yet, then setting the parent first would not matter as the model would not have replicated yet.
Tags: NotReplicated

Inherited from: Instance.Parent

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:603

#### Methods

##### ClearAllChildren()

This function destroys all of an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s children.

As [Instance:Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) also calls itself on the children of an object it is used on, this function will destroy all descendants.

## Alternatives to ClearAllChildren

If the developer does not wish to destroy all descendants, they should use [Instance:GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) or [Instance:GetDescendants](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDescendants) to loop through an object and select what to destroy. For example, the following code sample will destroy all parts in an object.

for \_, instance in pairs(object:GetDescendants()) do
if instance:IsA("BasePart") then
instance:Destroy()
end
end

###### Signature

```ts
ClearAllChildren(this: Instance): void;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`void`

Inherited from: Instance.ClearAllChildren

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:620

##### Clone()

**Clone** creates a copy of an object and all of its descendants, ignoring all objects that are not [Archivable](https://developer.roblox.com/en-us/api-reference/property/Instance/Archivable). The copy of the root object is returned by this function and its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is set to nil.

If a reference property such as [ObjectValue.Value](https://developer.roblox.com/en-us/api-reference/property/ObjectValue/Value) is set in a cloned object, the value of the copy's property depends on original's value:

- If a reference property refers to an object that was **also** cloned, an _internal reference_, the copy will refer to the copy.
- If a reference property refers to an object that was **not** cloned, an _external reference_, the same value is maintained in the copy.

This function is typically used to create models that can be regenerated. First, get a reference to the original object. Then, make a copy of the object and insert the copy by setting its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) to the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) or one of its descendants. Finally, when it's time to regenerate the model, [Destroy](https://developer.roblox.com/en-us/api-reference/function/Instance/Destroy) the copy and clone a new one from the original like before.

###### Signature

```ts
Clone<T>(this: T): T;
```

###### Type parameters

- `T` _extends_ `Instance`\<`T`\>

###### Parameters

| Name   | Type |
| :----- | :--- |
| `this` | `T`  |

###### Returns

`T`

Inherited from: Instance.Clone

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:631

##### Destroy()

Sets the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property to nil, locks the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property, disconnects all connections, and calls Destroy on all children. This function is the correct way to dispose of objects that are no longer required. Disposing of unneeded objects is important, since unnecessary objects and connections in a place use up memory (this is called a **memory leak**) which can lead to serious performance issues over time.

**Tip:** After calling Destroy on an object, set any variables referencing the object (or its descendants) to nil. This prevents your code from accessing anything to do with the object.

local part = Instance.new("Part")
part.Name = "Hello, world"
part:Destroy()
-- Don't do this:
print(part.Name) --> "Hello, world"
-- Do this to prevent the above line from working:
part = nil

Once an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) has been destroyed by this method it cannot be reused because the [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property is locked. To temporarily remove an object, set [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) it to nil instead. For example:

object.Parent = nil
wait(2)
object.Parent = workspace

To Destroy an object after a set amount of time, use [Debris:AddItem](https://developer.roblox.com/en-us/api-reference/function/Debris/AddItem).

###### Signature

```ts
Destroy(this: Instance): void;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`void`

Inherited from: Instance.Destroy

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:653

##### FindFirstAncestor()

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) is equal to the given name.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

The following code snippet would find the first ancestor of the object named 'Car'.

local car = object:FindFirstAncestor("Car")

For variants of this function that find ancestors of a specific class, please see [Instance:FindFirstAncestorOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorOfClass) and [Instance:FindFirstAncestorWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorWhichIsA).

###### Signature

```ts
FindFirstAncestor(this: Instance, name: string): undefined | Instance;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |
| `name` | `string`   |

###### Returns

`undefined` \| `Instance`

Inherited from: Instance.FindFirstAncestor

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:665

##### FindFirstAncestorOfClass()

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Instance.ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) is equal to the given className.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

A common use of this function is finding the [Model](https://developer.roblox.com/en-us/api-reference/class/Model) a [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) belongs to. For example:

local model = part:FindFirstAncestorOfClass("Model")

This function is a variant of [Instance:FindFirstAncestor](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestor) which checks the [Instance.ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) property rather than [Instance.Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name). [Instance:FindFirstAncestorWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorWhichIsA) also exists, using the [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) method instead to respect class inheritance.

###### Signature

```ts
FindFirstAncestorOfClass<T>(this: Instance, className: T): undefined | Instances[T];
```

###### Type parameters

- `T` _extends_ keyof `Instances`

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `className` | `T`        |

###### Returns

`undefined` \| `Instances`[`T`]

Inherited from: Instance.FindFirstAncestorOfClass

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:677

##### FindFirstAncestorWhichIsA()

Returns the first ancestor of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) for whom [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) returns true for the given className.

This function works upwards, meaning it starts at the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s immediate [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) and works up towards the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel). If no matching ancestor is found, it returns nil.

Unlike [Instance:FindFirstAncestorOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestorOfClass), this function uses [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) which respects class inheritance. For example:

print(part:IsA("Part")) --&gt; true
print(part:IsA("BasePart")) --&gt; true
print(part:IsA("Instance")) --&gt; true

Therefore, the following code sample will return the first [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) ancestor, regardless of if it is a [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart) or [Part](https://developer.roblox.com/en-us/api-reference/class/Part).

local part = object:FindFirstAncestorWhichIsA("BasePart")

See also, [Instance:FindFirstAncestor](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstAncestor).

###### Signature

```ts
FindFirstAncestorWhichIsA<T>(this: Instance, className: T): undefined | Instances[T];
```

###### Type parameters

- `T` _extends_ keyof `Instances`

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `className` | `T`        |

###### Returns

`undefined` \| `Instances`[`T`]

Inherited from: Instance.FindFirstAncestorWhichIsA

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:695

##### FindFirstChild()

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) found with the given name. If no child exists with the given name, this function returns nil. If the optional recursive argument is true, this function searches all descendants rather than only the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance). Use this function if your code cannot guarantee the existence of an object with a given name.

## Checking the Existence of An Object

FindFirstChild is necessary if you need to verify an object something exists before continuing. Attempting to index a child by name using the dot operator throws an error if the child doesn't exist.

\-- The following line errors if Part doesn't exist in the Workspace:
workspace.Part.Transparency = 0.5

Use FindFirstChild to first check for Part, then use an if-statement to run code that needs it.

local part = workspace:FindFirstChild("Part")
if part then
part.Transparency = 0.5
end

## Finding a Child Whose Name Matches a Property

Sometimes the [Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) of an object is the same as that of a property of its [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent). When using the dot operator, properties take precedence over children if they share a name.

In the following example, a [Folder](https://developer.roblox.com/en-us/api-reference/class/Folder) called “Color” is added to a [Part](https://developer.roblox.com/en-us/api-reference/class/Part), which also has the `Part/Color` property. `Part.Color` refers to the [Color3](https://developer.roblox.com/en-us/api-reference/datatype/Color3), not the Folder.

local part = Instance.new("Part")
local folder = Instance.new("Folder")
folder.Name = "Color"
folder.Parent = part
local c = part.Color --> A Color3
local c2 = part:FindFirstChild("Color") --> The Folder

A benefit of using FindFirstChild in this way is that the introduction of new properties does not impose a risk on your code.

**Tip:** If you only need to use the result of a FindFirstChild call once, such as getting the property of a child if it exists, you can use the following syntax with the `and` operator:

local myColor = workspace:FindFirstChild("SomePart") and workspace.SomePart.Color

If SomePart exists, `myColor` will contain the Color of SomePart. Otherwise, it'll be nil without throwing an error. This works due to short-circuiting: Lua ignores the right side if the left is nil/false

## Performance Note

FindFirstChild takes about 20% longer than using dot operator, and almost 8 times longer than simply storing a reference to an object. Therefore, you should avoid calling FindFirstChild in performance dependent code, such as in tight loops or functions connected to [RunService.Heartbeat](https://developer.roblox.com/en-us/api-reference/event/RunService/Heartbeat)/[RunService.RenderStepped](https://developer.roblox.com/en-us/api-reference/event/RunService/RenderStepped). **Store the result in a variable,** or consider using [ChildAdded](https://developer.roblox.com/en-us/api-reference/event/Instance/ChildAdded) or [WaitForChild](https://developer.roblox.com/en-us/api-reference/function/Instance/WaitForChild) to detect when a child of a given name becomes available.

###### Signature

```ts
FindFirstChild(this: Instance, childName: string | number, recursive?: boolean): undefined | Instance;
```

###### Parameters

| Name         | Type                 |
| :----------- | :------------------- |
| `this`       | `Instance`           |
| `childName`  | `string` \| `number` |
| `recursive?` | `boolean`            |

###### Returns

`undefined` \| `Instance`

Inherited from: Instance.FindFirstChild

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:741

##### FindFirstChildOfClass()

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) is equal to the given className.

If no matching child is found, this function returns nil.

Unlike [Instance:FindFirstChildWhichIsA](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildWhichIsA) this function uses only returns objects whose class matches the given className, ignoring class inheritance.

Developers looking for a child by name should use [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) instead.

###### Signature

```ts
FindFirstChildOfClass<T>(this: Instance, className: T): undefined | Instances[T];
```

###### Type parameters

- `T` _extends_ keyof `Instances`

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `className` | `T`        |

###### Returns

`undefined` \| `Instances`[`T`]

Inherited from: Instance.FindFirstChildOfClass

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:751

##### FindFirstChildWhichIsA()

Returns the first child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) for whom [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) returns true for the given className.

If no matching child is found, this function returns nil. If the optional recursive argument is true, this function searches all descendants rather than only the immediate children of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

Unlike [Instance:FindFirstChildOfClass](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChildOfClass), this function uses [Instance:IsA](https://developer.roblox.com/en-us/api-reference/function/Instance/IsA) which respects class inheritance. For example:

print(part:IsA("Part")) --> true
print(part:IsA("BasePart")) --> true
print(part:IsA("Instance")) --> true

Therefore, the following code sample will return the first [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) child, regardless of if it is a [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), [MeshPart](https://developer.roblox.com/en-us/api-reference/class/MeshPart) or [Part](https://developer.roblox.com/en-us/api-reference/class/Part).

local part = object:FindFirstChildWhichIsA("BasePart")

Developers looking for a child by name, should use [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) instead.

###### Signature

```ts
FindFirstChildWhichIsA<T>(this: Instance, className: T, recursive?: boolean): undefined | Instances[T];
```

###### Type parameters

- `T` _extends_ keyof `Instances`

###### Parameters

| Name         | Type       |
| :----------- | :--------- |
| `this`       | `Instance` |
| `className`  | `T`        |
| `recursive?` | `boolean`  |

###### Returns

`undefined` \| `Instances`[`T`]

Inherited from: Instance.FindFirstChildWhichIsA

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:769

##### FindFirstDescendant()

Returns the first descendant found with the given [Instance.Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name).

###### Signature

```ts
FindFirstDescendant(this: Instance, name: string): undefined | Instance;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |
| `name` | `string`   |

###### Returns

`undefined` \| `Instance`

Inherited from: Instance.FindFirstDescendant

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:777

##### GetActor()

Returns the Actor associated with the Instance, usually the first Actor ancestor

###### Signature

```ts
GetActor(this: Instance): Actor;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`Actor`

Inherited from: Instance.GetActor

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:781

##### GetAttribute()

This function returns the attribute which has been assigned to the given name. If no attribute has been assigned then nil is returned.

For example, the following code snippet will set the value of the instance's `InitialPostion` attribute. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local initialPosition = instance:GetAttribute("InitialPosition")

# See also

- [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
- [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
- [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
- [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

###### Signature

```ts
GetAttribute(this: Instance, attribute: string): undefined | AttributeValue;
```

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `attribute` | `string`   |

###### Returns

`undefined` \| `AttributeValue`

Inherited from: Instance.GetAttribute

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:797

##### GetAttributeChangedSignal()

This function returns an event that behaves exactly like the `Changed` event, except that the event only fires when the given attribute changes. It's generally a good idea to use this method instead of a connection to Changed with a function that checks the attribute name. Subsequent calls to this method on the same object with the same attribute name return the same event.

It is similar to [Instance:GetPropertyChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetPropertyChangedSignal) but for attributes.

For example, the following code snippet will return a signal that fires the function [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged) when the instance's `InitialPosition` attribute changes. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local function attributeChanged()
print(“Attribute changed”)
end

instance:GetAttributeChangedSignal("InitialPosition"):Connect(attributeChanged)

# See also

- [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
- [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
- [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
- [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance

###### Signature

```ts
GetAttributeChangedSignal(this: Instance, attribute: string): RBXScriptSignal<Callback>;
```

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `attribute` | `string`   |

###### Returns

`RBXScriptSignal`\<`Callback`\>

Inherited from: Instance.GetAttributeChangedSignal

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:819

##### GetAttributes()

This function returns a dictionary of string → variant pairs for each attribute where the string is the name of the attribute and the variant is a non-nil value.

For example, the following code snippet will print an instance's attributes and values. Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

local attributes = instance:GetAttributes()
for name, value in pairs(attributes) do
print(name .. “ “ .. value)
end

# See also

- [Instance:SetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/SetAttribute), sets the attribute with the given name to the given value
- [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
- [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
- [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

###### Signature

```ts
GetAttributes(this: Instance): Map<string, AttributeValue>;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`Map`\<`string`, `AttributeValue`\>

Inherited from: Instance.GetAttributes

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:838

##### GetChildren()

Returns an array (a numerically indexed table) containing all of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s direct children, or every [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) whose [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is equal to the object. The array can be iterated upon using either a numeric or generic for-loop:

\-- Numeric for-loop example
local children = workspace:GetChildren()
for i = 1, #children do
local child = children\[i\]
print(child.Name .. " is child number " .. i)
end\-- Generic for-loop example
local children = workspace:GetChildren()
for i, child in ipairs(children) do
print(child.Name .. " is child number " .. i)
end

The children are sorted by the order in which their [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) property was set to the object.

See also the [GetDescendants](https://developer.roblox.com/en-us/api-reference/function/Instance/GetDescendants) function.

###### Signature

```ts
GetChildren(this: Instance): Instance[];
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`Instance`[]

Inherited from: Instance.GetChildren

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:857

##### GetDescendants()

The **GetDescendants** function of an object returns an array that contains all of the descendants of that object. Unlike [Instance:GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren), which only returns the immediate children of an object, GetDescendants will find every child of the object, every child of those children, and so on.

The arrays returned by GetDescendants are arranged so that parents come earlier than their children. Refer to the following example of a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace):

![Workspace Descendants](https://developer.roblox.com/assets/blt0c3edf2a368c36c8/GetDescendantsExample.png)

Inside this model are three parts (C, D, and E) and another model (InnerModel). Inside the inner model are two more parts (A and B). Calling GetDescendants on the first model and printing the contents of the returned array would print the first level of children (InnerModel, C, D, and E) before A and B.

local descendants = game.Workspace.Model:GetDescendants()

-- Loop through all of the descendants of the model and
-- print out their name
for index, descendant in pairs(descendants) do
print(descendant.Name)
end

-- Prints:
-- C
-- D
-- E
-- InnerModel
-- A
-- B
Tags: CustomLuaState

###### Signature

```ts
GetDescendants(this: Instance): Instance[];
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`Instance`[]

Inherited from: Instance.GetDescendants

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:884

##### GetFullName()

Returns a string describing the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s ancestry. The string is a concatenation of the [Name](https://developer.roblox.com/en-us/api-reference/property/Instance/Name) of the object and its ancestors, separated by periods. The [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) (`game`) is not considered. For example, a [Part](https://developer.roblox.com/en-us/api-reference/class/Part) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) may return `Workspace.Part`.

When called on an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) that is not a descendant of the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel), this function considers all ancestors up to and including the topmost one without a [Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent).

This function is useful for logging and debugging. You shouldn't attempt to parse the returned string for any useful operation; this function does not escape periods (or any other symbol) in object names. In other words, although its output often appears to be a valid Lua identifier, it is not guaranteed.

###### Signature

```ts
GetFullName(this: Instance): string;
```

###### Parameters

| Name   | Type       |
| :----- | :--------- |
| `this` | `Instance` |

###### Returns

`string`

Inherited from: Instance.GetFullName

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:892

##### GetPropertyChangedSignal()

This method returns an event that behaves exactly like the `Changed` event, except that the event only fires when the given property changes. It's generally a good idea to use this method instead of a connection to `Changed` with a function that checks the property name. Subsequent calls to this method on the same object with the same property name return the same event.

`print(object:GetPropertyChangedSignal("Name") == object:GetPropertyChangedSignal("Name")) --&gt; always true`

[ValueBase](https://developer.roblox.com/en-us/api-reference/class/ValueBase) objects, such as [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue) and [StringValue](https://developer.roblox.com/en-us/api-reference/class/StringValue), use a modified `Changed` event that fires with the contents of the `Value` property. As such, this method provides a way to detect changes in other properties of those objects. For example, to detect changes in the `Name` property of an [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue), use `IntValue:GetPropertyChangedSignal("Name"):Connect(someFunc)` since the `Changed` event of [IntValue](https://developer.roblox.com/en-us/api-reference/class/IntValue) objects only detect changes on the `Value` property.

###### Signature

```ts
GetPropertyChangedSignal<T>(this: T, propertyName: Exclude<ExcludeKeys<T, symbol | Callback | RBXScriptSignal<Callback>>, "Changed">): RBXScriptSignal<() => void>;
```

###### Type parameters

- `T` _extends_ `Instance`\<`T`\>

###### Parameters

| Name           | Type                                                                                                      |
| :------------- | :-------------------------------------------------------------------------------------------------------- |
| `this`         | `T`                                                                                                       |
| `propertyName` | `Exclude`\<`ExcludeKeys`\<`T`, `symbol` \| `Callback` \| `RBXScriptSignal`\<`Callback`\>\>, `"Changed"`\> |

###### Returns

`RBXScriptSignal`\<() => `void`\>

Inherited from: Instance.GetPropertyChangedSignal

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:900

##### IsA()

IsA returns true if the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s class is **equivalent to** or a **subclass** of a given class. This function is similar to the **instanceof** operators in other languages, and is a form of [type introspection](https://en.wikipedia.org/wiki/Type_introspection). To ignore class inheritance, test the [ClassName](https://developer.roblox.com/en-us/api-reference/property/Instance/ClassName) property directly instead. For checking native Lua data types (number, string, etc) use the functions `type` and `typeof`.

Most commonly, this function is used to test if an object is some kind of part, such as [Part](https://developer.roblox.com/en-us/api-reference/class/Part) or [WedgePart](https://developer.roblox.com/en-us/api-reference/class/WedgePart), which inherits from [BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) (an abstract class). For example, if your goal is to change all of a [Character](https://developer.roblox.com/en-us/api-reference/property/Player/Character)'s limbs to the same color, you might use [GetChildren](https://developer.roblox.com/en-us/api-reference/function/Instance/GetChildren) to iterate over the children, then use IsA to filter non-[BasePart](https://developer.roblox.com/en-us/api-reference/class/BasePart) objects which lack the `BrickColor` property:

local function paintFigure(character, color)
-- Iterate over the child objects of the character
for \_, child in pairs(character:GetChildren()) do
-- Filter out non-part objects, such as Shirt, Pants and Humanoid
-- R15 use MeshPart and R6 use Part, so we use BasePart here to detect both:
if child:IsA("BasePart") then
child.BrickColor = color
end
end
end
paintFigure(game.Players.Player.Character, BrickColor.new("Bright blue"))

Since all classes inherit from [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance), calling `object:IsA("Instance")` will always return true.
Tags: CustomLuaState

###### Signature

```ts
IsA<T>(this: Instance, className: T): this is Instances[T];
```

###### Type parameters

- `T` _extends_ keyof `Instances`

###### Parameters

| Name        | Type       |
| :---------- | :--------- |
| `this`      | `Instance` |
| `className` | `T`        |

###### Returns

`this is Instances[T]`

Inherited from: Instance.IsA

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:924

##### IsAncestorOf()

Returns true if an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is an ancestor of the given descendant.

An [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is considered the ancestor of an object if the object's [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) or one of it's parent's [Instance.Parent](https://developer.roblox.com/en-us/api-reference/property/Instance/Parent) is set to the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance).

See also, [Instance:IsDescendantOf](https://developer.roblox.com/en-us/api-reference/function/Instance/IsDescendantOf).

###### Signature

```ts
IsAncestorOf(this: Instance, descendant: Instance): boolean;
```

###### Parameters

| Name         | Type       |
| :----------- | :--------- |
| `this`       | `Instance` |
| `descendant` | `Instance` |

###### Returns

`boolean`

Inherited from: Instance.IsAncestorOf

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:932

##### IsDescendantOf()

Returns true if an [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is a descendant of the given ancestor.

An [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) is considered the descendant of an object if the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance)'s parent or one of its parent's parent is set to the object.

Note, [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) is a descendant of nil. This means IsDescendantOf cannot be used with a parameter of nil to check if an object has been removed.

See also, [Instance:IsAncestorOf](https://developer.roblox.com/en-us/api-reference/function/Instance/IsAncestorOf).

###### Signature

```ts
IsDescendantOf(this: Instance, ancestor: Instance): boolean;
```

###### Parameters

| Name       | Type       |
| :--------- | :--------- |
| `this`     | `Instance` |
| `ancestor` | `Instance` |

###### Returns

`boolean`

Inherited from: Instance.IsDescendantOf

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:942

##### SetAttribute()

This function sets the attribute with the given name to the given value. If the value given is nil, then the attribute will be removed (since nil is returned by default).

For example, the following code snippet will set the instance's `InitialPosition` attribute to [Vector3.new(0, 0, 0)](https://developer.roblox.com/en-us/api-reference/datatype/Vector3). Note that this code sample does not define [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance):

instance:SetAttribute("InitialPosition", Vector3.new(0, 0, 0))

# Limitations

Naming requirements and restrictions:

- Names must only use alphanumeric characters and underscore
- No spaces or unique symbols are allowed
- Strings must be 100 characters or less
- Names are not allowed to start with RBX unless the caller is a Roblox core-script (reserved for Roblox)

When attempting to set an attribute to an unsupported type, an error will be thrown.

# See also

- [Instance:GetAttribute](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttribute), returns the attribute which has been assigned to the given name
- [Instance:GetAttributes](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributes), returns a dictionary of string → variant pairs for each of the instance's attributes
- [Instance.AttributeChanged](https://developer.roblox.com/en-us/api-reference/event/Instance/AttributeChanged), fires whenever an attribute is changed on the instance
- [Instance:GetAttributeChangedSignal](https://developer.roblox.com/en-us/api-reference/function/Instance/GetAttributeChangedSignal), returns an event that fires when the given attribute changes

###### Signature

```ts
SetAttribute(this: Instance, attribute: string, value: undefined | AttributeValue): void;
```

###### Parameters

| Name        | Type                            |
| :---------- | :------------------------------ |
| `this`      | `Instance`                      |
| `attribute` | `string`                        |
| `value`     | `undefined` \| `AttributeValue` |

###### Returns

`void`

Inherited from: Instance.SetAttribute

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:970

##### WaitForChild()

Returns the child of the [Instance](https://developer.roblox.com/en-us/api-reference/class/Instance) with the given name. If the child does not exist, it will yield the current thread until it does.

If the _timeOut_ parameter is specified, this function will return nil and time out after _timeOut_ seconds elapsing without the child being found.

## Where should WaitForChild be used?

WaitForChild is extremely important when working on code ran by the client (in a [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript)). Roblox does not guarantee the time or order in which objects are replicated from the server to the client. This can cause scripts to break when indexing objects that do not exist yet.

For example, a [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript) may access a [Model](https://developer.roblox.com/en-us/api-reference/class/Model) in the [Workspace](https://developer.roblox.com/en-us/api-reference/class/Workspace) called 'Ship' like so:

local ship = workspace.Ship
-- Will error if ship hasn't replicated

However if the model 'Ship' has not replicated to the client when this code is ran an error will be returned breaking the [LocalScript](https://developer.roblox.com/en-us/api-reference/class/LocalScript).

Another alternative is using [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild). Not only is this good practice when indexing objects in the [DataModel](https://developer.roblox.com/en-us/api-reference/class/DataModel) (as it avoids accidentally accessing properties) but it does not break if the object does not exist. For example:

local ship = workspace:FindFirstChild("Ship")
-- Won't error, but ship will be nil if the ship hasn't replicated

Here, if the model doesn't exist the code will not error. Instead the value ship will be equal to nil. This is better, but still not much good if we want to use the ship model.

Instead WaitForChild should be used:

local ship = workspace:WaitForChild("Ship")
-- Will wait until the ship has replicated before continuing

Here, the thread will be yielded until the ship model has been found. This means the ship model can be used as soon as it is ready.

## Notes

- If a call to this function exceeds 5 seconds without returning, and no _timeOut_ parameter has been specified, a warning will be printed to the output that the thread may yield indefinitely; this warning takes the form `Infinite yield possible on 'X:WaitForChild("Y")'`, where X is the parent name and Y is the child object name.
- This function does not yield if a child with the given name exists when the call is made.
- This function is less efficient than [Instance:FindFirstChild](https://developer.roblox.com/en-us/api-reference/function/Instance/FindFirstChild) or the dot operator. Therefore, it should only be used when the developer is not sure if the object has replicated to the client. Generally this is only the first time the object is accessed
  Tags: CustomLuaState, CanYield

###### Signature

```ts
WaitForChild(this: Instance, childName: string | number): Instance;
```

###### Parameters

| Name        | Type                 |
| :---------- | :------------------- |
| `this`      | `Instance`           |
| `childName` | `string` \| `number` |

###### Returns

`Instance`

Inherited from: Instance.WaitForChild

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1010

###### Signature

```ts
WaitForChild(this: Instance, childName: string | number, timeOut: number): undefined | Instance;
```

###### Parameters

| Name        | Type                 |
| :---------- | :------------------- |
| `this`      | `Instance`           |
| `childName` | `string` \| `number` |
| `timeOut`   | `number`             |

###### Returns

`undefined` \| `Instance`

Inherited from: Instance.WaitForChild

Defined in: node_modules/@rbxts/types/include/generated/None.d.ts:1011
