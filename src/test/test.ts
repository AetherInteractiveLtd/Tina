import manifest from './manifest.json';
import Tina, { Protocol } from '../index';

class PlayerData {
    private _level = 0;
    level(lvl?: number): number {
        return lvl ? this._level = lvl : this._level;
    }
}

/** CLOUD = Create/Load Online User Data */
/** REPL = Live Component Replication Layer */
/** NET = Nothing Entertaining */


/** `My Cafe`, the Game! */
export const MyCafe = Tina.registerGame("FarmGame", manifest);

// Network locations:
const CLOUD = Tina.Net.protocol(Protocol.CLOUD);
const REPL = Tina.Net.protocol(Protocol.LCTRL);
const NET = Tina.Net.protocol(Protocol.NET);

export class User extends Tina.Mirror.User {
    data(): PlayerData {
        return new PlayerData();
    }
}

CLOUD.when("user:connect").run((user: User) => {
    MyCafe.do("joined", user);
});

CLOUD.when("user:disconnect").run((user: User) => {
    MyCafe.do("left", user);
});

REPL.serdes("profile")
    .ser(Tina.Net.SerializeBasic<PlayerData>)
    .des(<T extends keyof PlayerData>(profile: PlayerData, key: T, value: ReturnType<PlayerData[T]>) => {
        if (key !== "level") return Tina.Logger.panic("Non-existing key used to index Profile.");

        profile[key](value);
    });

REPL.when("profile:update").run(<T extends keyof PlayerData>(profile: PlayerData, key: T, value: ReturnType<PlayerData[T]>) => {
    if (key === "level") {
        // do level up effects.
    }
})

// Core:
MyCafe.when("joined").run((user: User) => {
    user.load();
});

MyCafe.when("left").run((user: User) => {
    user.unload();
});

MyCafe.core().set("data:load", (user: User) => {
    let save = { level: 0 };
    user.data().level(save.level ?? 0);
});
