/* ~~/vitest.config.ts */

// imports
import { defineConfig } from 'vitest/config'

// https://vitest.dev/guide/#configuring-vitest
export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    threads: false,
  },
})
