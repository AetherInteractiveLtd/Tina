import { DataStoreService, RunService } from "@rbxts/services";

import logger from "../../../logger";

import { BucketType } from "../classes/bucket/types";
import { ItemDeclaration, ItemLoaderJob, ItemMethodsDataStore, ItemType } from "../classes/item/types";
import { Template } from "../types";

/** Configuration */
const dataStoreCallCooldowns = 7 // In seconds

const issuesLimit = 4 // + issues would cause a lock of the services.
let currentIssues = 0

export let servicesAvailable = false // API services or connected to the internet, services may not be available because of these 2 factors

/** Queue */
const queue: Map<string, Map<string, ItemLoaderJob>> = new Map() // Bucket -> Item -> Loader Job

/** Loaded items */
const items: Map<string, ItemDeclaration<Template>> = new Map() // Bucket -> Items

/** Auto saving items */
const autoSavingItems: Array<ItemDeclaration<Template>> = new Array()
const autoSaveCooldown = 60 // in seconds

let lastAutoSave = os.clock()
let autoSaveIndex = 0

/** Issues registering, etc. */
export function registerIssue(itemKey: string, issue: string) {
    logger.warn("[Container]: There was a problem within the item ([%s]), a more detailed message on the issue here: %s".format(itemKey, issue))

    currentIssues = currentIssues + 1

    if (currentIssues >= issuesLimit) {
        servicesAvailable = false // Lock all the loader jobs, and others
    }
}

/** Queue functions */
export function setItemToAutoSave(item: ItemType<Template>) {
    autoSavingItems.push(item)

    const size = autoSavingItems.size()

    if (size > 1) {
        autoSaveIndex = autoSaveIndex + 1
    } else if (size === 1) {
        lastAutoSave = os.clock()
    }
}

export function deleteItemFromAutoSave(item: ItemDeclaration<Template>) {
    items.delete(item.bucketOn.key) // Uncaches from the items as a whole

    const foundItemIndex = autoSavingItems.indexOf(item)

    if (foundItemIndex > 0) {
        autoSavingItems.remove(foundItemIndex)

        if (foundItemIndex < autoSaveIndex) {
            autoSaveIndex = autoSaveIndex - 1
        }

        if (!autoSavingItems[autoSaveIndex]) {
            autoSaveIndex = 1
        }
    }
}

/** Data store calls queue */
function cleanItemQueue(bucketKey: string, itemKey: string) {
    const bucketJobsHolder = queue.get(bucketKey)

    if (bucketJobsHolder !== undefined) {
        const loaderJob = bucketJobsHolder.get(itemKey)

        if (loaderJob !== undefined) {
            const { cleanup, lastWrite } = loaderJob

            if (cleanup === undefined) {
                loaderJob.cleanup = RunService.PostSimulation.Connect(() => {
                    if ((os.clock() - lastWrite) > dataStoreCallCooldowns && loaderJob.queue.size() === 0) {
                        loaderJob.cleanup?.Disconnect()

                        const loaderJobKept = bucketJobsHolder.get(itemKey)
                        if (loaderJobKept !== undefined) {
                            queue.get(bucketKey)?.delete(itemKey)

                            if (next(queue.get(bucketKey) as {}) === undefined) {
                                queue.delete(bucketKey)
                            }
                        }
                    }
                })
            }
        }
    }
}

function queueCall(fn: Callback, bucketKey: string, itemKey: string) {
    if (!queue.get(bucketKey)) queue.set(bucketKey, new Map()) // Checking if bucket has somewhere to store the items loader jobs
    if (!queue.get(bucketKey)!.get(itemKey)) queue.get(bucketKey)!.set(itemKey, {
        cleanup: undefined,
        lastWrite: 0,
        queue: new Array(),
    }) // Setting of a new loader job

    const loaderJob = queue.get(bucketKey)!.get(itemKey)!

    if (loaderJob.cleanup) {
        // Means that it needs cleanup of reference and disconnecting the cleaner
        loaderJob.cleanup.Disconnect()
        loaderJob.cleanup = undefined
    }

    const lastTime = loaderJob.lastWrite

    if ((os.clock() - lastTime) > dataStoreCallCooldowns && loaderJob.queue.size() === 0) {
        loaderJob.lastWrite = os.clock()
        return fn()
    } else {
        loaderJob.queue.push(fn)

        while (true) {
            if ((os.clock() - lastTime) > dataStoreCallCooldowns && loaderJob.queue[1] === fn) {
                loaderJob.queue.shift()
                loaderJob.lastWrite = os.clock()

                return fn()
            } else {
                task.wait()
            }
        }
    }
}

