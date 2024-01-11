import { RequestHandler, Router } from 'express';
import zodToJsonSchema from 'zod-to-json-schema';
import { MetadataController } from './metadata/metadata-controller';
import { Field } from './types';

class Controller {
	private path: string;
	private fields: Field[];
	private middleware: RequestHandler[];
	private router: Router;
	private metadataController: MetadataController;

	constructor(path = '/') {
		this.path = path;
		this.path = path.startsWith('/') ? path : `/${path}`;
		this.fields = [];
		this.middleware = [];
		this.router = Router();
	}

	routes(fields: Field[]) {
		this.fields = fields;
		return this;
	}

	middlewares(middleware: RequestHandler[]) {
		this.middleware = middleware;
		return this;
	}

	metadata(metadata: MetadataController) {
		this.metadataController = metadata;
		return this;
	}

	build() {
		if (!this.path) {
			throw new Error('ControllerBuild requires path.');
		}

		const fieldsSorted = this.fields.sort((a) => {
			if (a.noImportMiddleware) return -1;
			return 0;
		});

		const fieldsPaths = fieldsSorted.map((field) => {
			const bodySchemaJSON = field.bodySchema
				? zodToJsonSchema(field.bodySchema)
				: null;
			const querySchemaJSON = field.querySchema
				? zodToJsonSchema(field.querySchema)
				: null;

			return {
				key: field.key,
				route: field.path,
				req: field.reqType,
				...(bodySchemaJSON && {
					bodySchema: JSON.stringify(bodySchemaJSON),
				}),
				...(querySchemaJSON && {
					querySchema: JSON.stringify(querySchemaJSON),
				}),
				metadata: field.metadata,
			};
		});

		for (const field of fieldsSorted) {
			if (!field.noImportMiddleware) {
				this.router.use(this.path, ...this.middleware, field.router);
			} else {
				this.router.use(this.path, field.router);
			}
		}

		return {
			key: this.path,
			route: this.router,
			paths: fieldsPaths,
			fields: fieldsSorted,
			metadata: this.metadataController,
		};
	}

	static create(path: string) {
		return new Controller(path);
	}
}

export const controller = Controller.create;
