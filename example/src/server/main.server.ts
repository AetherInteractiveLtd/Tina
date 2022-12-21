import { Workspace } from "@rbxts/services";
import Tina, { Interaction, User } from "@rbxts/tina";

class MyUser extends User {
    public doThing() {
        print("Hello World");
    }
}

Tina.setUserClass(MyUser);

Tina.registerGame("game");

Tina.core().when("player:added").do((plr: MyUser) => {
    plr.doThing();
});