export function dataStoreQueueCall<T extends Template = Template>(itemKey: string, bucketOn: BucketType<T>, methods: ItemMethodsDataStore): [Template | Template, DataStoreKeyInfo] | undefined {
    let loadedData!: Template | Template; let keyInfo!: DataStoreKeyInfo;

    const [succes, message] = pcall(
        () => {
            const callback = (data: T | undefined, keyInfo: DataStoreKeyInfo): LuaTuple<[newValue: Template, userIds?: number[] | undefined, metadata?: object | undefined]> => {
                let nullishData = false
                let corrupted = false

                if (data !== undefined && type(data) !== "table") {
                    nullishData = true
                    corrupted = true
                } else if (data === undefined) {
                    nullishData = true
                }

                if (corrupted) {
                    registerIssue(itemKey, "Data me be corrupted. Current data: " + data)
                    return [data as T, data!.userIds] as unknown as LuaTuple<[newValue: Template, userIds?: number[] | undefined, metadata?: object | undefined]>
                }

                if (nullishData === true) {
                    if (methods.missingItem !== undefined) {
                        data = {} as T
                        methods.missingItem(data)
                    }
                }

                if (nullishData !== true && type(data) === "table") {
                    if (methods.setItem !== undefined) {
                        methods.setItem(data as T, keyInfo)
                    }
                }

                return [data as T, data!.userIds] as unknown as LuaTuple<[newValue: Template, userIds?: number[] | undefined, metadata?: object | undefined]>
            }

            [loadedData, keyInfo] = queueCall(
                () => bucketOn._globalDataStore.UpdateAsync(itemKey, callback),
                itemKey,
                bucketOn.key,
            )
        }
    )

    if (succes === true && loadedData !== undefined && type(loadedData) === "table") {
        return [loadedData, keyInfo]
    } else {
        registerIssue(itemKey, (message !== undefined ? message : "Unexpected error, not enough information.") as string)
    }
}

export function saveAsync(item: ItemDeclaration<Template>) {
    const [{ data, metadata }] = dataStoreQueueCall(
        item.key,
        item.bucketOn,
        {
            setItem: (object: Template, keyInfo: DataStoreKeyInfo) => {
                object.data = item.data

                object.metadata = {
                    last_bucket_on: item.bucketOn.key,
                    last_connection_timestamp: os.time(),
                    version: keyInfo.Version,
                }

                object.userIds = item.userIds
            }
        }
    )!

    if (data && type(data) === "table" && metadata && type(metadata) === "table") {
        deleteItemFromAutoSave(item) // Removes it from the auto save part
        cleanItemQueue(item.bucketOn.key, item.key) // Cleans it from the queue if it was left there
    }
}

/** Auto saving and others */
{
    task.spawn(
        () => {
            // Check for the services if available
            if (RunService.IsStudio() === true) {
                const [success, message] = pcall(
                    () => {
                        return DataStoreService.GetDataStore("_LIVE_DATA_STORE").SetAsync("__TESTING_KEY", os.time())
                    }
                )

                const noInternet = success === false && string.find(message as string, "ConnectFail", 1, true)[0]

                if (noInternet) {
                    logger.warn("[Container]: No internet connection, check your network.")
                } else if (success === false && string.find(message as string, "403")) {
                    logger.warn("[Container]: API Services unavailable, please check your settings.")
                } else if (success === false && string.find(message as string, "must publish", 1, true)) {
                    logger.warn("[Container]: Game needs to be published for testing.")
                }
            }
        }
    )

    RunService.PostSimulation.Connect(() => {
        const saveListLength = autoSavingItems.size()

        if (saveListLength > 0) {
            const iterationSpeed = autoSaveCooldown / saveListLength
            const clockTimestamp = os.clock()

            while ((clockTimestamp - lastAutoSave) > iterationSpeed) {
                lastAutoSave = lastAutoSave + iterationSpeed

                let item: ItemDeclaration<Template> | undefined = autoSavingItems[autoSaveIndex]

                if ((clockTimestamp - item.metadata.load_timestamp) < autoSaveCooldown) {
                    item = undefined

                    for (let i = 0; i < saveListLength; i++) {
                        autoSaveIndex = autoSaveIndex + 1

                        if (autoSaveIndex > saveListLength) {
                            autoSaveIndex = 1
                        }

                        item = autoSavingItems[autoSaveIndex]

                        if ((clockTimestamp - item.metadata.load_timestamp) < autoSaveCooldown) {
                            break
                        } else {
                            item = undefined
                        }
                    }
                }

                autoSaveIndex = autoSaveIndex + 1

                if (autoSaveIndex > saveListLength) {
                    autoSaveIndex = 1
                }

                if (item !== undefined) {
                    dataStoreQueueCall(item.key, item.bucketOn, {})
                }
            }
        }
    })

    task.spawn(
        () => {
            game.BindToClose(() => {
                if (!RunService.IsStudio()) {
                    // Save items per bucket at the time the game is closing
                    servicesAvailable = false

                    const items: Array<ItemDeclaration<Template>> = new Array()
                    for (const [, item] of pairs(autoSavingItems)) items.push(item)

                    let savingJobs = 0 // Help us not to close before saving every item
                    for (const [, item] of ipairs(items)) {
                        savingJobs = savingJobs + 1

                        task.spawn(
                            () => {
                                saveAsync(item)
                                savingJobs = savingJobs - 1
                            }
                        )
                    }

                    while (savingJobs !== 0) {
                        task.wait()
                    }

                    return
                }
            })
        }
    )
}