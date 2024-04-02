import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// https://kit.svelte.dev/docs/adapter-auto for a list.
		adapter: adapter(),
		paths: {
			// use bugflug.zip if the site is in production mode
			base: process.env.NODE_ENV === 'production' ? '/bugflug.zip' : ''
		},
		alias: {
			// using dots in my file paths is really fucking annoying
			'$src': 'src'
		}
	}
};

export default config;
