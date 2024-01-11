import { Express, RequestHandler } from 'express';
import { bold, green } from 'kleur/colors';
import { PommeError } from './errors';
import { error, info } from './logger';
import { getStorage } from './store';
import { Controller, Plugin, ServerBuildType } from './types';

class _MakeServer {
	private _prefix: string;
	private app: Express;
	private _controllers: Controller[];
	private _middlewares: RequestHandler[];
	private _plugins: Plugin[];

	constructor(app: Express) {
		this._prefix = '/';
		this.app = app;
		this._controllers = [];
		this._middlewares = [];
		this._plugins = [];
	}

	prefix(prefix: string) {
		this._prefix = prefix;
		return this;
	}

	plugins(plugins: Plugin[]) {
		this._plugins = plugins;
		return this;
	}

	controllers(controllers: Controller[]) {
		this._controllers = controllers;
		return this;
	}

	middlewares(middlewares: RequestHandler[]) {
		this._middlewares = middlewares;
		return this;
	}

	build(): ServerBuildType {
		if (!this.app) {
			error('RouterBuild requires app.');
			throw new Error('RouterBuild requires app.');
		}

		const routes = this._controllers.map(
			(controller) => controller.route,
		);
		const paths = this._controllers.flatMap((controller) => {
			const mappedPath = controller.paths.map((path) => ({
				...path,
				route: `${controller.key}${path.route}`,
				controllerPath: controller.key,
			}));

			getStorage().controllers.push({
				key: controller.key,
				metadata: controller.metadata,
				routes: controller.paths.map((path) => ({
					key: path.key,
					path: path.route,
					method: path.req as any,
					...(path.bodySchema && { bodySchema: path.bodySchema }),
					...(path.querySchema && { querySchema: path.querySchema }),
					metadata: path.metadata,
				})),
			});
			return mappedPath;
		});

		const prefix = this._prefix === '/' ? '' : this._prefix;

		for (const path of paths) {
			getStorage().routes.push({
				key: path.key,
				path: path.route,
				method: path.req as any,
				...(path.bodySchema && { bodySchema: path.bodySchema }),
				...(path.querySchema && { querySchema: path.querySchema }),
			});

			info(
				`${bold(path.key)} ${green(path.req)} ${prefix}${path.route}`,
			);
		}

		for (const route of routes) {
			this.app.use(this._prefix, ...this._middlewares, route);
		}

		const formatedPaths = paths.map(
			(path) => `${path.req}${prefix}${path.route}`,
		);

		const pathsDuplicate = formatedPaths.filter(
			(key, index) => formatedPaths.indexOf(key) !== index,
		);

		if (pathsDuplicate.length) {
			throw new Error(
				`Duplicate routes found: ${pathsDuplicate.join(', ')}`,
			);
		}

		const server = {
			app: this.app,
			controllers: this._controllers,
			paths,
			prefix: this._prefix,
		};

		for (const plugin of this._plugins) {
			plugin(server);
		}

		server.app.use((err, req, res, next) => {
			if (err instanceof PommeError) {
				res.status(err.statusCode).json({ error: err.message });
			} else if (err) {
				res.status(500).json({ error: err.message });
			}
			next();
		});

		return server;
	}

	static create(app: Express) {
		return new _MakeServer(app);
	}
}

export const server = _MakeServer.create;
