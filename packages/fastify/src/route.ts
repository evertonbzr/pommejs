import { RouteOptions } from "fastify";
import { RouterBuild } from "./router-build";
import { Handler, ReqMethod } from "./types";

export type Route = {
  key: string;
  middlewares: Array<Handler>;
  router: RouteOptions;
};

type RouteArgs = {
  key: string;
  method: ReqMethod;
  resolver: Handler;
  middlewares?: Array<Handler>;
  path?: string;
};

type OmitRouteArgs = Omit<RouteArgs, "method">;

function _makeRouter({
  key,
  resolver,
  path,
  method,
  middlewares = [],
}: RouteArgs): Route {
  const routerBuild = new RouterBuild();

  let pathToUse = path || "/";

  pathToUse = pathToUse.startsWith("/") ? pathToUse : `/${pathToUse}`;

  const router = routerBuild
    .setPath(pathToUse)
    .setMethod(method)
    .setHandler(resolver)
    .setMiddlewares([...middlewares])
    .build();

  return {
    key,
    middlewares,
    router,
  };
}

export const route = {
  withMethod: (method: ReqMethod, opts: OmitRouteArgs) =>
    _makeRouter({ ...opts, method }),
  get: (opts: OmitRouteArgs) => _makeRouter({ ...opts, method: "GET" }),
  post: (opts: OmitRouteArgs) => _makeRouter({ ...opts, method: "POST" }),
  put: (opts: OmitRouteArgs) => _makeRouter({ ...opts, method: "PUT" }),
  delete: (opts: OmitRouteArgs) => _makeRouter({ ...opts, method: "DELETE" }),
  patch: (opts: OmitRouteArgs) => _makeRouter({ ...opts, method: "PATCH" }),
};
