export interface Manifest {
	name: string;
	version: string;
	description: string;
	config: {
		ecs: {
			max_entities: number;
		};
		net: {
			compression: boolean;
		};
		supported_languages: Array<string>;
		max_fps: number;
		max_players: number;
	};

	tina: "dev" | "stable" | string;
}
