import { writeFileSync } from 'fs';
import { join } from 'path';

export function init() {
	const pommeJson = {
		input: {
			targetUrl: '',
			axios: {
				baseUrl: '',
			},
		},
		output: {
			path: './generated',
		},
	};

	writeFileSync(
		join(process.cwd(), 'pomme.json'),
		JSON.stringify(pommeJson, null, 2),
	);
}
