import type { KnipConfig } from 'knip'

export default {
  ignore: ['./examples/**'],
  prettier: { config: ['prettier.config.js'] },
  eslint: { config: ['eslint.config.js'] },
  commitlint: { config: ['commitlint.config.js'] },
} satisfies KnipConfig
