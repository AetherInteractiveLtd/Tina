import { Bucket } from "./classes/bucket";
import { BucketDeclaration, BucketMetadata, BucketType } from "./classes/bucket/types";
import { Template } from "./types";

export namespace Container {
	const buckets: Map<string, BucketDeclaration<defined>> = new Map();

	export function getBucket<T extends Template>(bucketKey: string, template: T): BucketType<T> {
		const bucket = new Bucket(bucketKey, template);
		buckets.set(bucketKey, bucket);

		return bucket;
	}

	export function getBucketMetadata(bucketKey: string): BucketMetadata | undefined {
		return buckets.get(bucketKey)?.bucket_metadata;
	}
}
