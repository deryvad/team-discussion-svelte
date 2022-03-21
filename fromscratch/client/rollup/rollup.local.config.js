import rollup from './rollup.config';
import serve from 'rollup-plugin-serve-proxy';
import {distfolder} from './rollup.parts.config';

rollup.output = {
    ...rollup.output, 
    sourcemap: true
}

rollup.plugins = [
    ...rollup.plugins,
    serve({
        contentBase: [distfolder],
        host: 'localhost',
        port: 3001,
        ssl: true,
        proxy: {
            api: 'http://localhost:5000'
        }
    })
]

export default rollup;