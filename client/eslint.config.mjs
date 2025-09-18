//  @ts-check
import { tanstackConfig } from '@tanstack/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...tanstackConfig,
  // TODO: look into this want to enable 'prefer-inline' imports.
  // {
  //   rules: {
  //     'import-x/consistent-type-specifier-style': ['warn', 'prefer-inline'],
  //   },
  // },
]
