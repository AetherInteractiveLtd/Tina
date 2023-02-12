import { DataStoreService } from "@rbxts/services";

import { TableUtil } from "../../../utilities/tables";
import { Autosave, Data, registerIssue } from "../../data_actions";
import { DataSaved, Template } from "../../types";
import { Item } from "../item";
import { ItemDeclaration, ItemType } from "../item/types";
import { BucketImplementation, BucketMetadata } from "./types";

export class Bucket<T extends Template> implements BucketImplementation<T> {
	public readonly bucket_metadata = {};
	public _globalDataStore: DataStore;

	private loadIndex = 0;

	private readonly items: Map<string, ItemDeclaration<T>> = new Map();
	private readonly load_jobs: Map<
		string,
		{ id: number; data_saved: [DataSaved | Template, DataStoreKeyInfo] | undefined }
	> = new Map();

	constructor(public key: string, public template: T) {
		this._globalDataStore = DataStoreService.GetDataStore(key);
	}

	public getItem(itemKey: string): ItemType<T> | undefined {
		assert(
			type(itemKey) === "string" || itemKey.size() !== 0,
			"[Container_Bucket[%s]]: Items must be of type string and need to have a length >= 1",
		);

		if (this.template === undefined) {
			registerIssue(itemKey, "There wasn't a Bucket template provided, please provide a template.");
		}

		if (this.items.has(itemKey) === true) {
			registerIssue(itemKey, "Item was already loaded, you can't load the Item more than one time per session.");

			return;
		}

		while (Data.servicesAvailable === true) {
			let loadedData!: DataSaved | Template;
			let keyInfo!: DataStoreKeyInfo;

			const loadJobs = this.load_jobs;
			let loadJob = loadJobs.get(itemKey);

			const id = this.loadIndex + 1;

			if (loadJob !== undefined) {
				loadJob.id = id;

				while (loadJob.data_saved === undefined) {
					task.wait();
				}

				if (loadJob.id === id) {
					[loadedData, keyInfo] = loadJob.data_saved!;

					this.load_jobs.delete(itemKey);
				}
			} else {
				loadJob = { id, data_saved: undefined };
				this.load_jobs.set(itemKey, loadJob);

				loadJob.data_saved = Data.queueCall(itemKey, this, {
					missingItem: (object: Template): void => {
						object.data = TableUtil.deepCopy(this.template);

						object.metadata = {
							last_bucket_on: this.key,
							last_connection_timestamp: os.time(),
							load_timestamp: os.clock(),
							is_first_session: true,
							version: 1,
						};

						object.userIds = new Array();
					},
				});
			}

			if (loadedData !== undefined && type(loadedData) && keyInfo !== undefined) {
				const item = new Item({
					key: loadedData.key,
					keyInfo: keyInfo,
					userIds: loadedData.userIds,
					data: loadedData.data,
					metadata: loadedData.metadata,
					bucketOn: this,
				});

				Autosave.set(item); // Add it to being autosaved

				return item;
			} else {
				task.wait();
			}
		}
	}

	public getMetadata(): BucketMetadata {
		return this.bucket_metadata;
	}
}
