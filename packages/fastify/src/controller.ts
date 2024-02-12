import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { Route } from "./route";
import { Handler } from "./types";

export type Controller = (
  app: FastifyInstance,
  opts: FastifyPluginOptions,
  next: (err?: Error) => void
) => void;

class _Controller {
  private path: string;
  private _routes: Route[];
  private _middlewares: Handler[];

  constructor(path = "/") {
    this.path = path;
    this.path = path.startsWith("/") ? path : `/${path}`;
    this._routes = [];
    this._middlewares = [];
  }

  routes(routes: Route[]) {
    this._routes = routes;
    return this;
  }

  middlewares(middlewares: Handler[]) {
    this._middlewares = middlewares;
    return this;
  }

  build(): Controller {
    if (!this.path) {
      throw new Error("ControllerBuild requires path.");
    }

    return (app: FastifyInstance, opts, next) => {
      let { prefix } = opts;

      prefix = prefix === "/" ? "" : prefix;

      for (const route of this._routes) {
        let url = `${this.path}${route.router.url}`;

        url = url.endsWith("/") ? url.slice(0, -1) : url;

        console.log(
          `Registering route: ${route.router.method} ${prefix}${url}`
        );

        const prevHandlers = [...this._middlewares, ...route.middlewares];

        app.route({
          ...route.router,
          preHandler: [...prevHandlers],
          url,
        });
      }
      next();
    };
  }

  static create(path: string) {
    return new _Controller(path);
  }
}

export const controller = _Controller.create;
