import { RouteOptions, FastifyReply, FastifyRequest } from "fastify";
import { Handler, ReqMethod } from "./types";

export class RouterBuild {
  private path: string | undefined;
  private method: ReqMethod | undefined;
  private middlewares: Array<
    (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  >;
  private handler: Handler;

  constructor() {
    this.path = undefined;
    this.method = undefined;
    this.middlewares = [];
    this.handler = undefined;
  }

  setPath(path: string): RouterBuild {
    this.path = path;
    return this;
  }

  setMethod(method: ReqMethod): RouterBuild {
    this.method = method;
    return this;
  }

  setHandler(handler: Handler): RouterBuild {
    this.handler = handler;
    return this;
  }

  setMiddlewares(middlewares: Array<any>): RouterBuild {
    this.middlewares = middlewares;
    return this;
  }

  build(): RouteOptions {
    if (!this.method || !this.path || !this.handler) {
      throw new Error(
        "RouterBuild requires path, method, and handler to be set."
      );
    }

    const method = this.method;

    const routeOptions: RouteOptions = {
      method,
      url: this.path,
      handler: this.handler,
      preHandler: this.middlewares,
    };

    return routeOptions;
  }
}
