import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'dist-ssr', 'node_modules', 'vendor', 'graphify-out'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global', 'args', 'attach', 'intensity', 'position', 'rotation', 'castShadow', 'receiveShadow', 'dispose', 'object', 'geometry', 'material', 'transparent', 'opacity', 'side', 'toneMapped', 'roughness', 'metalness', 'envMapIntensity', 'flatShading', 'wireframe', 'color', 'map', 'emissive', 'emissiveIntensity', 'shadow-mapSize', 'angle', 'penumbra', 'decay', 'distance', 'target', 'visible', 'frustumCulled', 'renderOrder', 'scale', 'alphaTest', 'depthWrite', 'depthTest', 'blending', 'vertexColors', 'size', 'sizeAttenuation', 'count', 'array', 'itemSize', 'uniforms', 'vertexShader', 'fragmentShader', 'linewidth'] }],
      'react-refresh/only-export-components': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
]
