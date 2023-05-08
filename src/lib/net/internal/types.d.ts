export declare interface InternalNetworkingEvents {
	"user:added": [{ id: number }];
	"user:removing": [{ id: number }];

	"state:replicated": [{ id: number; value: unknown }];
}
