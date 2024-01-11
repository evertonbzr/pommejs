import { ControllerDefinition, RouteDefinition } from './types';

class StorageEngine {
	public routes: RouteDefinition[] = [];
	public controllers: ControllerDefinition[] = [];
}

let storage: StorageEngine;

export function getStorage() {
	if (!storage) {
		storage = new StorageEngine();
	}
	return storage;
}
