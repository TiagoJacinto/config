import { Linter } from 'eslint';
import functional from 'eslint-plugin-functional';

export default <Linter.Config[]>[
  functional.configs.off,
  {
    rules: {
      'functional/no-loop-statements': 'error',
      'functional/prefer-property-signatures': [
        'error',
        {
          ignoreIfReadonlyWrapped: true,
        },
      ],
    },
  },
];
