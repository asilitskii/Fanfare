import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: ['legacy-js-api'],
			},
		},
	},
	// commented until no tests
	/*,
	test: {
		environment: 'jsdom',
		include: ['**!/!*.@(test|spec).@(ts|tsx)'],
		exclude: ['node_modules', 'dist'],
	},*/
});
