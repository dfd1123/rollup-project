import babel from "@rollup/plugin-babel";
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const defaultConfig = {
    // external: ['react', 'react-dom'],
    // external: [/@babel\/runtime/],
    plugins: [
        json(),
        typescript(),
        babel({
            babelHelpers: 'runtime',
            exclude: 'node_modules/**',
            extensions
        })
    ],
}

export default [
    {
        ...defaultConfig,
        input: './src/test.ts',
        output: [
            {
                file: 'dist/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/index.esm.js',
                format: 'esm',
                sourcemap: true,
            }
        ]
    },
    {
        ...defaultConfig,
        input: './src/modules/index.ts',
        output: [
            {
                file: 'dist/modules/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/modules/index.esm.js',
                format: 'esm',
                sourcemap: true,
            }
        ]
    },
    {
        ...defaultConfig,
        input: './src/components/index.tsx',
        output: [
            {
                file: 'dist/modules/index.cjs.js',
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: 'dist/modules/index.esm.js',
                format: 'esm',
                sourcemap: true,
            }
        ]
    }
]