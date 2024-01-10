import { writeFileSync } from 'fs';
import { join } from 'path';

export function init() {
	const pommeJson = {
		$schema:
			'https://raw.githubusercontent.com/evertonbzr/pommejs/master/static/pomme-file-schema.json',
		input: {
			axios: {
				baseUrl: 'https://jsonplaceholder.typicode.com',
			},
			targetUrl: 'http://localhost:3000/pomme',
		},
		output: { path: '.generated' },
	};

	writeFileSync(
		join(process.cwd(), 'pomme.json'),
		JSON.stringify(pommeJson, null, 2),
	);
}
