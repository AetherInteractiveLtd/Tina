import { Workspace } from "@rbxts/services";
import Tina, { Component, Interaction, User, World } from "@rbxts/tina";
import { ALL, Query } from "@rbxts/tina/out/lib/ecs/query";
import { System } from "@rbxts/tina/out/lib/ecs/system";
import { UnimplementedWorld } from "@rbxts/tina/out/lib/ecs/world";

let interaction = new Interaction(Workspace.FindFirstChild("Part")!);

let i = 0;

class MyUser extends User {
    public doThing() {
        print("Hello World");
    }
}

Tina.setUserClass(MyUser);

interaction.when("interacted")
    .do((user: MyUser) => {
        i++;
        user.getGui("ScreenGui")!.FindFirstChildWhichIsA("TextLabel")!.Text = tostring(i);
    });

let world = new World({}, {
    "pos": {
        a: Vector3
    }
});

let ent = world.add();

world.addComponent(ent, "pos", { a: new Vector3() })

let query = world.createQuery(ALL(world.getComponentObject("pos") as Component));

class Runnable extends System {
    public onUpdate(world: UnimplementedWorld): void {
        
    }
}

world.scheduleSystem(new Runnable());

query.forEach((entityId) => {
    world.getComponent(entityId, "pos").a = new Vector3(1, 2, 3);

    return true;
});
