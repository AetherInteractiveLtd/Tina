// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Template = { [x: string]: any };

export type Metadata = {
	last_bucket_on: string;
	last_connection_timestamp: number; // metadata fields should be snake_case
	load_timestamp: number;
	version: string;

	is_first_session: boolean;
};

export interface DataSaved {
	[x: string]: unknown;

	key: string;
	data: Template;
	metadata: Metadata;

	userIds: Array<number>; // GDPR compliances}
}
