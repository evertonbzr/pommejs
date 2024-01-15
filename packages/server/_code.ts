import express from 'express';
import { z } from 'zod';
import { getStorage, p } from './dist/index';
import { generateRoutesOutputPlugin } from './plugins/generateRoutesOutput';
const app = express();

app.use(express.json());

const querySchema = z.object({
	page: z
		.string()
		.transform((val) => parseInt(val))
		.default('1'),
});

const v1ListTodos = p.route.get({
	key: 'listTodos',
	querySchema,
	async resolver(input, ctx) {
		return {
			id: input.query.page,
			title: 'Todo 1',
		};
	},
});

const v1CreateTodo = p.route.post({
	key: 'createTodo',
	bodySchema: z.object({
		title: z.string(),
	}),
	async resolver(input, ctx) {
		const { title } = input.body;
		return {
			id: 2,
			title: 'Todo 2',
		};
	},
});

const v1GetTodo = p.route.get({
	key: 'getTodo',
	path: '/:id',
	metadata: {
		description: 'Get todo',
	},
	querySchema: z.object({
		include: z.array(z.string()).optional(),
	}),
	async resolver(input, ctx, res) {
		const { id } = input.params;

		return res.send('Olá');
	},
});

const todoController = p
	.controller('todo')
	.middlewares([])
	.routes([v1ListTodos, v1GetTodo, v1CreateTodo])
	.build();

const server = p
	.server(app)
	.prefix('/v2')
	.middlewares([])
	.plugins([
		generateRoutesOutputPlugin({
			homeWithLastChecksum: true,
			limit: 1,
			outputPath: '/generated/routes-output',
		}),
	])
	.controllers([todoController])
	.build();

console.log(getStorage().controllers[0]);

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
