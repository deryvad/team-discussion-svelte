import resolve from '@rollup/plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';

export default {
	input: 'src/main.js',
	output: {
		file: 'public/build/bundle.js',
		format: 'esm',
		sourcemap: true	
    },
    plugins: [
		css({ output: 'bundle.css' }),
        resolve(),
        svelte()
    ]
}