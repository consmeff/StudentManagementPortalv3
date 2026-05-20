module.exports = {
    root: true,
    ignorePatterns: ['dist/**/*', 'coverage/**/*', 'node_modules/**/*', 'output/**/*'],
    overrides: [
        {
            files: ['**/*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.spec.json'],
                tsconfigRootDir: __dirname,
                sourceType: 'module',
                ecmaVersion: 'latest'
            },
            env: {
                browser: true,
                es2022: true
            },
            extends: [
                'airbnb-base',
                'airbnb-typescript/base',
                'plugin:@typescript-eslint/recommended',
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
                'prettier'
            ],
            settings: {
                'import/parsers': {
                    '@typescript-eslint/parser': ['.ts']
                },
                'import/resolver': {
                    typescript: {
                        project: ['./tsconfig.json', './tsconfig.app.json', './tsconfig.spec.json']
                    },
                    node: {
                        extensions: ['.js', '.ts']
                    }
                }
            },
            rules: {
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: 'app',
                        style: 'kebab-case'
                    }
                ],
                '@angular-eslint/component-class-suffix': [
                    'error',
                    {
                        suffixes: ['']
                    }
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix: 'app',
                        style: 'camelCase'
                    }
                ],
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_'
                    }
                ],
                '@typescript-eslint/no-use-before-define': 'off',
                'class-methods-use-this': 'off',
                'import/extensions': [
                    'error',
                    'ignorePackages',
                    {
                        js: 'never',
                        ts: 'never'
                    }
                ],
                'import/no-extraneous-dependencies': [
                    'error',
                    {
                        devDependencies: [
                            '**/*.spec.ts',
                            '**/test.ts',
                            '**/*.config.js',
                            'src/test.ts'
                        ]
                    }
                ],
                'import/prefer-default-export': 'off',
                'no-console': 'off',
                'no-plusplus': 'off',
                'no-underscore-dangle': 'off'
            }
        },
        {
            files: ['**/*.html'],
            extends: ['plugin:@angular-eslint/template/recommended', 'plugin:@angular-eslint/template/accessibility', 'prettier']
        },
        {
            files: ['**/*.js'],
            env: {
                node: true,
                es2022: true
            },
            extends: ['airbnb-base', 'prettier'],
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            },
            rules: {
                'import/no-extraneous-dependencies': [
                    'error',
                    {
                        devDependencies: true
                    }
                ],
                'no-console': 'off'
            }
        }
    ]
};
