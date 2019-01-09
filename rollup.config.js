import typescript from 'rollup-plugin-typescript2'
import external from 'rollup-plugin-peer-deps-external'
//import postcss from 'rollup-plugin-postcss-modules'
//import postcss from 'rollup-plugin-postcss'
//import resolve from 'rollup-plugin-node-resolve'
//import url from 'rollup-plugin-url'
//import svgr from '@svgr/rollup'

import pkg from './package.json'

export default[
{
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        //postcss({
        //  modules: true
        //}),
        //url({ exclude: ['**/*.svg'] }),
        //svgr(),
        //resolve(),
        typescript({
        rollupCommonJSResolveHack: true,
        clean: true
        }),
        //commonjs()
    ]
},

{
    input: 'src/react-cartesian/index.tsx',
    output: [
        {
            file: 'react/index.js',
            format: 'cjs',
            exports: 'named',
            sourcemap: true
        }
    ],
    plugins: [
        external(),
        //postcss({
        //  modules: true
        //}),
        //url({ exclude: ['**/*.svg'] }),
        //svgr(),
        //resolve(),
        typescript({
            rollupcommonjsresolvehack: true,
            clean: true
        }),
        //commonjs()
    ]
}
]