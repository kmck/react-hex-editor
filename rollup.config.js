import fs from 'fs';
import path from 'path';

import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const themeSrc = 'src/themes'
const themeOut = 'themes';

export default [
  ...fs.readdirSync(themeSrc).map(themeFilename => ({
    input: path.join(themeSrc, themeFilename),
    output: {
      dir: themeOut,
      format: 'cjs',
    },
    plugins: [
      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          compilerOptions: {
            declarationDir: themeOut,
            noEmit: true,
          },
          include: [
            'src/themes/**/*',
          ],
        },
        useTsconfigDeclarationDir: true,
      }),
    ],
  })),
  {
    input: 'src/index.tsx',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      external({ includeDependencies: true }),
      resolve(),
      typescript({
        clean: true,
        rollupCommonJSResolveHack: true,
        tsconfigOverride: {
          compilerOptions: {
            noEmit: true,
          },
        },
      }),
      commonjs(),
    ],
  },
];
