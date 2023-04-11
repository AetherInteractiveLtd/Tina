export declare interface InternalNetworkingEvents {
	"user:added": [{ id: number }];
	"user:removing": [{ id: number }];

	"state:replicated": [{ stateName: string; value: unknown }];
}
