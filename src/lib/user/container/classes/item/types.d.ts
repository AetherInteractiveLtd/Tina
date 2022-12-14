import { DataSaved, Metadata, Template } from "../../types"

import { BucketType } from "../bucket/types"

export interface ItemEvents<T extends Template> {
    "item:releasing": (item: ItemDeclaration<T>) => void,
    "item:loading": (alreadyLoaded: boolean) => void,
    "item:loaded": <T extends DataSaved>(savedData: T) => void,
}

export interface ItemMethodsDataStore {
    missingItem?: <T extends Template>(object: T) => void,
    setItem?: <T extends Template>(object: T, keyInfo: DataStoreKeyInfo) => void,
}

export interface ItemLoaderJob {
    cleanup: RBXScriptConnection | undefined,
    lastWrite: number
    queue: Array<Callback>
}

export interface ItemDeclaration<T extends Template> {
    key: string,
    keyInfo: DataStoreKeyInfo, // For developers

    data: T,
    metadata: Metadata,

    userIds: Array<number>,
    bucketOn: BucketType<T>,
}

export interface ItemImplementation {
    /**
     * GDPR compliances.
     * 
     * @param userId a number describing the player's user id.
     */
    addUserId(userId: number): void

    /**
     * GDPR compliances within deleting a player's data.
     * 
     * @param userId a number describing the player's user id.
     */
    removeUserId(userId: number): void

    /**
     * Used reconcile the table with the template
     */
    reconcile(): void

    /**
     * Used to lose the current item and unlock the session from it
     */
    lose(): void
}

export type ItemType<T extends Template> = ItemDeclaration<T> & ItemImplementation