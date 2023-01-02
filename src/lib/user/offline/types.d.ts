import { DefaultUserImplementation, UserType } from "../default/types";

export interface OfflineUserImplementation extends DefaultUserImplementation {
	release(): void;
}

export type OfflineUserType = OfflineUserImplementation & UserType;
