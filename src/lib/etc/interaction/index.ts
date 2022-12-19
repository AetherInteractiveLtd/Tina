import { EventEmitter } from "../../events";
import { User } from "../../user";
import { DefaultUser } from "../../user/types";

interface InteractionEvents {
    /** Usually the click event. */
    "interacted": (user: DefaultUser & never) => void;
}

export class Interaction<X extends Instance = Instance> extends EventEmitter<InteractionEvents> {
    private clickDet?: ClickDetector;

    constructor(public instance: X) {
        super();
        this.setupListeners();
    }

    private setupListeners() {
        switch(this.instance.ClassName) {
            case "Part":
                let part = (this.instance as never as BasePart);

                let clickDet = this.clickDet = new Instance("ClickDetector");
                clickDet.Parent = part;

                clickDet.MouseClick.Connect((plr: Player) => {
                    this.emit("interacted", User.get(plr) as never);
                });

                break;
        }
    }
}