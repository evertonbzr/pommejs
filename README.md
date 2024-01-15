<div align='center'>

<h1>PommeJS</h1>

<p>Router builder to ExpressJS Application</p>

<!-- <img src="https://github.com/sinclairzx81/typebox/blob/master/typebox.png?raw=true" /> -->

<br />
<br />

[![npm version](https://badge.fury.io/js/@pommejs%2Fserver.svg)](https://badge.fury.io/js/@pommejs%2Fserver)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<!-- [![Build](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml/badge.svg)](https://github.com/sinclairzx81/typebox/actions/workflows/build.yml) -->

</div>

<a name="Install"></a>

## Install

```bash
$ npm install @pommejs/server --save
```

or

```bash
$ yarn add @pommejs/server
```

## Example

Basic usage:

```typescript
import { Type, type Static } from "@pommejs/server";
import express from "express";

const app = express();
app.use(express.json());

// Router
const v1CreateTodo = p.route.post({
  key: "createTodo",
  bodySchema: z.object({
    title: z.string(),
  }),
  async resolver(input, ctx, res) {
    const { title } = input.body;
    w;
    // logic to create todo
    return {
      id: 2,
      title: "Todo 2",
    };
  },
});

// Group of routes
const todoController = p
  .controller("todo")
  .middlewares([])
  .routes([v1CreateTodo])
  .build();

// Server, group of controllers
const server = p
  .server(app)
  .prefix("/v2")
  .middlewares([])
  .controllers([todoController])
  .build();
```

expected output:

```typescript
pomme:info createTodo POST /v2/todo/
```

<a name="Overview"></a>

## Overview

Pommejs is ecosystem with mutiples packeges, to manager a API Rest with ExpressJS.

The main package is `@pommejs/server` and it's a router builder to ExpressJS Application.

With `@pommejs/server` you can create a server with controllers, routes, middlewares and more. In addition to being able to generate route specifications.

To generate route specifications, you can use the `@pommejs/server/generateRoutesOutputPlugin` plugin.

[Template](https://github.com/evertonbzr/module-template) using PommeJS.

License MIT

## Contents

- [Install](#install)
- [Overview](#overview)
- [Usage](#usage)
- [Functions](#functions)
  - [Server](#func-server)
  - [Controller](#func-controller)
  - [Route](#func-route)
- [Contribute](#contribute)

<a name="usage"></a>

## Usage

The following shows general usage.

```typescript
import express from "express";
import { z } from "zod";
import { Controller, getStorage, p } from "./dist/index";
import { generateRoutesOutputPlugin } from "./plugins/generateRoutesOutput";
const app = express();

app.use(express.json());

const querySchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .default("1"),
});

const v1ListTodos = p.route.get({
  key: "listTodos",
  querySchema,
  async resolver(input, ctx) {
    return {
      id: input.query.page,
      title: "Todo 1",
    };
  },
});

const v1CreateTodo = p.route.post({
  key: "createTodo",
  bodySchema: z.object({
    title: z.string(),
  }),
  async resolver(input, ctx) {
    const { title } = input.body;
    return {
      id: 2,
      title: "Todo 2",
    };
  },
});

const v1UpdateTodo = p.route.put({
  key: "updateTodo",
  path: "/:id",
  bodySchema: z.object({}),
  querySchema: z.object({
    include: z.array(z.string()).optional(),
  }),
  middlewares: [],
  noImportMiddleware: false,
  async resolver(input, ctx, res) {
    const { id } = input.params;

    return res.send("Olá");
  },
});

const todoController = p
  .controller("todo")
  .middlewares([])
  .routes([v1CreateTodo, v1UpdateTodo, v1ListTodos])
  .build();

const server = p
  .server(app)
  .prefix("/v2")
  .middlewares([])
  .plugins([
    generateRoutesOutputPlugin({
      homeWithLastChecksum: true,
      limit: 1,
      outputPath: "/generated/routes-output",
    }),
  ])
  .controllers([todoController])
  .build();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

<a name='functions'></a>

## Functions

The following lists the supported functions.

<a name='func-server'></a>

### Server

The server is the main function of the package, it is responsible for creating the server with the controllers, routes, middlewares and more.

```typescript
import { p, Controller } from "@pommejs/server";
import express from "express";

const app = express();
app.use(express.json());

const controllers: Controller[] = [];

const server = p
  .server(app) // ExpressJS Application [Required]
  .prefix("/api") // Prefix for all routes [Optional]
  .middlewares([]) // Middlewares for all routes [Optional]
  .plugins([]) // Plugins for PommeJS Server [Optional]
  .controllers(controllers) // Controllers loaded in server [Required]
  .build(); // Build the server
```

<a name='func-controller'></a>

### Controller

The controller is a group of routes, middlewares and more.

```typescript
import { p, Controller } from "@pommejs/server";

const todoController = p
  .controller("todo") // Path for all routes of controller [Required]
  .middlewares([]) // Middlewares for all routes of controller [Optional]
  .routes([v1CreateTodo]) // Routes for controller [Required]
  .build(); // Build the controller and return a Controller
```

<a name='func-route'></a>

### Route

The route is a group of middlewares and a resolver and more.

```typescript
import { p } from "@pommejs/server";
import { z } from "zod";

const v1UpdateTodo = p.route.put({
  key: "updateTodo", // Key for route [Required]
  path: "/:id", // Path for route [Optional] [Default: /]
  bodySchema: z.object({}), // Body schema for route [Optional]
  querySchema: z.object({}), // Query schema for route [Optional]
  middlewares: [], // Middlewares for route [Optional]
  noImportMiddleware: false, // Disable get middlewares from controller [Optional] [Default: false]
  async resolver(input, ctx, res) {
    // Resolver for route [Required]
    return {};
  },
});

// Input type: { body: T, query: T, params: T }
// Context type: Request
// Response type: Response
```

<a name='contribute'></a>

## Contribute

PommeJS is open to community contribution. Please ensure you submit an open issue before submitting your pull request. The PommeJS project prefers open community discussion before accepting new features.
