import { DataStoreService, RunService } from "@rbxts/services";

import TinaLogger from "../../util/TinaLogger";
import { BucketType } from "../classes/bucket/types";
import {
	ItemDeclaration,
	ItemLoaderJob,
	ItemMethodsDataStore,
	ItemType,
} from "../classes/item/types";
import { DataSaved, Template } from "../types";

/** Configuration */
const CALLS_COOLDOWN = 7; // In seconds

const ISSUES_LIMIT = 4; // + issues would cause a lock of the services.
let currentIssues = 0;

/** Queue */
const QUEUE: Map<string, Map<string, ItemLoaderJob>> = new Map(); // Bucket -> Item -> Loader Job

/** Loaded items */
const ITEMS: Map<string, ItemDeclaration<Template>> = new Map(); // Bucket -> Items

/** Auto saving items */
const AUTO_SAVING_ITEMS: Array<ItemDeclaration<Template>> = new Array();
const AUTO_SAVE_COOLDOWN = 60; // in seconds

let lastAutoSave = os.clock();
let autoSaveIndex = 0;

/** Issues registering, etc. */
export function registerIssue(itemKey: string, issue: string): void {
	TinaLogger.log(
		"[Container]: There was a problem within the item ([%s]), a more detailed message on the issue here: %s".format(
			itemKey,
			issue,
		),
	);

	currentIssues = currentIssues + 1;

	if (currentIssues >= ISSUES_LIMIT) {
		Data.servicesAvailable = false; // Lock all the loader jobs, and others
	}
}

/** Auto save */
export namespace Autosave {
	export function set(item: ItemType<Template>): void {
		AUTO_SAVING_ITEMS.push(item);

		const size = AUTO_SAVING_ITEMS.size();

		if (size > 1) {
			autoSaveIndex = autoSaveIndex + 1;
		} else if (size === 1) {
			lastAutoSave = os.clock();
		}
	}

	export function remove(item: ItemDeclaration<Template>): void {
		ITEMS.delete(item.bucketOn.key); // Uncaches from the items as a whole

		const foundItemIndex = AUTO_SAVING_ITEMS.indexOf(item);

		if (foundItemIndex > 0) {
			AUTO_SAVING_ITEMS.remove(foundItemIndex);

			if (foundItemIndex < autoSaveIndex) {
				autoSaveIndex = autoSaveIndex - 1;
			}

			if (!AUTO_SAVING_ITEMS[autoSaveIndex]) {
				autoSaveIndex = 1;
			}
		}
	}
}

/** Data store calls queue */
namespace DataStoreQueue {
	export function clean(bucketKey: string, itemKey: string): void {
		const bucketJobsHolder = QUEUE.get(bucketKey);

		if (bucketJobsHolder !== undefined) {
			const loaderJob = bucketJobsHolder.get(itemKey);

			if (loaderJob !== undefined) {
				const { cleanup, lastWrite } = loaderJob;

				if (cleanup === undefined) {
					loaderJob.cleanup = RunService.PostSimulation.Connect(() => {
						if (
							os.clock() - lastWrite > CALLS_COOLDOWN &&
							loaderJob.queue.size() === 0
						) {
							loaderJob.cleanup?.Disconnect();

							const loaderJobKept = bucketJobsHolder.get(itemKey);
							if (loaderJobKept !== undefined) {
								QUEUE.get(bucketKey)?.delete(itemKey);

								if (next(QUEUE.get(bucketKey) as {}) === undefined) {
									QUEUE.delete(bucketKey);
								}
							}
						}
					});
				}
			}
		}
	}

	export function call(fn: Callback, bucketKey: string, itemKey: string): ReturnType<typeof fn> {
		if (!QUEUE.get(bucketKey)) QUEUE.set(bucketKey, new Map()); // Checking if bucket has somewhere to store the items loader jobs
		if (!QUEUE.get(bucketKey)!.get(itemKey)) {
			QUEUE.get(bucketKey)!.set(itemKey, {
				cleanup: undefined,
				lastWrite: 0,
				queue: new Array(),
			});
		}

		const loaderJob = QUEUE.get(bucketKey)!.get(itemKey)!;

		if (loaderJob.cleanup !== undefined) {
			loaderJob.cleanup.Disconnect();
			loaderJob.cleanup = undefined;
		}

		const lastTime = loaderJob.lastWrite;

		if (os.clock() - lastTime > CALLS_COOLDOWN && loaderJob.queue.size() === 0) {
			loaderJob.lastWrite = os.clock();

			return fn();
		} else {
			loaderJob.queue.push(fn);

			while (true === true) {
				if (os.clock() - lastTime > CALLS_COOLDOWN && loaderJob.queue[1] === fn) {
					loaderJob.queue.shift();
					loaderJob.lastWrite = os.clock();

					return fn();
				} else {
					task.wait();
				}
			}
		}
	}
}

/* Datastore actions */
export namespace Data {
	// eslint-disable-next-line no-autofix/prefer-const
	export let servicesAvailable = true;

