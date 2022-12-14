import { EventEmitter } from "../../../../events";

import { TableUtil } from "../../../../utilities/tables";
import { saveAsync } from "../../utilities/datastore";

import logger from "../../../../logger";

import { Metadata, Template } from "../../types";
import { BucketType } from "../bucket/types";
import { ItemDeclaration, ItemEvents, ItemImplementation } from "./types";

export class Item<T extends Template> extends EventEmitter<ItemEvents<T>> implements ItemImplementation {
    public key: string;
    public keyInfo: DataStoreKeyInfo;
    public data: T;
    public metadata: Metadata;
    public userIds: number[];
    public bucketOn: BucketType<T>;

    constructor({ key, keyInfo, userIds, data, metadata, bucketOn }: ItemDeclaration<T>) {
        super() // EventEmitter super initialisation

        this.data = data
        this.metadata = metadata
        this.userIds = userIds

        this.bucketOn = bucketOn

        this.key = key
        this.keyInfo = keyInfo
    }

    addUserId(userId: number): void {
        const foundUserId = this.userIds.includes(userId)

        if (foundUserId === false) {
            this.userIds.push(userId)
        }
    }

    removeUserId(userId: number): void {
        const userIdIndex = this.userIds.indexOf(userId)

        if (userIdIndex === undefined) {
            logger.info("The user id provided doesnt exists on the array, can't delete something isn't there.")
        } else {
            this.userIds.remove(userIdIndex)
        }
    }

    reconcile(): void {
        TableUtil.reconcile(this.data, this.bucketOn.template)
    }

    lose(): void {
        saveAsync(this as ItemDeclaration<Template>)
    }
}