import { Workspace } from "@rbxts/services";
import Tina, { Component, Interaction, User, World } from "@rbxts/tina";
import { ALL, Query } from "@rbxts/tina/out/lib/ecs/query";

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
    "pos": 
});

let ent = world.add();

world.addComponent(ent, "pos", { data: new Vector3() })

let query = world.createQuery(ALL(world.getComponentObject("pos") as Component));

query.forEach((entityId) => {
    return true;
});