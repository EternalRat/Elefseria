import { BaseInteraction } from './BaseInteraction.class';

export class BaseSelectInteraction extends BaseInteraction {
	constructor(
		name: string,
		description: string,
		moduleName: string,
		isEnabled: boolean = true,
		permissions: bigint[] = [],
	) {
		super(name, description, moduleName, isEnabled, permissions);
	}
}
