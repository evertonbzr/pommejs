import { FastifyInstance } from "fastify";
import { Controller } from "./controller";
import { Handler } from "./types";

class _MakeServer {
  private _prefix: string;
  private app: FastifyInstance;
  private _controllers: Controller[];
  private _middlewares: Handler[];

  constructor(app: FastifyInstance) {
    this._prefix = "/";
    this.app = app;
    this._controllers = [];
  }

  prefix(prefix: string) {
    this._prefix = prefix;
    return this;
  }

  controllers(controllers: Controller[]) {
    this._controllers = controllers;
    return this;
  }

  middlewares(middlewares: Handler[]) {
    this._middlewares = middlewares;
    return this;
  }

  build() {
    if (!this.app) {
      throw new Error("Serer requires app.");
    }

    if (this._middlewares.length > 0) {
      for (const middleware of this._middlewares) {
        this.app.addHook("onRequest", middleware);
      }
    }

    for (const controller of this._controllers) {
      this.app.register(controller, { prefix: this._prefix });
    }

    return {
      app: this.app,
    };
  }

  static create(app: FastifyInstance) {
    return new _MakeServer(app);
  }
}

export const server = _MakeServer.create;
