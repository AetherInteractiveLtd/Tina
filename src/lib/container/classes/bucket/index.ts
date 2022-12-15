import { DataStoreService } from "@rbxts/services";

import { DataSaved, Template } from "../../types";
import { dataStoreQueueCall, registerIssue, servicesAvailable, setItemToAutoSave } from "../../utilities/datastore";
import { Item } from "../item";
import { ItemDeclaration, ItemType } from "../item/types";
import { BucketImplementation } from "./types";

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

	public async getItem(itemKey: string): Promise<ItemType<T> | undefined> {
		assert(
			type(itemKey) === "string" || itemKey.size() !== 0,
			"[Container_Bucket[%s]]: Item's key can't be of another type than a string and it needs to have a length > 0.",
		);

		if (this.template === undefined) {
			registerIssue(itemKey, "There wasn't a Bucket template provided, please provide a template.");
		}

		if (this.items.has(itemKey) === true) {
			registerIssue(itemKey, "Item was already loaded, you can't load the Item more than one time per session.");

			return;
		}

		while (servicesAvailable === true) {
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

				loadJob.data_saved = dataStoreQueueCall(itemKey, this, {
					setItem: <T>(object: T, keyInfo: DataStoreKeyInfo): void => {},
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

				setItemToAutoSave(item); // Add it to being autosaved

				return item;
			} else {
				task.wait();
			}
		}
	}

	public getMetadata() {
		return this.bucket_metadata;
	}
}
