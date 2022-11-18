import { BaseEndpoint } from "./baseEndpoint";
import { ClientRemoteObjectDeclaration } from "./types";

export class ClientRemote<T extends unknown[]> extends BaseEndpoint<T> implements ClientRemoteObjectDeclaration<T> {}
