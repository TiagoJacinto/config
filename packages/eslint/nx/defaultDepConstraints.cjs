export const defaultDepConstraints = [
  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },
  {
    sourceTag: 'scope:backend',
    onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
  },
  {
    sourceTag: 'scope:frontend',
    onlyDependOnLibsWithTags: ['scope:frontend', 'scope:shared'],
  },
  {
    sourceTag: 'scope:tools',
    onlyDependOnLibsWithTags: ['scope:tools', 'scope:shared'],
  },
  {
    sourceTag: 'type:lib',
    onlyDependOnLibsWithTags: ['type:lib'],
  },
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: ['type:lib', 'type:app'],
  },
];