	export function queueCall<T extends Template = Template>(
		itemKey: string,
		bucketOn: BucketType<T>,
		methods: ItemMethodsDataStore,
	): [DataSaved, DataStoreKeyInfo] | undefined {
		let loadedData!: DataSaved;
		let keyInfo!: DataStoreKeyInfo;

		const [success, message] = pcall((): void => {
			const callback = (
				data: T | undefined,
				keyInfo: DataStoreKeyInfo,
			): LuaTuple<
				[
					newValue: object,
					userIds?: Array<number> | undefined,
					metadata?: object | undefined,
				]
			> => {
				let dataRef = data;
				let nullishData = false;
				let corrupted = false;

				if (dataRef !== undefined && type(dataRef) !== "table") {
					nullishData = true;
					corrupted = true;
				} else if (dataRef === undefined) {
					nullishData = true;
				}

				if (corrupted === true) {
					registerIssue(itemKey, "Data me be corrupted. Current data: " + dataRef);

					return [dataRef as T, dataRef!.userIds] as unknown as LuaTuple<
						[
							newValue: Template,
							userIds?: Array<number> | undefined,
							metadata?: object | undefined,
						]
					>;
				}

				if (nullishData === true) {
					if (methods.missingItem !== undefined) {
						dataRef = {} as T;
						methods.missingItem(dataRef);
					}
				}

				if (nullishData !== true && type(dataRef) === "table") {
					if (methods.setItem !== undefined) {
						methods.setItem(dataRef as T, keyInfo);
					}
				}

				return [dataRef as T, dataRef!.userIds] as unknown as LuaTuple<
					[
						newValue: Template,
						userIds?: Array<number> | undefined,
						metadata?: object | undefined,
					]
				>;
			};

			[loadedData, keyInfo] = DataStoreQueue.call(
				() => bucketOn._globalDataStore.UpdateAsync(itemKey, callback),
				itemKey,
				bucketOn.key,
			);
		});

		if (success === true && loadedData !== undefined && type(loadedData) === "table") {
			return [loadedData, keyInfo];
		} else {
			registerIssue(
				itemKey,
				(message !== undefined
					? message
					: "Unexpected error, not enough information.") as string,
			);
		}
	}

	export function save(item: ItemDeclaration<Template>): void {
		const [{ data, metadata }] = queueCall(item.key, item.bucketOn, {
			setItem: (object: Template, keyInfo: DataStoreKeyInfo): void => {
				object.data = item.data;

				object.metadata = {
					is_first_session: false,
					last_bucket_on: item.bucketOn.key,
					last_connection_timestamp: os.time(),
					version: keyInfo.Version,
				};

				object.userIds = item.userIds;
			},
		})!;

		if (
			data !== undefined &&
			type(data) === "table" &&
			metadata !== undefined &&
			type(metadata) === "table"
		) {
			Autosave.remove(item);
			DataStoreQueue.clean(item.bucketOn.key, item.key);
		}
	}
}

/** Auto saving and others */
{
	if (RunService.IsServer() === true) {
		task.spawn((): void => {
			if (RunService.IsStudio() === true) {
				const [success, message] = pcall(() => {
					return DataStoreService.GetDataStore("_LIVE_DATA_STORE").SetAsync(
						"__TESTING_KEY",
						os.time(),
					);
				});

				if (success === true) return;

				const noInternet =
					success === false &&
					string.find(message as string, "ConnectFail", 1, true)[0] !== undefined;

				if (noInternet === true) {
					TinaLogger.log("[Container]: No internet connection, check your network.");
				} else if (success === false && string.find(message as string, "403")[0]) {
					TinaLogger.log(
						"[Container]: API Services unavailable, please check your settings.",
					);
				} else if (
					success === false &&
					string.find(message as string, "must publish", 1, true)[0]
				) {
					TinaLogger.log("[Container]: Game needs to be published for testing.");
				}

				Data.servicesAvailable = false;
			}
		});

		RunService.PostSimulation.Connect((): void => {
			const saveListLength = AUTO_SAVING_ITEMS.size();

			if (saveListLength > 0) {
				const iterationSpeed = AUTO_SAVE_COOLDOWN / saveListLength;
				const clockTimestamp = os.clock();

				while (clockTimestamp - lastAutoSave > iterationSpeed) {
					lastAutoSave = lastAutoSave + iterationSpeed;

					let item: ItemDeclaration<Template> | undefined =
						AUTO_SAVING_ITEMS[autoSaveIndex];

					if (clockTimestamp - item.metadata.load_timestamp < AUTO_SAVE_COOLDOWN) {
						item = undefined;

						for (let i = 0; i < saveListLength; i++) {
							autoSaveIndex = autoSaveIndex + 1;

							if (autoSaveIndex > saveListLength) {
								autoSaveIndex = 1;
							}

							item = AUTO_SAVING_ITEMS[autoSaveIndex];

							if (
								clockTimestamp - item.metadata.load_timestamp <
								AUTO_SAVE_COOLDOWN
							) {
								break;
							} else {
								item = undefined;
							}
						}
					}

					autoSaveIndex = autoSaveIndex + 1;

					if (autoSaveIndex > saveListLength) {
						autoSaveIndex = 1;
					}

					if (item !== undefined) {
						Data.queueCall(item.key, item.bucketOn, {});
					}
				}
			}
		});

		task.spawn(() => {
			game.BindToClose(() => {
				if (!RunService.IsStudio() === true) {
					Data.servicesAvailable = false;

					const items: Array<ItemDeclaration<Template>> = new Array();
					for (const item of AUTO_SAVING_ITEMS) items.push(item);

					let savingJobs = 0;
					for (const item of items) {
						savingJobs = savingJobs + 1;

						task.spawn(() => {
							Data.save(item);

							savingJobs = savingJobs - 1;
						});
					}

					while (savingJobs !== 0) {
						task.wait();
					}
				}
			});
		});
	}
}
