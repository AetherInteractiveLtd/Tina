export declare type Contents = object | undefined;

export declare type ClientListener = (contents: Contents) => unknown;
export declare type ServerListener = (player: Player, contents: Contents) => unknown;

export declare type InitialPacket = {
	id: string;
	to: Array<Player>;
	contents: Contents;
};

export declare type Packet = {
	id: string;
	contents: Contents;
};
