import { Template } from "../../types";
import { ItemType } from "../item/types";

export interface BucketMetadata {
	/** To be discussed if needed. */
}

export interface BucketDeclaration<T extends Template> {
	key: string;

	/** @hidden */
	_globalDataStore: DataStore;

	/** @hidden */
	template: T;

	/** @hidden */
	bucket_metadata: BucketMetadata;
}

export interface BucketImplementation<T extends Template> {
	/**
	 * Returns a construction of an Item.
	 *
	 * @param itemKey the key of an item which either already exists or doesn't within a bucket.
	 */
	getItem(itemKey: string): ItemType<T> | undefined;

	/**
	 * Returns the metadata linked to an existing bucket, if not, will return nil.
	 *
	 * @param bucketKey should be the key of an existing bucket in the Container.
	 * @return metadata or nil.
	 */
	getMetadata(bucketKey: string): BucketMetadata;
}

export type BucketType<T extends Template> = BucketImplementation<T> & BucketDeclaration<T>;
