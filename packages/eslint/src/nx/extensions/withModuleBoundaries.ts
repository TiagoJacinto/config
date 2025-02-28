export default (depConstraints: unknown[]) => [
  {
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: depConstraints || [],
        },
      ],
    },
  },
];
