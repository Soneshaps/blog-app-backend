import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['node_modules', 'build'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Disallow the use of `any`
            '@typescript-eslint/explicit-module-boundary-types': 'off', // Optional: Avoid requiring explicit return types
        },
    }
)
