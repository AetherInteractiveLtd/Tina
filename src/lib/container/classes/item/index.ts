import { EventEmitter } from "../../../events";
import { TableUtil } from "../../../util/tables";
import TinaLogger from "../../../util/TinaLogger";
import { Data } from "../../data_actions";
import { Metadata, Template } from "../../types";
import { BucketType } from "../bucket/types";
import { ItemDeclaration, ItemEvents, ItemImplementation } from "./types";

export class Item<T extends Template>
	extends EventEmitter<ItemEvents<T>>
	implements ItemImplementation
{
	public key: string;
	public keyInfo: DataStoreKeyInfo;
	public data: T;
	public metadata: Metadata;
	public userIds: Array<number>;
	public bucketOn: BucketType<T>;

	constructor({ key, keyInfo, userIds, data, metadata, bucketOn }: ItemDeclaration<T>) {
		super(); // EventEmitter super initialisation

		this.data = data;
		this.metadata = metadata;
		this.userIds = userIds;

		this.bucketOn = bucketOn;

		this.key = key;
		this.keyInfo = keyInfo;
	}

	public addUserId(userId: number): void {
		const foundUserId = this.userIds.includes(userId);

		if (foundUserId === false) {
			this.userIds.push(userId);
		}
	}

	public removeUserId(userId: number): void {
		const userIdIndex = this.userIds.indexOf(userId);

		if (userIdIndex === undefined) {
			TinaLogger.log(
				"The user id provided doesnt exists on the array, can't delete something isn't there.",
			);
		} else {
			this.userIds.remove(userIdIndex);
		}
	}

	public reconcile(): void {
		TableUtil.reconcile(this.data, this.bucketOn.template);
	}

	public lose(): void {
		Data.save(this as ItemDeclaration<Template>);
	}
}
