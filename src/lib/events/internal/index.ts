import { EventEmitter } from "..";
import { TinaInternalEvents } from "./types";

class InternalEvents extends EventEmitter<TinaInternalEvents> {}

export const TinaEvents = new InternalEvents();
