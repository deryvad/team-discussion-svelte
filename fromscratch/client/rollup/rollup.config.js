import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import {buildmarkup, buildcss, copystaticfiles, distfolder, cleanbuildfolder} from './rollup.parts.config';

export default {
	input: 'src/main.js',
	output: {
		file: `${distfolder}/bundle.js`,
		format: 'esm'
	},
	plugins: [
		cleanbuildfolder,
		svelte({
			preprocess: sveltePreprocess()
		}),
		resolve(),
		buildcss,
		copystaticfiles,
		buildmarkup
	]
};

