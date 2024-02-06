import type { KnipConfig } from 'knip'

export default {
  ignoreExportsUsedInFile: true,
  ignore: ['./examples/**'],
  ignoreDependencies: [
    'eslint-import-resolver-typescript',
    'lint-staged',
    '@commitlint/cli',
  ],
  ignoreBinaries: [],
  typescript: { config: ['tsconfig.*.json'] },
  prettier: { config: ['.prettierrc.js'] },
  eslint: { config: ['.eslintrc.cjs'] },
  'lint-staged': { config: ['.lintstagedrc.js'] },
  commitlint: { config: ['commitlint.config.js'] },
  'github-actions': {
    config: ['.github/workflows/*.yml', '.github/actions/**/*.yml'],
  },
  cspell: { config: ['cspell.json'] },
} satisfies KnipConfig
