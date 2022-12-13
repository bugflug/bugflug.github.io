import json from '@rollup/plugin-json'

export default {
    plugins: [json()],
    input: 'src/index.js',
    output: {
        file: 'bundle/index.js',
        format: 'iife',
        name: 'frag'
    }
}