import { Component } from "@rbxts/tina";
import { ComponentTypes } from "@rbxts/tina/out/lib/ecs/component";

export = new (class Position extends Component {
    public declare x: ComponentTypes.Number;
})();
