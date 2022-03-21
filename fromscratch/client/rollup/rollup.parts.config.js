import html from '@rollup/plugin-html';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import sass from 'node-sass';
import autoprefixer from 'autoprefixer';
import cleaner from 'rollup-plugin-cleaner';

export const distfolder = 'dist';

export const environment = () => {
	let env = "";
	if (!process.env.NODE_ENV) {
		var args = process.argv.slice(2);
		if (args.indexOf('--define') != -1) {
			var index = args.indexOf('--define') + 1;
			env = args[index].split('=')[1].replace(/'/g, '');
		}
		else if (args.indexOf('-p') != -1) {
			var index = args.indexOf('-p');
			env = args[index].replace(/-/g, '');
		}
	} else {
		env = process.env.NODE_ENV;
	};
	return env;
}

export const cleanbuildfolder = cleaner({
	targets: [
	  `./${distfolder}/`
	]
})

export const buildcss = postcss({
	preprocessor: (content, id) => new Promise((resolve, reject) => {
	  const result = sass.renderSync({ file: id })
	  resolve({ code: result.css.toString() })
	}),
	plugins: [
	  autoprefixer
	],
	extract: true,
	extensions: ['.sass','.css']
})

export const buildmarkup = html({
    title: "Flywheel",
    meta: [
        {name: "viewport", content: "width=device-width, initial-scale=1.0"}
    ]
})

export const minify = terser({
	ecma: 2020,
	mangle: { toplevel: true },
	compress: {
	  module: true,
	  toplevel: true,
	  unsafe_arrows: true
	//   drop_console: !devMode,
	//   drop_debugger: !devMode
	},
	output: { quote_style: 1 }
})

export const copystaticfiles = copy(
	{
		targets: [
			{ src: './src/images/*', dest: `${distfolder}/images` }
		]
	}
);
