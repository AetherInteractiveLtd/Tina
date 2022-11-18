import { BaseEndpoint } from "./baseEndpoint";
import { ServerRemoteObjectDeclaration } from "./types";

export class ServerRemote<T extends unknown[]> extends BaseEndpoint<T> implements ServerRemoteObjectDeclaration<T> {}
